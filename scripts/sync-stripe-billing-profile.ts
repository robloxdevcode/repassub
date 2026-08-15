/**
 * Link Stripe customer + subscription for a Pro user (fixes Manage billing).
 * Usage: dotenv -e .env.local -- npx tsx scripts/sync-stripe-billing-profile.ts email@example.com
 */
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const db = new PrismaClient();

async function main() {
  const email = (process.argv[2] || process.env.ADMIN_EMAIL)?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npx tsx scripts/sync-stripe-billing-profile.ts <email>");
    process.exit(1);
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    console.error("STRIPE_SECRET_KEY missing");
    process.exit(1);
  }

  const stripe = new Stripe(secret, { typescript: true });
  const user = await db.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    include: { subscriptions: { where: { status: "ACTIVE" }, take: 1 } },
  });

  if (!user) {
    console.error(`No user for ${email}`);
    process.exit(1);
  }

  console.log(`User: ${user.username} (${user.id})`);
  console.log(`Plan: ${user.subscriptions[0]?.plan ?? "FREE"}`);
  console.log(`stripeCustomerId: ${user.stripeCustomerId ?? "(none)"}`);
  console.log(`stripeSubscriptionId: ${user.subscriptions[0]?.stripeSubscriptionId ?? "(none)"}`);

  if (user.stripeCustomerId) {
    try {
      await stripe.customers.retrieve(user.stripeCustomerId);
    } catch {
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: null },
      });
      user.stripeCustomerId = null;
      console.log("Cleared invalid stripeCustomerId");
    }
  }

  if (user.subscriptions[0]?.stripeSubscriptionId) {
    try {
      const sub = await stripe.subscriptions.retrieve(user.subscriptions[0].stripeSubscriptionId);
      if (sub.status !== "active" && sub.status !== "trialing") throw new Error("inactive");
    } catch {
      await db.subscription.upsert({
        where: { userId: user.id },
        create: { userId: user.id, plan: "FREE", status: "ACTIVE" },
        update: { plan: "FREE", status: "ACTIVE", stripeSubscriptionId: null },
      });
      console.log("Cleared invalid test subscription — set FREE");
    }
  }

  const customers = await stripe.customers.list({ email: user.email ?? email, limit: 10 });
  if (customers.data.length === 0) {
    console.error("No Stripe customer found for this email in current Stripe mode.");
    process.exit(1);
  }

  let linkedCustomer = customers.data.find((c) => c.metadata?.userId === user.id) ?? customers.data[0];
  let activeSub: Stripe.Subscription | undefined;

  for (const customer of customers.data) {
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });
    if (subs.data[0]) {
      linkedCustomer = customer;
      activeSub = subs.data[0];
      break;
    }
  }

  await db.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: linkedCustomer.id },
  });
  console.log(`Set stripeCustomerId=${linkedCustomer.id}`);

  if (activeSub) {
    await db.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        plan: "PRO",
        status: "ACTIVE",
        stripeSubscriptionId: activeSub.id,
      },
      update: {
        plan: "PRO",
        status: "ACTIVE",
        stripeSubscriptionId: activeSub.id,
      },
    });
    console.log(`Set PRO subscription ${activeSub.id}`);
  } else {
    console.log("No active Stripe subscription — customer linked only.");
  }

  console.log("Done. Manage billing should work now.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
