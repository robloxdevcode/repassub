/**
 * Audit live Stripe configuration without printing secrets.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import Stripe from "stripe";

const ENV_FILES = [".env.local", ".env.vercel.production"];

function parseEnvFile(path: string) {
  const out: Record<string, string> = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    out[line.slice(0, i)] = line.slice(i + 1).replace(/^"|"$/g, "");
  }
  return out;
}

async function auditPrices(stripe: Stripe, label: string, env: Record<string, string>) {
  console.log(`\n[${label}]`);
  const keys = Object.keys(env).filter((k) => k.startsWith("STRIPE_PRO_") && k.includes("PRICE"));
  for (const key of keys.sort()) {
    const priceId = env[key];
    if (!priceId) {
      console.log(`${key}: missing`);
      continue;
    }
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log(
        `${key}: ok (${price.currency}, ${price.recurring?.interval ?? "one-time"}, active=${price.active})`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`${key}: INVALID — ${message}`);
    }
  }
}

async function auditWebhooks(stripe: Stripe) {
  console.log("\n[Webhooks on Stripe account]");
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  const prod = endpoints.data.filter((e) => e.url.includes("linklock.org"));
  if (prod.length === 0) {
    console.log("No linklock.org webhook endpoint found.");
    return;
  }
  for (const endpoint of prod) {
    console.log(
      `${endpoint.id}: ${endpoint.url} status=${endpoint.status} events=${endpoint.enabled_events.length}`
    );
  }
}

async function main() {
  const local = parseEnvFile(resolve(".env.local"));
  const vercel = parseEnvFile(resolve(".env.vercel.production"));
  const secret = local.STRIPE_SECRET_KEY?.trim();

  if (!secret) {
    console.error("STRIPE_SECRET_KEY missing in .env.local");
    process.exit(1);
  }

  const mode = secret.startsWith("sk_live_") ? "live" : secret.startsWith("sk_test_") ? "test" : "unknown";
  console.log(`Local Stripe mode: ${mode}`);
  console.log(`Local webhook secret: ${local.STRIPE_WEBHOOK_SECRET ? "set" : "missing"}`);
  console.log(`Vercel webhook secret: ${vercel.STRIPE_WEBHOOK_SECRET ? "set" : "missing"}`);

  const stripe = new Stripe(secret, { typescript: true });
  await stripe.products.list({ limit: 1 });
  console.log("Stripe API: connected");

  await auditPrices(stripe, "Local price IDs", local);

  const mismatches = Object.keys(local)
    .filter((k) => k.startsWith("STRIPE_PRO_") && k.includes("PRICE"))
    .filter((k) => local[k] && vercel[k] && local[k] !== vercel[k]);
  if (mismatches.length) {
    console.log(`\n[Vercel mismatches vs local] ${mismatches.join(", ")}`);
  } else {
    console.log("\n[Vercel price IDs] match local (or vercel pull unavailable)");
  }

  await auditWebhooks(stripe);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: local.STRIPE_PRO_YEARLY_PRICE_ID!, quantity: 1 }],
      success_url: "https://linklock.org/welcome/pro?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://linklock.org/pricing?canceled=true",
    });
    console.log(`\n[Test checkout session] ok (${session.id})`);
    await stripe.checkout.sessions.expire(session.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`\n[Test checkout session] FAIL — ${message}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
