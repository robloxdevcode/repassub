"use server";

import { db } from "@/lib/db";
import { trackEvent } from "@/lib/analytics";
import { getAnalyticsContext } from "@/lib/analytics-context";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { CampaignStatus } from "@prisma/client";

async function getPublishedCampaign(campaignId: string) {
  const campaign = await db.campaign.findUnique({
    where: { id: campaignId },
    include: {
      user: { select: { banned: true } },
      actions: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!campaign || campaign.user.banned || campaign.status !== CampaignStatus.PUBLISHED) {
    throw new Error("This unlock link is no longer available");
  }

  return campaign;
}

export async function getOrCreateVisitorId(clientVisitorId?: string) {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get("linklock_visitor")?.value;
  let visitorId = clientVisitorId || fromCookie;

  if (!visitorId) {
    visitorId = uuidv4();
  }

  if (fromCookie !== visitorId) {
    cookieStore.set("linklock_visitor", visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return visitorId;
}

export async function getPublicCampaign(username: string, slug: string) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user || user.banned) return null;

  const campaign = await db.campaign.findFirst({
    where: { userId: user.id, slug, status: "PUBLISHED" },
    include: {
      content: true,
      actions: { orderBy: { sortOrder: "asc" } },
      user: {
        select: {
          username: true,
          displayName: true,
          avatarUrl: true,
          subscriptions: { select: { plan: true }, where: { status: "ACTIVE" }, take: 1 },
        },
      },
    },
  });

  return campaign;
}

export async function getUnlockSession(campaignId: string, clientVisitorId?: string) {
  const visitorId = await getOrCreateVisitorId(clientVisitorId);
  const campaign = await getPublishedCampaign(campaignId);

  const actionIds = new Set(campaign.actions.map((a) => a.id));

  const existing = await db.unlockSession.findFirst({
    where: { campaignId, visitorId },
    orderBy: { updatedAt: "desc" },
  });

  if (!existing) {
    const session = await db.unlockSession.create({
      data: { campaignId, visitorId, status: "STARTED", completedActions: [] },
    });
    await trackEvent({ campaignId, type: "START", ...(await getAnalyticsContext()) });
    return session;
  }

  const rawCompleted = (existing.completedActions as string[]) || [];
  const completedActions = rawCompleted.filter((id) => actionIds.has(id));

  if (completedActions.length !== rawCompleted.length) {
    return db.unlockSession.update({
      where: { id: existing.id },
      data: { completedActions },
    });
  }

  return existing;
}

export async function completeAction(
  campaignId: string,
  actionId: string,
  clientVisitorId?: string
) {
  const visitorId = await getOrCreateVisitorId(clientVisitorId);

  const campaign = await getPublishedCampaign(campaignId);
  const actionIds = new Set(campaign.actions.map((a) => a.id));
  if (!actionIds.has(actionId)) throw new Error("Action not found");

  let session = await db.unlockSession.findFirst({
    where: { campaignId, visitorId },
    orderBy: { updatedAt: "desc" },
  });

  if (!session) {
    session = await db.unlockSession.create({
      data: { campaignId, visitorId, status: "STARTED", completedActions: [] },
    });
  }

  const completed = ((session.completedActions as string[]) || []).filter((id) => actionIds.has(id));
  if (!completed.includes(actionId)) {
    completed.push(actionId);
  }

  const allComplete = campaign.actions.every((a) => completed.includes(a.id));
  const status = allComplete ? "COMPLETED" : "IN_PROGRESS";

  const updated = await db.unlockSession.update({
    where: { id: session.id },
    data: {
      completedActions: completed,
      status,
    },
  });

  await trackEvent({
    campaignId,
    type: "ACTION_COMPLETE",
    metadata: { actionId },
    ...(await getAnalyticsContext()),
  });

  return { session: updated, allComplete };
}

export async function unlockContent(campaignId: string, clientVisitorId?: string) {
  const visitorId = await getOrCreateVisitorId(clientVisitorId);

  const campaign = await db.campaign.findUnique({
    where: { id: campaignId },
    include: {
      actions: true,
      content: true,
      user: { select: { banned: true } },
    },
  });
  if (!campaign || campaign.user.banned || campaign.status !== CampaignStatus.PUBLISHED) {
    throw new Error("This unlock link is no longer available");
  }

  const session = await db.unlockSession.findFirst({
    where: { campaignId, visitorId },
    orderBy: { updatedAt: "desc" },
  });

  if (!session) {
    throw new Error("Complete all actions first");
  }

  const actionIds = new Set(campaign.actions.map((a) => a.id));
  const completed = ((session.completedActions as string[]) || []).filter((id) => actionIds.has(id));
  const allComplete = campaign.actions.length > 0 && campaign.actions.every((a) => completed.includes(a.id));

  if (!allComplete) {
    throw new Error("Complete all actions first");
  }

  const updated = await db.unlockSession.update({
    where: { id: session.id },
    data: { status: "UNLOCKED", unlockedAt: new Date(), completedActions: completed },
  });

  await trackEvent({ campaignId, type: "UNLOCK", ...(await getAnalyticsContext()) });

  return { session: updated, content: campaign.content };
}

export async function trackCampaignView(campaignId: string) {
  const campaign = await db.campaign.findFirst({
    where: { id: campaignId, status: CampaignStatus.PUBLISHED, user: { banned: false } },
    select: { id: true },
  });
  if (!campaign) return;
  await trackEvent({ campaignId, type: "VIEW", ...(await getAnalyticsContext()) });
}

export async function submitEmailAction(campaignId: string, email: string, name?: string) {
  const campaign = await db.campaign.findUnique({
    where: { id: campaignId },
    include: { user: true },
  });
  if (!campaign || campaign.user.banned || campaign.status !== CampaignStatus.PUBLISHED) {
    throw new Error("This unlock link is no longer available");
  }

  await db.audienceMember.create({
    data: {
      userId: campaign.userId,
      email,
      name,
      source: campaign.slug,
      status: "ACTIVE",
    },
  });

  return { success: true };
}
