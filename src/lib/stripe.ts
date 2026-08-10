import Stripe from "stripe";
import {
  DEFAULT_BILLING_CURRENCY,
  formatPlanPrice,
  getProPlanPrices,
  getProPriceLabels,
  getProYearlyCompareAt,
  PRO_YEARLY_DISCOUNT_PERCENT,
  type BillingCurrency,
} from "@/lib/currency";

export {
  DEFAULT_BILLING_CURRENCY as PLAN_CURRENCY,
  formatPlanPrice,
  getProPlanPrices,
  getProPriceLabels,
  getProYearlyCompareAt,
  PRO_YEARLY_DISCOUNT_PERCENT,
  type BillingCurrency,
} from "@/lib/currency";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  : null;

export const FREE_UNLOCK_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export const PLAN_LIMITS = {
  FREE: { unlocks: 5, actionsPerUnlock: 2, analytics: "basic" as const, ads: true },
  PRO: { unlocks: Infinity, actionsPerUnlock: 4, analytics: "advanced" as const, ads: false },
  BUSINESS: { unlocks: Infinity, actionsPerUnlock: 4, analytics: "advanced" as const, ads: false },
};

export const PLAN_FEATURES = {
  FREE: [
    "5 unlock links per week",
    "2 steps per link",
    "Views & unlock counts",
    "Linklock branding on your pages",
  ],
  PRO: [
    "Unlimited links per week",
    "4 steps per link",
    "No ads — clean unlock pages",
    "Your colors, logo & custom URL",
    "Conversion stats & charts",
  ],
} as const;

export function getUnlockQuotaWindowStart(now = new Date()) {
  return new Date(now.getTime() - FREE_UNLOCK_WINDOW_MS);
}

export function getUnlockQuotaResetAt(oldestCampaignCreatedAt: Date) {
  return new Date(oldestCampaignCreatedAt.getTime() + FREE_UNLOCK_WINDOW_MS);
}

export function formatUnlockQuotaReset(resetsAt: Date | null) {
  if (!resetsAt) return "5 links per week on free";
  const ms = resetsAt.getTime() - Date.now();
  if (ms <= 0) return "Quota refreshing soon";
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));
  if (days <= 1) return "Resets tomorrow";
  return `Resets in ${days} day${days === 1 ? "" : "s"}`;
}

export function getUserPlan(plan?: string) {
  if (plan === "PRO" || plan === "BUSINESS") return plan;
  return "FREE" as const;
}

export function getActionLimit(plan?: string) {
  const key = getUserPlan(plan);
  return PLAN_LIMITS[key].actionsPerUnlock;
}

export function hasAdvancedAnalytics(plan?: string) {
  const key = getUserPlan(plan);
  return PLAN_LIMITS[key].analytics === "advanced";
}

export function isProPlan(plan?: string) {
  const key = getUserPlan(plan);
  return key === "PRO" || key === "BUSINESS";
}

export function planShowsAds(plan?: string) {
  const key = getUserPlan(plan);
  return PLAN_LIMITS[key].ads;
}

export const PLAN_PRICES = {
  PRO: getProPlanPrices(DEFAULT_BILLING_CURRENCY),
};

/** @deprecated Use getProYearlyCompareAt(currency) or useCurrency() instead */
export const PRO_YEARLY_COMPARE_AT_CENTS = getProYearlyCompareAt(DEFAULT_BILLING_CURRENCY);

/** @deprecated Use getProPriceLabels(currency) or useCurrency() instead */
export const PRO_PRICE_MONTHLY_LABEL = getProPriceLabels(DEFAULT_BILLING_CURRENCY).monthly;
/** @deprecated Use getProPriceLabels(currency) or useCurrency() instead */
export const PRO_PRICE_YEARLY_LABEL = getProPriceLabels(DEFAULT_BILLING_CURRENCY).yearly;
/** @deprecated Use getProPriceLabels(currency) or useCurrency() instead */
export const PRO_PRICE_YEARLY_EQUIVALENT_LABEL = getProPriceLabels(DEFAULT_BILLING_CURRENCY).yearlyEquivalent;

export async function getOrCreateStripeCustomer(userId: string, email: string, stripeCustomerId?: string | null) {
  if (stripeCustomerId) return stripeCustomerId;
  if (!stripe) throw new Error("Stripe not configured");

  const customer = await stripe.customers.create({ email, metadata: { userId } });
  return customer.id;
}
