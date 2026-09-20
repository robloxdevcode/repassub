"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { requireUser, requireAdmin, requireAdminPanel, requireModerator } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserAnalytics, getAnalyticsBreakdown, getBasicCampaignBreakdown, campaignViewCountSelect } from "@/lib/analytics";
import { getActionLimit, getUserPlan, hasAdvancedAnalytics } from "@/lib/stripe";
import { CampaignStatus, StaffRole, UserRole } from "@prisma/client";
import { isProtectedStaff } from "@/lib/admin-access";

export type AdminBanResult =
  | { ok: true; clerkSynced?: boolean }
  | { ok: false; message: string };

async function syncClerkSuspension(clerkId: string, banned: boolean, banReason?: string | null) {
  const client = await clerkClient();
  let synced = false;

  try {
    const clerkUser = await client.users.getUser(clerkId);
    const meta = {
      ...(clerkUser.publicMetadata as Record<string, unknown>),
      linklockBanned: banned,
      banReason: banned ? (banReason?.trim() || "Suspended by Linklock staff.") : null,
    };
    await client.users.updateUser(clerkId, { publicMetadata: meta });
    synced = true;
  } catch (error) {
    console.error("[banUser] Clerk metadata update failed", error);
  }

  try {
    let offset = 0;
    const limit = 100;
    for (;;) {
      const { data } = await client.sessions.getSessionList({ userId: clerkId, limit, offset });
      if (!data.length) break;
      await Promise.all(data.map((session) => client.sessions.revokeSession(session.id)));
      if (data.length < limit) break;
      offset += limit;
    }
  } catch (error) {
    console.error("[banUser] Clerk session revoke failed", error);
  }

  return synced;
}

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
  await requireAdminPanel();

  const [userCount, campaignCount, reportCount, revenue, bannedCount] = await Promise.all([
    db.user.count(),
    db.campaign.count({ where: { status: "PUBLISHED" } }),
    db.report.count({ where: { status: "OPEN" } }),
    db.payment.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amount: true } }),
    db.user.count({ where: { banned: true } }),
  ]);

  return { userCount, campaignCount, reportCount, revenue: revenue._sum.amount || 0, bannedCount };
}

export async function getAdminUsers(search?: string) {
  await requireAdminPanel();
  const q = search?.trim();
  return db.user.findMany({
    where: q
      ? {
          OR: [
            { username: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { displayName: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { campaigns: true } } },
    take: 100,
  });
}

export async function getAdminLinks(search?: string) {
  await requireAdminPanel();
  const q = search?.trim();
  return db.campaign.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { user: { username: { contains: q, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: {
      user: { select: { username: true, staffRole: true, role: true } },
      _count: { select: campaignViewCountSelect },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function banUser(
  userId: string,
  banned: boolean,
  banReason?: string,
): Promise<AdminBanResult> {
  try {
    const admin = await requireModerator();
    const trimmedId = userId?.trim();
    if (!trimmedId) {
      return { ok: false, message: "Missing user id" };
    }
    if (banned && admin.id === trimmedId) {
      return { ok: false, message: "You cannot ban your own account" };
    }

    const target = await db.user.findUnique({ where: { id: trimmedId } });
    if (!target) return { ok: false, message: "User not found" };
    if (banned && isProtectedStaff(target)) {
      return { ok: false, message: "Staff and admin accounts cannot be banned" };
    }
    if (banned) {
      const reason = banReason?.trim();
      if (!reason || reason.length < 3) {
        return { ok: false, message: "Enter a suspension reason (at least 3 characters)" };
      }
    }

    const reasonToStore = banned ? banReason!.trim() : null;

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: trimmedId },
        data: { banned, banReason: reasonToStore },
      });
      if (banned) {
        await tx.campaign.updateMany({
          where: { userId: trimmedId },
          data: { status: CampaignStatus.DRAFT },
        });
      }
    });

    const clerkSynced = await syncClerkSuspension(target.clerkId, banned, reasonToStore);

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    revalidatePath("/suspended");
    return { ok: true, clerkSynced };
  } catch (error) {
    console.error("[banUser]", error);
    const message = error instanceof Error ? error.message : "Could not update user";
    if (message === "Unauthorized" || message === "Forbidden" || message === "Account suspended") {
      return { ok: false, message: "You do not have permission to do that" };
    }
    return { ok: false, message: "Could not update user. Try again in a moment." };
  }
}

export async function deleteAdminCampaign(campaignId: string): Promise<AdminBanResult> {
  try {
    const admin = await requireUser();
    const { canDeleteAdminLinks } = await import("@/lib/admin-access");
    if (!canDeleteAdminLinks(admin)) {
      return { ok: false, message: "Only Head admin or Owner can delete links" };
    }
    const id = campaignId?.trim();
    if (!id) return { ok: false, message: "Missing link id" };

    await db.campaign.delete({ where: { id } });

    revalidatePath("/admin/links");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    console.error("[deleteAdminCampaign]", error);
    return { ok: false, message: "Could not delete link" };
  }
}
