"use server";

import { requireAdminPanel } from "@/lib/auth";
import { db } from "@/lib/db";
import { isPaidStripePro } from "@/lib/subscription-access";

export async function getAdminRecentSignups(limit = 40) {
  await requireAdminPanel();
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      banned: true,
      staffRole: true,
      role: true,
      subscriptions: {
        where: { status: "ACTIVE" },
        take: 1,
        select: { plan: true, stripeSubscriptionId: true, currentPeriodEnd: true },
      },
    },
  });
}

export async function getAdminSubscriptionRows() {
  await requireAdminPanel();
  const subs = await db.subscription.findMany({
    where: { status: "ACTIVE", plan: { in: ["PRO", "BUSINESS"] } },
    include: {
      user: { select: { username: true, email: true, banned: true } },
    },
    orderBy: { currentPeriodEnd: "asc" },
    take: 100,
  });

  return subs
    .filter((s) => !s.user.banned)
    .map((s) => ({
      username: s.user.username,
      email: s.user.email,
      plan: s.plan,
      source: isPaidStripePro(s) ? ("stripe" as const) : ("prize" as const),
      currentPeriodEnd: s.currentPeriodEnd,
    }));
}

export async function getAdminOpenReportCount() {
  await requireAdminPanel();
  return db.report.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } });
}
