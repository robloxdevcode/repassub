import { AnalyticsEventType, Prisma } from "@prisma/client";
import { db } from "./db";
import { hasDatabaseUrl } from "./env";

export const campaignViewCountSelect = {
  analyticsEvents: {
    where: { type: "VIEW" as AnalyticsEventType },
  },
} satisfies Prisma.CampaignCountOutputTypeSelect;

export type TrackEventInput = {
  campaignId: string;
  type: AnalyticsEventType;
  source?: string;
  country?: string;
  device?: string;
  browser?: string;
  metadata?: Record<string, unknown>;
};

export async function trackEvent(input: TrackEventInput) {
  return db.analyticsEvent.create({
    data: {
      campaignId: input.campaignId,
      type: input.type,
      source: input.source,
      country: input.country,
      device: input.device,
      browser: input.browser,
      metadata: (input.metadata || {}) as Prisma.InputJsonValue,
    },
  });
}

export async function getCampaignAnalytics(campaignId: string) {
  const events = await db.analyticsEvent.groupBy({
    by: ["type"],
    where: { campaignId },
    _count: { type: true },
  });

  const counts = Object.fromEntries(
    events.map((e) => [e.type, e._count.type])
  ) as Record<string, number>;

  return {
    views: counts.VIEW || 0,
    started: counts.START || 0,
    actionComplete: counts.ACTION_COMPLETE || 0,
    unlocked: counts.UNLOCK || 0,
    conversion:
      counts.VIEW > 0
        ? ((counts.UNLOCK || 0) / counts.VIEW) * 100
        : 0,
  };
}

export async function getUserAnalytics(userId: string) {
  const campaigns = await db.campaign.findMany({
    where: { userId },
    select: { id: true },
  });

  const campaignIds = campaigns.map((c) => c.id);
  if (campaignIds.length === 0) {
    return { views: 0, started: 0, actionComplete: 0, unlocked: 0, conversion: 0 };
  }

  const events = await db.analyticsEvent.groupBy({
    by: ["type"],
    where: { campaignId: { in: campaignIds } },
    _count: { type: true },
  });

  const counts = Object.fromEntries(
    events.map((e) => [e.type, e._count.type])
  ) as Record<string, number>;

  const views = counts.VIEW || 0;
  const unlocked = counts.UNLOCK || 0;

  return {
    views,
    started: counts.START || 0,
    actionComplete: counts.ACTION_COMPLETE || 0,
    unlocked,
    conversion: views > 0 ? (unlocked / views) * 100 : 0,
  };
}

export async function getAnalyticsBreakdown(userId: string) {
  const campaigns = await db.campaign.findMany({
    where: { userId },
    select: { id: true, title: true, slug: true },
  });

  const campaignIds = campaigns.map((c) => c.id);

  const [bySource, byDevice, byCountry] = await Promise.all([
    db.analyticsEvent.groupBy({
      by: ["source"],
      where: { campaignId: { in: campaignIds }, source: { not: null } },
      _count: { source: true },
      orderBy: { _count: { source: "desc" } },
      take: 10,
    }),
    db.analyticsEvent.groupBy({
      by: ["device"],
      where: { campaignId: { in: campaignIds }, device: { not: null } },
      _count: { device: true },
    }),
    db.analyticsEvent.groupBy({
      by: ["country"],
      where: { campaignId: { in: campaignIds }, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 10,
    }),
  ]);

  return { bySource, byDevice, byCountry, campaigns };
}

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export type PlatformStats = {
  creators: number;
  unlocksToday: number;
  publishedLinks: number;
};

export async function getPlatformStats(): Promise<PlatformStats> {
  if (!hasDatabaseUrl()) {
    return { creators: 0, unlocksToday: 0, publishedLinks: 0 };
  }

  try {
    const dayStart = startOfUtcDay();
    const [creators, unlocksToday, publishedLinks] = await Promise.all([
      db.user.count(),
      db.analyticsEvent.count({
        where: { type: "UNLOCK", createdAt: { gte: dayStart } },
      }),
      db.campaign.count({ where: { status: "PUBLISHED" } }),
    ]);

    return { creators, unlocksToday, publishedLinks };
  } catch {
    return { creators: 0, unlocksToday: 0, publishedLinks: 0 };
  }
}

export async function getRecentUnlockFeed(limit = 8): Promise<string[]> {
  if (!hasDatabaseUrl()) {
    return ["Create your first unlock link on Linklock"];
  }

  try {
    const events = await db.analyticsEvent.findMany({
      where: { type: "UNLOCK" },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        campaign: {
          select: {
            title: true,
            user: { select: { username: true } },
          },
        },
      },
    });

    if (events.length === 0) {
      return ["Linklock is live — be the first creator to publish an unlock link"];
    }

    return events.map(
      (event) =>
        `@${event.campaign.user.username} — "${event.campaign.title}" was unlocked`
    );
  } catch {
    return ["Linklock unlock links — subscribe, follow, then get the content"];
  }
}
