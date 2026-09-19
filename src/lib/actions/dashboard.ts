"use server";

import { revalidatePath } from "next/cache";
import { requireUser, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserAnalytics, getAnalyticsBreakdown, getBasicCampaignBreakdown, campaignViewCountSelect } from "@/lib/analytics";
import { getActionLimit, getUserPlan, hasAdvancedAnalytics } from "@/lib/stripe";
import { CampaignStatus, UserRole } from "@prisma/client";

export type AdminBanResult = { ok: true } | { ok: false; message: string };

export async function getDashboardStats() {
  const user = await requireUser();
  const plan = getUserPlan(user.subscriptions?.[0]?.plan);

  const [analytics, campaignCount, recentCampaigns] = await Promise.all([
    getUserAnalytics(user.id),
    db.campaign.count({ where: { userId: user.id, status: "PUBLISHED" } }),
    db.campaign.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        _count: {
          select: {
            actions: true,
            ...campaignViewCountSelect,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    analytics,
    campaignCount,
    recentCampaigns,
    plan,
    actionLimit: getActionLimit(plan),
    user,
  };
}

export async function getAnalyticsData() {
  const user = await requireUser();
  const plan = getUserPlan(user.subscriptions?.[0]?.plan);
  const proAnalytics = hasAdvancedAnalytics(plan);
  const [analytics, breakdown, basicBreakdown] = await Promise.all([
    getUserAnalytics(user.id),
    proAnalytics ? getAnalyticsBreakdown(user.id) : Promise.resolve(null),
    getBasicCampaignBreakdown(user.id),
  ]);
  return {
    analytics,
    breakdown,
    campaignStats: basicBreakdown.campaignStats,
    plan,
    hasAdvancedAnalytics: proAnalytics,
  };
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

export async function banUser(userId: string, banned: boolean): Promise<AdminBanResult> {
  try {
    const admin = await requireAdmin();
    const trimmedId = userId?.trim();
    if (!trimmedId) {
      return { ok: false, message: "Missing user id" };
    }
    if (banned && admin.id === trimmedId) {
      return { ok: false, message: "You cannot ban your own account" };
    }

    const target = await db.user.findUnique({ where: { id: trimmedId } });
    if (!target) return { ok: false, message: "User not found" };
    if (banned && target.role === UserRole.ADMIN) {
      return { ok: false, message: "Admin accounts cannot be banned" };
    }

    await db.$transaction(async (tx) => {
      await tx.user.update({ where: { id: trimmedId }, data: { banned } });
      if (banned) {
        await tx.campaign.updateMany({
          where: { userId: trimmedId },
          data: { status: CampaignStatus.DRAFT },
        });
      }
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    console.error("[banUser]", error);
    const message = error instanceof Error ? error.message : "Could not update user";
    if (message === "Unauthorized" || message === "Forbidden" || message === "Account suspended") {
      return { ok: false, message: "You do not have permission to do that" };
    }
    return { ok: false, message: "Could not update user. Try again in a moment." };
  }
}
