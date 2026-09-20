import type { Subscription } from "@prisma/client";
import { getUserPlan } from "@/lib/stripe";

type SubSlice =
  | Pick<Subscription, "plan" | "status" | "stripeSubscriptionId" | "currentPeriodEnd">
  | null
  | undefined;

/** Paid Stripe Pro vs time-limited prize Pro (no stripeSubscriptionId). */
export function isPaidStripePro(sub: SubSlice): boolean {
  if (!sub?.stripeSubscriptionId) return false;
  const plan = getUserPlan(sub.plan);
  return plan === "PRO" || plan === "BUSINESS";
}

export function getEffectiveUserPlan(sub: SubSlice, now = new Date()): "FREE" | "PRO" | "BUSINESS" {
  if (!sub || sub.status !== "ACTIVE") return "FREE";

  const plan = getUserPlan(sub.plan);
  if (plan === "FREE") return "FREE";

  if (isPaidStripePro(sub)) return plan;

  if (sub.currentPeriodEnd && sub.currentPeriodEnd.getTime() > now.getTime()) {
    return plan === "BUSINESS" ? "BUSINESS" : "PRO";
  }

  return "FREE";
}

export async function downgradeExpiredPrizePro(
  userId: string,
  sub: Subscription,
): Promise<Subscription> {
  if (isPaidStripePro(sub)) return sub;
  const effective = getEffectiveUserPlan(sub);
  if (effective !== "FREE") return sub;

  const { db } = await import("@/lib/db");
  return db.subscription.update({
    where: { userId },
    data: {
      plan: "FREE",
      status: "ACTIVE",
      currentPeriodEnd: null,
    },
  });
}
