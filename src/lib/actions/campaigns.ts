"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { createCampaignSchema, contentSchema, actionSchema } from "@/lib/validations";
import { PLAN_LIMITS } from "@/lib/stripe";
import { slugify } from "@/lib/utils";
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

  const plan = user.subscriptions?.[0]?.plan || "FREE";
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]?.unlocks ?? Infinity;

  if (limit !== Infinity) {
    const count = await db.campaign.count({ where: { userId: user.id } });
    if (count >= limit) {
      throw new Error(`Free plan limited to ${limit} unlocks. Upgrade to Pro.`);
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
  }
) {
  const user = await requireUser();
  const campaign = await db.campaign.findFirst({
    where: { id: campaignId, userId: user.id },
  });
  if (!campaign) throw new Error("Campaign not found");

  await db.campaign.update({
    where: { id: campaignId },
    data,
  });

  revalidatePath(`/create`);
  return { success: true };
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
  return updated;
}

export async function deleteCampaign(campaignId: string) {
  const user = await requireUser();
  const campaign = await db.campaign.findFirst({
    where: { id: campaignId, userId: user.id },
  });
  if (!campaign) throw new Error("Campaign not found");

  await db.campaign.delete({ where: { id: campaignId } });
  revalidatePath("/unlocks");
  return { success: true };
}

export async function getUserCampaigns() {
  const user = await requireUser();
  return db.campaign.findMany({
    where: { userId: user.id },
    include: { content: true, actions: true, _count: { select: { analyticsEvents: true } } },
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
}) {
  const user = await requireUser();

  if (data.username && data.username !== user.username) {
    const existing = await db.user.findUnique({ where: { username: data.username } });
    if (existing) throw new Error("Username taken");
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data,
  });

  revalidatePath("/profile");
  return updated;
}
