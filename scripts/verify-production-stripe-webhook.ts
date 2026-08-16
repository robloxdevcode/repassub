/**
 * Verify production Stripe webhook at linklock.org accepts signed events.
 * Usage: npx dotenv -e .env.local -- npx tsx scripts/verify-production-stripe-webhook.ts
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import Stripe from "stripe";

const ENV_PATH = resolve(process.cwd(), ".env.local");
const WEBHOOK_URL = "https://linklock.org/api/webhooks/stripe";

function loadWebhookSecret() {
  if (process.env.STRIPE_WEBHOOK_SECRET?.trim()) {
    return process.env.STRIPE_WEBHOOK_SECRET.trim();
  }
  if (!existsSync(ENV_PATH)) return "";
  const content = readFileSync(ENV_PATH, "utf8");
  const match = content.match(/^STRIPE_WEBHOOK_SECRET=(.+)$/m);
  return match?.[1]?.trim() || "";
}

async function main() {
  const secret = loadWebhookSecret();
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET missing in .env.local");
    process.exit(1);
  }

  const payload = JSON.stringify({
    id: "evt_verify_linklock_live",
    object: "event",
    type: "customer.subscription.updated",
    data: {
      object: {
        id: "sub_verify_linklock_live",
        object: "subscription",
        status: "active",
      },
    },
  });

  const signature = Stripe.webhooks.generateTestHeaderString({ payload, secret });
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "stripe-signature": signature,
    },
    body: payload,
  });

  const text = await response.text();
  console.log(`POST ${WEBHOOK_URL} → ${response.status} ${text}`);

  if (response.status === 400 && text.includes("Invalid signature")) {
    console.error(
      "Webhook secret on Vercel does not match .env.local. Rotate in Stripe Dashboard and update both."
    );
    process.exit(1);
  }

  if (response.status !== 200) {
    process.exit(1);
  }

  console.log("Production webhook signature verification OK.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
