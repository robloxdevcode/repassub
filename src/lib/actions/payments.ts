"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe, getOrCreateStripeCustomer, getUserPlan } from "@/lib/stripe";
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

async function activateUserSubscription(
  userId: string,
  plan: "PRO" | "BUSINESS",
  stripeSubscriptionId: string
) {
  await db.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      stripeSubscriptionId,
      status: "ACTIVE",
    },
    update: {
      plan,
      stripeSubscriptionId,
      status: "ACTIVE",
    },
  });
}

async function persistStripeCustomerId(userId: string, customerId: string | null | undefined) {
  if (!customerId) return;
  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customerId },
  });
}

async function resolveStripeCustomerId(user: {
  id: string;
  email: string | null;
  stripeCustomerId: string | null;
  subscriptions: { stripeSubscriptionId: string | null }[];
}) {
  if (user.stripeCustomerId) return user.stripeCustomerId;
  if (!stripe) throw new Error("Stripe not configured");

  const subscriptionId = user.subscriptions[0]?.stripeSubscriptionId;
  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;
    if (customerId) {
      await persistStripeCustomerId(user.id, customerId);
      return customerId;
    }
  }

  if (user.email) {
    const customers = await stripe.customers.list({ email: user.email, limit: 5 });
    const match = customers.data.find((c) => c.metadata?.userId === user.id) ?? customers.data[0];
    if (match) {
      await persistStripeCustomerId(user.id, match.id);
      return match.id;
    }
  }

  throw new Error("No billing account");
}

export async function fulfillCheckoutSession(sessionId: string) {
  const user = await requireUser();
  if (!stripe) throw new Error("Stripe not configured");

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  if (session.metadata?.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  const isComplete =
    session.status === "complete" ||
    session.payment_status === "paid" ||
    session.payment_status === "no_payment_required";

  if (!isComplete) {
    throw new Error("Payment not completed");
  }

  const plan = (session.metadata?.plan as "PRO" | "BUSINESS" | undefined) ?? "PRO";

  let subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;
    if (customerId) {
      const subs = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
      subscriptionId = subs.data[0]?.id;
    }
  }

  if (!subscriptionId) {
    throw new Error("Invalid checkout session");
  }

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  await persistStripeCustomerId(user.id, customerId);

  await activateUserSubscription(user.id, plan, subscriptionId);
  revalidatePath("/dashboard");
  revalidatePath("/billing");
  revalidatePath("/settings");

  return { plan };
}

/** If Stripe shows an active sub but our DB still says Free, sync it (e.g. missed webhook). */
export async function syncProSubscriptionFromStripe() {
  const user = await requireUser();
  if (!stripe || !user.stripeCustomerId) {
    return { plan: getUserPlan(user.subscriptions?.[0]?.plan), synced: false as const };
  }

  const current = getUserPlan(user.subscriptions?.[0]?.plan);
  if (current === "PRO" || current === "BUSINESS") {
    return { plan: current, synced: false as const };
  }

  const subs = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: "active",
    limit: 1,
  });

  const sub = subs.data[0];
  if (!sub) {
    return { plan: current, synced: false as const };
  }

  await activateUserSubscription(user.id, "PRO", sub.id);
  revalidatePath("/dashboard");
  revalidatePath("/billing");
  revalidatePath("/settings");

  return { plan: "PRO" as const, synced: true as const };
}

export async function createCheckoutSession(
  plan: "PRO",
  period: "monthly" | "yearly",
  currency: BillingCurrency = DEFAULT_BILLING_CURRENCY
) {
  const user = await requireUser();
  const billingCurrency = isBillingCurrency(currency) ? currency : DEFAULT_BILLING_CURRENCY;

  const activePlan = user.subscriptions?.[0]?.plan;
  if (activePlan === "PRO" || activePlan === "BUSINESS") {
    throw new Error("Already subscribed");
  }

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
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/welcome/pro?session_id={CHECKOUT_SESSION_ID}`,
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
  const plan = getUserPlan(user.subscriptions?.[0]?.plan);
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
  if (!stripe) throw new Error("Stripe not configured");

  const customerId = await resolveStripeCustomerId(user);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  return { url: session.url };
}
