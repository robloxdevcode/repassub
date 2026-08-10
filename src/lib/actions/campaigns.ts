"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { createCampaignSchema, contentSchema, actionSchema, updateProfileSchema } from "@/lib/validations";
import { getUserPlan, isProPlan, getActionLimit, PLAN_LIMITS, getUnlockQuotaWindowStart, getUnlockQuotaResetAt } from "@/lib/stripe";
import { slugify } from "@/lib/utils";
import { getUnlockUrlForRequest } from "@/lib/site-url";
import { campaignViewCountSelect } from "@/lib/analytics";
import type { ActionType, ContentType, VerificationMode, Prisma } from "@prisma/client";

export async function createCampaign(data: {
  title: string;
  description?: string;
  slug?: string;
  buttonText?: string;
  theme?: string;
  logoUrl?: string | null;
}) {
  const user = await requireUser();

  const plan = getUserPlan(user.subscriptions?.[0]?.plan);
  const limit = PLAN_LIMITS[plan].unlocks;

  if (limit !== Infinity) {
    const windowStart = getUnlockQuotaWindowStart();
    const count = await db.campaign.count({
      where: { userId: user.id, createdAt: { gte: windowStart } },
    });
    if (count >= limit) {
      throw new Error(
        `Free plan: ${limit} links per week. Delete an old link or upgrade to Pro for unlimited.`
      );
    }
  }

  const parsed = createCampaignSchema.parse({
    ...data,
    slug: data.slug || slugify(data.title),
  });

  const existing = await db.campaign.findUnique({
    where: { userId_slug: { userId: user.id, slug: parsed.slug } },
  });
  if (existing) throw new Error("Slug already in use");

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
  return campaign;
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

  await db.content.upsert({
    where: { campaignId },
    create: { campaignId, ...content },
    update: content,
  });

  revalidatePath(`/create`);
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

  const plan = getUserPlan(user.subscriptions?.[0]?.plan);
  const actionLimit = getActionLimit(plan);
  if (actions.length > actionLimit) {
    throw new Error(
      plan === "FREE"
        ? `Free plan allows ${actionLimit} steps per unlock. Upgrade to Pro for up to 4 steps.`
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

  revalidatePath(`/create`);
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
  }
) {
  const user = await requireUser();
  const campaign = await db.campaign.findFirst({
    where: { id: campaignId, userId: user.id },
  });
  if (!campaign) throw new Error("Campaign not found");

  const plan = getUserPlan(user.subscriptions?.[0]?.plan);
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
      ...(slug !== undefined ? { slug } : {}),
    },
  });

  revalidatePath(`/create`);
  revalidatePath(`/u/${user.username}/${updated.slug}`);
  return updated;
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

export async function updateProfile(data: {
  displayName?: string;
  bio?: string;
  username?: string;
  avatarUrl?: string | null;
}) {
  const user = await requireUser();
  const parsed = updateProfileSchema.parse(data);

  if (parsed.username && parsed.username !== user.username) {
    const existing = await db.user.findUnique({ where: { username: parsed.username } });
    if (existing) throw new Error("Username taken");
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: parsed,
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return updated;
}
