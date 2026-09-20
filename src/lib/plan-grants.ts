import type { Subscription, User } from "@prisma/client";
import { db } from "@/lib/db";

const LIFETIME_PRO_EMAILS = new Set<string>([]);

export function hasLifetimePro(email?: string | null) {
  return !!email && LIFETIME_PRO_EMAILS.has(email.toLowerCase());
}

type UserWithSubs = User & { subscriptions: Subscription[] };

function hasPaidPro(sub?: Subscription | null) {
  return !!sub?.stripeSubscriptionId && (sub.plan === "PRO" || sub.plan === "BUSINESS");
}

export function applyEasterEggProGrant(user: UserWithSubs): UserWithSubs {
  return user;
}

export function applyLifetimeProGrant(user: UserWithSubs): UserWithSubs {
  const withEgg = applyEasterEggProGrant(user);
  if (!hasLifetimePro(withEgg.email)) return withEgg;

  if (withEgg.subscriptions[0]) {
    return {
      ...withEgg,
      subscriptions: [{ ...withEgg.subscriptions[0], plan: "PRO", status: "ACTIVE" }],
    };
  }

  return withEgg;
}

export async function ensureLifetimeProInDb(userId: string, email?: string | null) {
  if (!hasLifetimePro(email)) return;

  await db.subscription.upsert({
    where: { userId },
    update: { plan: "PRO", status: "ACTIVE" },
    create: { userId, plan: "PRO", status: "ACTIVE" },
  });
}
