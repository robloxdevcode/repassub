"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const SETTINGS_TYPE = "leaderboard_settings";

export async function getLeaderboardOptIn(): Promise<boolean> {
  const user = await requireUser();
  const row = await db.notification.findFirst({
    where: { userId: user.id, type: SETTINGS_TYPE },
    select: { payload: true },
  });
  return !!(row?.payload as { optIn?: boolean })?.optIn;
}

export async function setLeaderboardOptIn(optIn: boolean) {
  const user = await requireUser();
  const existing = await db.notification.findFirst({
    where: { userId: user.id, type: SETTINGS_TYPE },
  });

  if (existing) {
    await db.notification.update({
      where: { id: existing.id },
      data: { payload: { optIn }, read: true },
    });
  } else {
    await db.notification.create({
      data: {
        userId: user.id,
        type: SETTINGS_TYPE,
        title: "Leaderboard",
        message: optIn ? "You joined the weekly leaderboard." : "You left the weekly leaderboard.",
        payload: { optIn },
        read: true,
      },
    });
  }

  revalidatePath("/leaderboard");
  revalidatePath("/settings");
}

export type LeaderboardEntry = {
  rank: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  unlocks: number;
};

export async function getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
  const weekStart = new Date();
  weekStart.setUTCDate(weekStart.getUTCDate() - 7);
  weekStart.setUTCHours(0, 0, 0, 0);

  const optedInRows = await db.notification.findMany({
    where: { type: SETTINGS_TYPE },
    select: { userId: true, payload: true },
  });
  const optedInIds = new Set(
    optedInRows
      .filter((row) => !!(row.payload as { optIn?: boolean })?.optIn)
      .map((row) => row.userId)
  );

  if (optedInIds.size === 0) return [];

  const grouped = await db.analyticsEvent.groupBy({
    by: ["campaignId"],
    where: {
      type: "UNLOCK",
      createdAt: { gte: weekStart },
      campaign: { userId: { in: [...optedInIds] } },
    },
    _count: { type: true },
  });

  if (grouped.length === 0) return [];

  const campaigns = await db.campaign.findMany({
    where: { id: { in: grouped.map((g) => g.campaignId) } },
    select: {
      id: true,
      userId: true,
      user: { select: { username: true, displayName: true, avatarUrl: true, banned: true } },
    },
  });

  const byUser = new Map<string, { user: (typeof campaigns)[0]["user"]; unlocks: number }>();
  for (const row of grouped) {
    const campaign = campaigns.find((c) => c.id === row.campaignId);
    if (!campaign || campaign.user.banned) continue;
    const prev = byUser.get(campaign.userId);
    byUser.set(campaign.userId, {
      user: campaign.user,
      unlocks: (prev?.unlocks ?? 0) + row._count.type,
    });
  }

  return [...byUser.entries()]
    .sort((a, b) => b[1].unlocks - a[1].unlocks)
    .slice(0, 20)
    .map(([userId, data], index) => ({
      rank: index + 1,
      username: data.user.username,
      displayName: data.user.displayName,
      avatarUrl: data.user.avatarUrl,
      unlocks: data.unlocks,
    }));
}
