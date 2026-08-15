import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const db = new PrismaClient();

async function main() {
  const email = (process.argv[2] || process.env.DOWNGRADE_EMAIL)?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npx tsx scripts/downgrade-user-to-free.ts <email>");
    process.exit(1);
  }

  const user = await db.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, username: true, stripeCustomerId: true },
  });

  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  if (process.env.STRIPE_SECRET_KEY && user.stripeCustomerId) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true });
    const subs = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "active",
      limit: 20,
    });

    for (const sub of subs.data) {
      await stripe.subscriptions.cancel(sub.id);
      console.log(`Canceled Stripe subscription ${sub.id}`);
    }
  }

  await db.subscription.upsert({
    where: { userId: user.id },
    update: { plan: "FREE", status: "ACTIVE", stripeSubscriptionId: null },
    create: { userId: user.id, plan: "FREE", status: "ACTIVE" },
  });

  console.log(`Downgraded ${user.username} (${user.email}) to FREE`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
