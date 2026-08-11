import type { Subscription, User } from "@prisma/client";
import { db } from "@/lib/db";

const LIFETIME_PRO_EMAILS = new Set<string>([]);

export function hasLifetimePro(email?: string | null) {
  return !!email && LIFETIME_PRO_EMAILS.has(email.toLowerCase());
}

type UserWithSubs = User & { subscriptions: Subscription[] };

export function applyLifetimeProGrant(user: UserWithSubs): UserWithSubs {
  if (!hasLifetimePro(user.email)) return user;

  if (user.subscriptions[0]) {
    return {
      ...user,
      subscriptions: [{ ...user.subscriptions[0], plan: "PRO", status: "ACTIVE" }],
    };
  }

  return user;
}

export async function ensureLifetimeProInDb(userId: string, email?: string | null) {
  if (!hasLifetimePro(email)) return;

  await db.subscription.upsert({
    where: { userId },
    update: { plan: "PRO", status: "ACTIVE" },
    create: { userId, plan: "PRO", status: "ACTIVE" },
  });
}
