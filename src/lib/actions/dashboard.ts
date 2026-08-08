"use server";

import { requireUser, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserAnalytics, getAnalyticsBreakdown } from "@/lib/analytics";

export async function getDashboardStats() {
  const user = await requireUser();

  const [analytics, campaignCount, audienceCount, payments] = await Promise.all([
    getUserAnalytics(user.id),
    db.campaign.count({ where: { userId: user.id, status: "PUBLISHED" } }),
    db.audienceMember.count({ where: { userId: user.id } }),
    db.payment.aggregate({
      where: { userId: user.id, status: "SUCCEEDED" },
      _sum: { amount: true },
    }),
  ]);

  const recentEvents = await db.analyticsEvent.findMany({
    where: { campaign: { userId: user.id } },
    include: { campaign: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return {
    analytics,
    campaignCount,
    audienceCount,
    revenue: payments._sum.amount || 0,
    recentEvents,
    user,
  };
}

export async function getAnalyticsData() {
  const user = await requireUser();
  const [analytics, breakdown] = await Promise.all([
    getUserAnalytics(user.id),
    getAnalyticsBreakdown(user.id),
  ]);
  return { analytics, breakdown };
}

export async function getAudienceData() {
  const user = await requireUser();
  return db.audienceMember.findMany({
    where: { userId: user.id },
    orderBy: { joinedAt: "desc" },
  });
}

export async function getAdminStats() {
  await requireAdmin();

  const [userCount, campaignCount, reportCount, revenue, bannedCount] = await Promise.all([
    db.user.count(),
    db.campaign.count({ where: { status: "PUBLISHED" } }),
    db.report.count({ where: { status: "OPEN" } }),
    db.payment.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amount: true } }),
    db.user.count({ where: { banned: true } }),
  ]);

  return { userCount, campaignCount, reportCount, revenue: revenue._sum.amount || 0, bannedCount };
}

export async function getAdminUsers() {
  await requireAdmin();
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { campaigns: true } } },
    take: 50,
  });
}

export async function banUser(userId: string, banned: boolean) {
  await requireAdmin();
  return db.user.update({ where: { id: userId }, data: { banned } });
}
