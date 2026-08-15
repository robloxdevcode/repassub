import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  if (!stripe) return new Response("Stripe not configured", { status: 500 });
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Webhook not configured", { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as "PRO" | "BUSINESS" | undefined;

      if (userId && plan && session.subscription) {
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;

        if (customerId) {
          await db.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId },
          });
        }

        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan,
            stripeSubscriptionId: session.subscription as string,
            status: "ACTIVE",
          },
          update: {
            plan,
            stripeSubscriptionId: session.subscription as string,
            status: "ACTIVE",
          },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const dbSub = await db.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (dbSub) {
        const sub = subscription as Stripe.Subscription & { current_period_end?: number };
        await db.subscription.update({
          where: { id: dbSub.id },
          data: {
            status: subscription.status === "active" ? "ACTIVE" : "CANCELED",
            currentPeriodEnd: sub.current_period_end
              ? new Date(sub.current_period_end * 1000)
              : null,
          },
        });
      }
      break;
    }
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const userId = paymentIntent.metadata?.userId;
      if (userId) {
        await db.payment.create({
          data: {
            userId,
            amount: paymentIntent.amount,
            stripePaymentId: paymentIntent.id,
            type: "SUBSCRIPTION",
            status: "SUCCEEDED",
          },
        });
      }
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
