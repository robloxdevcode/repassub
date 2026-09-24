"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { createCampaignSchema, contentSchema, actionSchema, updateProfileSchema } from "@/lib/validations";
import { parseProfileSettings, PRO_PROFILE_STYLES, type ProfileSettings } from "@/lib/profile-settings";
import { getEffectiveUserPlan } from "@/lib/subscription-access";
import { isUsernameReserved } from "@/lib/username-resolve";
import { getUserPlan, isProPlan, getActionLimit, PLAN_LIMITS, getUnlockQuotaWindowStart, getUnlockQuotaResetAt } from "@/lib/stripe";
import { slugify } from "@/lib/utils";
import { getUnlockUrlForRequest } from "@/lib/site-url";
import { campaignViewCountSelect } from "@/lib/analytics";
import type { ActionType, ContentType, VerificationMode, Prisma } from "@prisma/client";

async function allocateUniqueSlug(userId: string, preferred: string) {
  const base = slugify(preferred) || "unlock";
  for (let i = 0; i < 50; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    const existing = await db.campaign.findUnique({
      where: { userId_slug: { userId, slug } },
    });
    if (!existing) return slug;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function createCampaign(data: {
  title: string;
  description?: string;
  slug?: string;
  buttonText?: string;
  theme?: string;
  logoUrl?: string | null;
}) {
  const user = await requireUser();

  const parsed = createCampaignSchema.parse({
    ...data,
    slug: data.slug || (await allocateUniqueSlug(user.id, data.title || "unlock")),
  });

  const campaign = await db.campaign.create({
    data: {
      userId: user.id,
      title: parsed.title,
      description: parsed.description,
      slug: parsed.slug,
      buttonText: parsed.buttonText,
      theme: parsed.theme,
      logoUrl: parsed.logoUrl,
      status: "DRAFT",
    },
  });

  revalidatePath("/unlocks");
  return { id: campaign.id, slug: campaign.slug, title: campaign.title };
}

export async function updateCampaignContent(
  campaignId: string,
  content: {
    type: ContentType;
    fileUrl?: string;
    fileName?: string;
    externalUrl?: string;
    textBody?: string;
  }
) {
  const user = await requireUser();
  const campaign = await db.campaign.findFirst({
    where: { id: campaignId, userId: user.id },
  });
  if (!campaign) throw new Error("Campaign not found");

  contentSchema.parse(content);

  const payload =
    content.type === "TEXT"
      ? {
          type: content.type,
          textBody: content.textBody,
          externalUrl: null,
          fileUrl: null,
          fileName: null,
        }
      : content.type === "URL"
        ? {
            type: content.type,
            externalUrl: content.externalUrl,
            textBody: null,
            fileUrl: null,
            fileName: null,
          }
        : {
            type: content.type,
            fileUrl: content.fileUrl,
            fileName: content.fileName,
            externalUrl: null,
            textBody: null,
          };

  await db.content.upsert({
    where: { campaignId },
    create: { campaignId, ...payload },
    update: payload,
  });

  revalidatePath("/unlocks");
  if (campaign.status === "PUBLISHED") {
    revalidatePath(`/u/${user.username}/${campaign.slug}`);
  }

  return { success: true };
}

export async function updateCampaignActions(
  campaignId: string,
  actions: Array<{
    type: ActionType;
    label: string;
    config?: Record<string, unknown>;
    verificationMode?: VerificationMode;
  }>
) {
  const user = await requireUser();
  const campaign = await db.campaign.findFirst({
    where: { id: campaignId, userId: user.id },
  });
  if (!campaign) throw new Error("Campaign not found");

  const plan = getEffectiveUserPlan(user.subscriptions?.[0]);
  const actionLimit = getActionLimit(plan);
  if (actions.length > actionLimit) {
    throw new Error(
      plan === "FREE"
        ? `Free plan allows ${actionLimit} steps per unlock. Upgrade to Pro for up to ${PLAN_LIMITS.PRO.actionsPerUnlock} steps.`
        : `Pro plan allows up to ${actionLimit} steps per unlock.`
    );
  }

  actions.forEach((a) => actionSchema.parse(a));

  await db.action.deleteMany({ where: { campaignId } });
  await db.action.createMany({
    data: actions.map((a, i) => ({
      campaignId,
      type: a.type,
      label: a.label,
      config: (a.config || {}) as Prisma.InputJsonValue,
      verificationMode: a.verificationMode || "MANUAL",
      sortOrder: i,
    })),
  });

  revalidatePath("/unlocks");
  if (campaign.status === "PUBLISHED") {
    revalidatePath(`/u/${user.username}/${campaign.slug}`);
  }

  return { success: true };
}

export async function updateCampaignCustomization(
  campaignId: string,
  data: {
    title?: string;
    description?: string;
    buttonText?: string;
    theme?: string;
    logoUrl?: string | null;
    slug?: string;
    backgroundMusicUrl?: string | null;
    backgroundVideoUrl?: string | null;
  }
) {
  const user = await requireUser();
  const campaign = await db.campaign.findFirst({
    where: { id: campaignId, userId: user.id },
  });
  if (!campaign) throw new Error("Campaign not found");

  const plan = getEffectiveUserPlan(user.subscriptions?.[0]);
  const pro = isProPlan(plan);

  let slug = data.slug;
  if (slug !== undefined && !pro) {
    slug = undefined;
  }
  if (slug !== undefined) {
    slug = slugify(slug);
    if (!slug) throw new Error("Link URL cannot be empty");
    const taken = await db.campaign.findFirst({
      where: { userId: user.id, slug, NOT: { id: campaignId } },
    });
    if (taken) throw new Error("That link URL is already used on one of your unlocks");
  }

  const updated = await db.campaign.update({
    where: { id: campaignId },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.buttonText !== undefined ? { buttonText: data.buttonText } : {}),
      ...(pro && data.theme !== undefined ? { theme: data.theme } : {}),
      ...(pro && data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
      ...(pro && data.backgroundMusicUrl !== undefined ? { backgroundMusicUrl: data.backgroundMusicUrl } : {}),
      ...(pro && data.backgroundVideoUrl !== undefined ? { backgroundVideoUrl: data.backgroundVideoUrl } : {}),
      ...(slug !== undefined ? { slug } : {}),
    },
  });

  revalidatePath(`/u/${user.username}/${updated.slug}`);
  return {
    id: updated.id,
    slug: updated.slug,
    title: updated.title,
    description: updated.description,
    buttonText: updated.buttonText,
    theme: updated.theme,
    logoUrl: updated.logoUrl,
    backgroundMusicUrl: updated.backgroundMusicUrl,
    backgroundVideoUrl: updated.backgroundVideoUrl,
  };
}

export async function publishCampaign(campaignId: string) {
  const user = await requireUser();
  const campaign = await db.campaign.findFirst({
    where: { id: campaignId, userId: user.id },
    include: { content: true, actions: true },
  });
  if (!campaign) throw new Error("Campaign not found");
  if (!campaign.content) throw new Error("Add content before publishing");
  if (campaign.actions.length === 0) throw new Error("Add at least one action");

  const plan = getEffectiveUserPlan(user.subscriptions?.[0]);
  const actionLimit = getActionLimit(plan);
  if (campaign.actions.length > actionLimit) {
    throw new Error(
      plan === "FREE"
        ? `Free plan allows ${actionLimit} step per link. Remove extra steps or upgrade to Pro.`
        : `Pro plan allows up to ${actionLimit} steps per link.`,
    );
  }

  const updated = await db.campaign.update({
    where: { id: campaignId },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  revalidatePath("/unlocks");
  revalidatePath(`/u/${user.username}/${campaign.slug}`);

  const unlockUrl = await getUnlockUrlForRequest(user.username, campaign.slug);
  return { ...updated, unlockUrl };
}

export async function deleteCampaign(campaignId: string) {
  const user = await requireUser();
  const campaign = await db.campaign.findFirst({
    where: { id: campaignId, userId: user.id },
  });
  if (!campaign) throw new Error("Campaign not found");

  await db.campaign.delete({ where: { id: campaignId } });
  revalidatePath("/unlocks");
  revalidatePath("/dashboard");
  revalidatePath("/create");
  return { success: true };
}

export async function getUnlockQuota() {
  const user = await requireUser();
  const plan = getUserPlan(user.subscriptions?.[0]?.plan);
  const limit = PLAN_LIMITS[plan].unlocks;

  if (limit === Infinity) {
    return { plan, limit, used: 0, remaining: Infinity as number, resetsAt: null as Date | null };
  }

  const windowStart = getUnlockQuotaWindowStart();
  const used = await db.campaign.count({
    where: { userId: user.id, createdAt: { gte: windowStart } },
  });

  const oldest = await db.campaign.findFirst({
    where: { userId: user.id, createdAt: { gte: windowStart } },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  return {
    plan,
    limit,
    used,
    remaining: Math.max(0, limit - used),
    resetsAt: oldest ? getUnlockQuotaResetAt(oldest.createdAt) : null,
  };
}

export async function getUserCampaigns() {
  const user = await requireUser();
  return db.campaign.findMany({
    where: { userId: user.id },
    include: {
      content: true,
      actions: true,
      _count: { select: campaignViewCountSelect },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCampaign(id: string) {
  const user = await requireUser();
  return db.campaign.findFirst({
    where: { id, userId: user.id },
    include: { content: true, actions: { orderBy: { sortOrder: "asc" } } },
  });
}

export type UpdateProfileResult =
  | { ok: true; username: string; displayName: string | null; bio: string | null; avatarUrl: string | null }
  | { ok: false; message: string };

function formatZodError(error: z.ZodError): string {
  const first = error.issues[0];
  return first?.message ?? "Invalid profile data";
}

export async function updateProfile(data: {
  displayName?: string;
  bio?: string;
  username?: string;
  avatarUrl?: string | null;
}): Promise<UpdateProfileResult> {
  const user = await requireUser();
  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: formatZodError(parsed.error) };
  }

  const fields = parsed.data;
  const previousUsername = user.username;

  if (fields.username && fields.username !== user.username) {
    if (await isUsernameReserved(fields.username, user.id)) {
      return { ok: false, message: "That username is already taken" };
    }
  }

  const updateData: {
    displayName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    username?: string;
  } = {};

  if (fields.displayName !== undefined) updateData.displayName = fields.displayName;
  if (fields.bio !== undefined) updateData.bio = fields.bio;
  if (fields.avatarUrl !== undefined) updateData.avatarUrl = fields.avatarUrl;
  if (fields.username !== undefined) updateData.username = fields.username;

  if (Object.keys(updateData).length === 0) {
    return {
      ok: true,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    };
  }

  try {
    const updated = await db.$transaction(async (tx) => {
      const row = await tx.user.update({
        where: { id: user.id },
        data: updateData,
      });

      if (row.username !== previousUsername) {
        await tx.usernameAlias.upsert({
          where: { username: previousUsername.toLowerCase() },
          create: { username: previousUsername.toLowerCase(), userId: user.id },
          update: { userId: user.id },
        });
      }

      return row;
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath(`/u/${previousUsername}`);
    if (updated.username !== previousUsername) {
      revalidatePath(`/u/${updated.username}`);
    }

    return {
      ok: true,
      username: updated.username,
      displayName: updated.displayName,
      bio: updated.bio,
      avatarUrl: updated.avatarUrl,
    };
  } catch (error) {
    console.error("[updateProfile]", error);
    return { ok: false, message: "Could not save profile. Try again in a moment." };
  }
}

export async function getProfileCustomization() {
  const user = await requireUser();
  return {
    settings: parseProfileSettings(user.profileSettings),
    role: user.role,
    staffRole: user.staffRole,
  };
}

export async function updateProfileCustomization(settings: unknown): Promise<ProfileSettings> {
  const user = await requireUser();
  let parsed = parseProfileSettings(settings);
  const effectivePlan = getEffectiveUserPlan(user.subscriptions?.[0]);
  const isPro = effectivePlan === "PRO" || effectivePlan === "BUSINESS";

  if (!isPro) {
    if (PRO_PROFILE_STYLES.includes(parsed.style)) {
      parsed = { ...parsed, style: "neon" };
    }
    if (parsed.appTheme !== "classic") {
      parsed = { ...parsed, appTheme: "classic" };
    }
  }

  const toSave = { ...parsed, awardedBadges: [] as string[] };

  await db.user.update({
    where: { id: user.id },
    data: { profileSettings: toSave },
  });

  revalidatePath("/profile");
  revalidatePath(`/u/${user.username}`);
  revalidatePath("/dashboard");
  revalidatePath("/", "layout");
  return toSave;
}
