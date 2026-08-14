/**
 * POST a signed test checkout.session.completed event to the local webhook route.
 * Usage: npm run stripe:verify-webhook
 * Requires STRIPE_WEBHOOK_SECRET and dev server on localhost:3000
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const ENV_PATH = resolve(process.cwd(), ".env.local");
const WEBHOOK_PATH = "/api/webhooks/stripe";
const PORT = process.env.PORT || "3000";

function loadWebhookSecret() {
  if (process.env.STRIPE_WEBHOOK_SECRET?.trim()) {
    return process.env.STRIPE_WEBHOOK_SECRET.trim();
  }
  if (!existsSync(ENV_PATH)) return "";
  const content = readFileSync(ENV_PATH, "utf8");
  const match = content.match(/^STRIPE_WEBHOOK_SECRET=(.+)$/m);
  return match?.[1]?.trim() || "";
}

async function getTestUserId() {
  const db = new PrismaClient();
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (adminEmail) {
      const admin = await db.user.findFirst({
        where: { email: { equals: adminEmail, mode: "insensitive" } },
        select: { id: true },
      });
      if (admin) return admin.id;
    }
    const anyUser = await db.user.findFirst({ select: { id: true }, orderBy: { createdAt: "asc" } });
    return anyUser?.id || null;
  } finally {
    await db.$disconnect();
  }
}

async function main() {
  const secret = loadWebhookSecret();
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is missing. Run stripe listen and add whsec_... to .env.local");
    process.exit(1);
  }

  const userId = await getTestUserId();
  if (!userId) {
    console.error("No user in database. Sign up locally first, then re-run.");
    process.exit(1);
  }

  const payload = JSON.stringify({
    id: "evt_test_linklock",
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_linklock",
        object: "checkout.session",
        subscription: "sub_test_linklock",
        metadata: { userId, plan: "PRO" },
      },
    },
  });

  const signature = Stripe.webhooks.generateTestHeaderString({
    payload,
    secret,
  });

  const url = `http://localhost:${PORT}${WEBHOOK_PATH}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "stripe-signature": signature,
    },
    body: payload,
  });

  const text = await response.text();
  console.log(`POST ${url} → ${response.status} ${text}`);

  if (response.status !== 200) {
    process.exit(1);
  }

  console.log(`checkout.session.completed handled — user ${userId} should now be PRO.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
