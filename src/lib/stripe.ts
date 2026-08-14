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

/** @deprecated Weekly quotas removed — free plan has unlimited links. */
export const FREE_UNLOCK_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export const PLAN_LIMITS = {
  FREE: { unlocks: Infinity, actionsPerUnlock: 4, analytics: "basic" as const, ads: true },
  PRO: { unlocks: Infinity, actionsPerUnlock: 10, analytics: "advanced" as const, ads: false },
  BUSINESS: { unlocks: Infinity, actionsPerUnlock: 10, analytics: "advanced" as const, ads: false },
} as const;

export const PLAN_FEATURES = {
  FREE: [
    "Unlimited unlock links",
    "Up to 4 steps per link",
    "Views and unlock stats",
  ],
  PRO: [
    "Up to 10 steps per link",
    "Custom logo and colors",
    "Audience and conversion analytics",
    "No Linklock branding on pages",
  ],
} as const;

export const PLAN_FINE_PRINT = {
  FREE: "Linklock ads shown on unlock pages.",
  PRO: "Billed yearly or monthly. Cancel anytime.",
} as const;

export const PLAN_TAGLINE = {
  FREE: "Everything you need to start gating downloads.",
  PRO: "More steps, your branding, no ads.",
} as const;

export function getUnlockQuotaWindowStart(now = new Date()) {
  return new Date(now.getTime() - FREE_UNLOCK_WINDOW_MS);
}

export function getUnlockQuotaResetAt(oldestCampaignCreatedAt: Date) {
  return new Date(oldestCampaignCreatedAt.getTime() + FREE_UNLOCK_WINDOW_MS);
}

export function formatUnlockQuotaReset(_resetsAt: Date | null) {
  return "Unlimited links on Free";
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
