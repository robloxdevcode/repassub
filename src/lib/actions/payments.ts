"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe, getOrCreateStripeCustomer, getUserPlan } from "@/lib/stripe";
import { DEFAULT_BILLING_CURRENCY, isBillingCurrency, type BillingCurrency } from "@/lib/currency";
import { getPaymentsSiteUrl } from "@/lib/site-url";

type ActionResult = { url?: string | null; error?: string };

function actionError(message: string): ActionResult {
  return { error: message };
}

function stripeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}

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

async function reconcileStripeBillingState(user: {
  id: string;
  stripeCustomerId: string | null;
  subscriptions: { stripeSubscriptionId: string | null; plan: string }[];
}) {
  if (!stripe) return;

  if (user.stripeCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(user.stripeCustomerId);
      if (customer.deleted) throw new Error("deleted");
    } catch {
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: null },
      });
    }
  }

  const subId = user.subscriptions[0]?.stripeSubscriptionId;
  if (subId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subId);
      if (sub.status !== "active" && sub.status !== "trialing") {
        throw new Error("inactive");
      }
    } catch {
      await db.subscription.upsert({
        where: { userId: user.id },
        create: { userId: user.id, plan: "FREE", status: "ACTIVE" },
        update: { plan: "FREE", status: "ACTIVE", stripeSubscriptionId: null },
      });
    }
  }
}

async function resolveStripeCustomerId(user: {
  id: string;
  email: string | null;
  stripeCustomerId: string | null;
  subscriptions: { stripeSubscriptionId: string | null }[];
}) {
  if (!stripe) throw new Error("Stripe not configured");

  if (user.stripeCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(user.stripeCustomerId);
      if (!customer.deleted) return user.stripeCustomerId;
    } catch {
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: null },
      });
    }
  }

  const subscriptionId = user.subscriptions[0]?.stripeSubscriptionId;
  if (subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id;
      if (customerId) {
        await persistStripeCustomerId(user.id, customerId);
        return customerId;
      }
    } catch {
      // Stale test subscription id or deleted sub — fall through to email lookup.
    }
  }

  if (user.email) {
    const customers = await stripe.customers.list({ email: user.email, limit: 10 });

    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      });

      if (subs.data[0]) {
        await persistStripeCustomerId(user.id, customer.id);
        await activateUserSubscription(user.id, "PRO", subs.data[0].id);
        return customer.id;
      }
    }

    const match =
      customers.data.find((c) => c.metadata?.userId === user.id) ?? customers.data[0];
    if (match) {
      await persistStripeCustomerId(user.id, match.id);
      return match.id;
    }
  }

  throw new Error("No billing account");
}

async function resolveCheckoutCustomerId(user: {
  id: string;
  email: string | null;
  stripeCustomerId: string | null;
}) {
  if (!stripe) throw new Error("Stripe not configured");

  let customerId = user.stripeCustomerId;
  if (customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) customerId = null;
    } catch {
      customerId = null;
    }
  }

  if (!customerId) {
    customerId = await getOrCreateStripeCustomer(user.id, user.email || "", null);
  }

  if (customerId !== user.stripeCustomerId) {
    await db.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  return customerId;
}

export async function ensureStripeBillingProfile() {
  const user = await requireUser();
  const plan = getUserPlan(user.subscriptions?.[0]?.plan);
  if (plan !== "PRO" && plan !== "BUSINESS") return { ok: false as const };
  if (user.stripeCustomerId) return { ok: true as const };

  try {
    await resolveStripeCustomerId(user);
    return { ok: true as const };
  } catch {
    return { ok: false as const };
  }
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
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return actionError("Sign in again to upgrade.");
    if (user.banned) return actionError("Account suspended");

    const billingCurrency = isBillingCurrency(currency) ? currency : DEFAULT_BILLING_CURRENCY;
    const activePlan = user.subscriptions?.[0]?.plan;
    if (activePlan === "PRO" || activePlan === "BUSINESS") {
      return actionError("Already subscribed");
    }

    const priceId = getStripePriceId(plan, period, billingCurrency);
    if (!priceId || !stripe) return actionError("Stripe not configured");

    await reconcileStripeBillingState(user);
    const customerId = await resolveCheckoutCustomerId(user);
    const siteUrl = getPaymentsSiteUrl();

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/welcome/pro?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      metadata: { userId: user.id, plan },
    });

    return { url: session.url };
  } catch (error) {
    return actionError(stripeErrorMessage(error));
  }
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

  const siteUrl = getPaymentsSiteUrl();

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${siteUrl}/payments?refresh=true`,
    return_url: `${siteUrl}/payments?success=true`,
    type: "account_onboarding",
  });

  return { url: accountLink.url };
}

export async function getBillingData() {
  const user = await requireUser();
  await reconcileStripeBillingState(user);
  await ensureStripeBillingProfile();
  const refreshed = await requireUser();
  const plan = getUserPlan(refreshed.subscriptions?.[0]?.plan);
  return { plan, subscription: refreshed.subscriptions[0] || null };
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

export async function createBillingPortal(): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return actionError("Sign in again to manage billing.");
    if (!stripe) return actionError("Stripe not configured");

    let customerId: string;
    try {
      customerId = await resolveStripeCustomerId(user);
    } catch {
      return actionError("No billing account");
    }

    const siteUrl = getPaymentsSiteUrl();

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${siteUrl}/billing`,
      });
      return { url: session.url };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("configuration")) {
        return actionError("Billing portal not configured in Stripe");
      }
      return actionError(message || "Couldn't open billing portal");
    }
  } catch (error) {
    return actionError(stripeErrorMessage(error));
  }
}
