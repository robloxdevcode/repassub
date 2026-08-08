import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  : null;

export const PLAN_LIMITS = {
  FREE: { unlocks: Infinity, analytics: "basic" as const },
  PRO: { unlocks: Infinity, analytics: "advanced" as const },
  BUSINESS: { unlocks: Infinity, analytics: "advanced" as const },
};

export const PLAN_CURRENCY = "EUR";

export const PLAN_PRICES = {
  PRO: { monthly: 699, yearly: 4194 },
};

export function formatPlanPrice(cents: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: PLAN_CURRENCY,
  }).format(cents / 100);
}

export const PRO_PRICE_MONTHLY_LABEL = `${formatPlanPrice(PLAN_PRICES.PRO.monthly)}/mo`;
export const PRO_PRICE_YEARLY_LABEL = `${formatPlanPrice(PLAN_PRICES.PRO.yearly)}/yr`;

export async function getOrCreateStripeCustomer(userId: string, email: string, stripeCustomerId?: string | null) {
  if (stripeCustomerId) return stripeCustomerId;
  if (!stripe) throw new Error("Stripe not configured");

  const customer = await stripe.customers.create({ email, metadata: { userId } });
  return customer.id;
}
