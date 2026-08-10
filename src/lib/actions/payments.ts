"use server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe";
import { DEFAULT_BILLING_CURRENCY, isBillingCurrency, type BillingCurrency } from "@/lib/currency";

function getStripePriceId(plan: "PRO", period: "monthly" | "yearly", currency: BillingCurrency) {
  const periodKey = period.toUpperCase();
  const byCurrency = process.env[`STRIPE_${plan}_${periodKey}_PRICE_ID_${currency}`];
  if (byCurrency) return byCurrency;

  if (currency === DEFAULT_BILLING_CURRENCY) {
    return process.env[`STRIPE_${plan}_${periodKey}_PRICE_ID`];
  }

  return undefined;
}

export async function createCheckoutSession(
  plan: "PRO",
  period: "monthly" | "yearly",
  currency: BillingCurrency = DEFAULT_BILLING_CURRENCY
) {
  const user = await requireUser();
  const billingCurrency = isBillingCurrency(currency) ? currency : DEFAULT_BILLING_CURRENCY;

  const priceId = getStripePriceId(plan, period, billingCurrency);
  if (!priceId) throw new Error("Stripe not configured");

  if (!stripe) throw new Error("Stripe not configured");

  const customerId = await getOrCreateStripeCustomer(
    user.id,
    user.email || "",
    user.stripeCustomerId
  );

  if (!user.stripeCustomerId) {
    await db.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: { userId: user.id, plan },
  });

  return { url: session.url };
}

export async function createConnectAccount() {
  const user = await requireUser();

  if (!stripe) throw new Error("Stripe not configured");

  if (user.stripeConnectId) {
    const loginLink = await stripe.accounts.createLoginLink(user.stripeConnectId);
    return { url: loginLink.url };
  }

  const account = await stripe.accounts.create({
    type: "express",
    email: user.email || undefined,
    metadata: { userId: user.id },
  });

  await db.user.update({
    where: { id: user.id },
    data: { stripeConnectId: account.id },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments?refresh=true`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments?success=true`,
    type: "account_onboarding",
  });

  return { url: accountLink.url };
}

export async function getBillingData() {
  const user = await requireUser();
  const plan = user.subscriptions?.[0]?.plan || "FREE";
  return { plan, subscription: user.subscriptions[0] || null };
}

export async function getPaymentData() {
  const user = await requireUser();

  const [payments, payouts, subscription] = await Promise.all([
    db.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
    db.payout.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
    db.subscription.findFirst({ where: { userId: user.id, status: "ACTIVE" } }),
  ]);

  const totalEarnings = payments
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayouts = payouts
    .filter((p) => p.status === "PENDING" || p.status === "PROCESSING")
    .reduce((sum, p) => sum + p.amount, 0);

  return { payments, payouts, subscription, totalEarnings, pendingPayouts };
}

export async function createBillingPortal() {
  const user = await requireUser();
  if (!user.stripeCustomerId) throw new Error("No billing account");

  if (!stripe) throw new Error("Stripe not configured");

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  return { url: session.url };
}
