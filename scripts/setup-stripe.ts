/**
 * One-shot Stripe test-mode setup for Linklock Pro billing.
 *
 * Usage:
 *   npm run stripe:setup
 *   npm run stripe:setup -- --secret-key sk_test_...
 *   npm run stripe:setup -- --production-webhook   # also create linklock.org webhook
 *
 * Requires STRIPE_SECRET_KEY in .env.local or passed via --secret-key.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import Stripe from "stripe";
import { PRO_PLAN_PRICES, type BillingCurrency } from "../src/lib/currency";

const PRODUCT_NAME = "Linklock Pro";
const WEBHOOK_URL = "https://linklock.org/api/webhooks/stripe";
const WEBHOOK_EVENTS: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "payment_intent.succeeded",
];

const ENV_PATH = resolve(process.cwd(), ".env.local");

function parseArgs() {
  const args = process.argv.slice(2);
  let secretKey = process.env.STRIPE_SECRET_KEY?.trim() || "";
  let productionWebhook = false;
  let writeEnv = true;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--secret-key" && args[i + 1]) {
      secretKey = args[++i].trim();
    } else if (arg === "--production-webhook") {
      productionWebhook = true;
    } else if (arg === "--no-write-env") {
      writeEnv = false;
    }
  }

  return { secretKey, productionWebhook, writeEnv };
}

function upsertEnvFile(updates: Record<string, string>) {
  if (!existsSync(ENV_PATH)) {
    throw new Error(`.env.local not found at ${ENV_PATH}`);
  }

  let content = readFileSync(ENV_PATH, "utf8");

  for (const [key, value] of Object.entries(updates)) {
    const pattern = new RegExp(`^${key}=.*$`, "m");
    const line = `${key}=${value}`;
    if (pattern.test(content)) {
      content = content.replace(pattern, line);
    } else {
      content = `${content.trimEnd()}\n${line}\n`;
    }
  }

  writeFileSync(ENV_PATH, content, "utf8");
}

async function findOrCreateProduct(stripe: Stripe) {
  const products = await stripe.products.list({ active: true, limit: 100 });
  const match = products.data.find((p) => p.name === PRODUCT_NAME);

  if (match) {
    console.log(`Using existing product: ${match.id}`);
    return match;
  }

  const product = await stripe.products.create({
    name: PRODUCT_NAME,
    description: "Pro subscription — 10 steps per link, branding, analytics, no ads.",
    metadata: { app: "linklock", plan: "PRO" },
  });
  console.log(`Created product: ${product.id}`);
  return product;
}

async function findOrCreatePrice(
  stripe: Stripe,
  productId: string,
  currency: BillingCurrency,
  period: "monthly" | "yearly"
) {
  const amount = PRO_PLAN_PRICES[currency][period];
  const interval = period === "monthly" ? "month" : "year";
  const lookupKey = `linklock_pro_${period}_${currency.toLowerCase()}`;

  const existing = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });

  const match = existing.data.find(
    (p) =>
      p.lookup_key === lookupKey ||
      (p.currency === currency.toLowerCase() &&
        p.unit_amount === amount &&
        p.recurring?.interval === interval)
  );

  if (match) {
    console.log(`Using existing ${period} ${currency} price: ${match.id}`);
    return match;
  }

  const price = await stripe.prices.create({
    product: productId,
    currency: currency.toLowerCase(),
    unit_amount: amount,
    recurring: { interval },
    lookup_key: lookupKey,
    metadata: { plan: "PRO", period, currency },
  });
  console.log(`Created ${period} ${currency} price: ${price.id}`);
  return price;
}

async function ensureBillingPortal(stripe: Stripe) {
  const configs = await stripe.billingPortal.configurations.list({ limit: 1 });
  if (configs.data.length > 0) {
    console.log(`Billing portal already configured: ${configs.data[0].id}`);
    return configs.data[0];
  }

  const config = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: "Manage your Linklock Pro subscription",
    },
    features: {
      customer_update: { enabled: true, allowed_updates: ["email"] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true, mode: "at_period_end" },
      subscription_update: { enabled: false },
    },
  });
  console.log(`Created billing portal configuration: ${config.id}`);
  return config;
}

async function ensureProductionWebhook(stripe: Stripe): Promise<string | null> {
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  const existing = endpoints.data.find((e) => e.url === WEBHOOK_URL && e.status !== "disabled");

  if (existing) {
    console.log(`Production webhook already exists: ${existing.id}`);
    console.log("Note: Stripe only shows the signing secret when the endpoint is created.");
    console.log("If you lost it, create a new endpoint in Dashboard or rotate the secret there.");
    return null;
  }

  const endpoint = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: WEBHOOK_EVENTS,
    description: "Linklock Pro subscriptions (linklock.org)",
    metadata: { app: "linklock" },
  });

  console.log(`Created production webhook: ${endpoint.id}`);
  return endpoint.secret ?? null;
}

async function main() {
  const { secretKey, productionWebhook, writeEnv } = parseArgs();

  if (!secretKey) {
    console.error(
      "STRIPE_SECRET_KEY is missing. Add it to .env.local or run:\n  npm run stripe:setup -- --secret-key sk_test_..."
    );
    process.exit(1);
  }

  if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
    console.error("Invalid Stripe secret key format (expected sk_test_... or sk_live_...).");
    process.exit(1);
  }

  const stripe = new Stripe(secretKey, { typescript: true });
  await stripe.products.list({ limit: 1 });
  console.log("Stripe API connection OK");
  console.log(`Mode: ${secretKey.startsWith("sk_test_") ? "TEST" : "LIVE"}\n`);

  const product = await findOrCreateProduct(stripe);

  const eurMonthly = await findOrCreatePrice(stripe, product.id, "EUR", "monthly");
  const eurYearly = await findOrCreatePrice(stripe, product.id, "EUR", "yearly");

  const extraPrices: Record<string, string> = {};
  for (const currency of ["USD", "GBP", "PLN"] as BillingCurrency[]) {
    const monthly = await findOrCreatePrice(stripe, product.id, currency, "monthly");
    const yearly = await findOrCreatePrice(stripe, product.id, currency, "yearly");
    extraPrices[`STRIPE_PRO_MONTHLY_PRICE_ID_${currency}`] = monthly.id;
    extraPrices[`STRIPE_PRO_YEARLY_PRICE_ID_${currency}`] = yearly.id;
  }

  await ensureBillingPortal(stripe);

  let productionWebhookSecret: string | null = null;
  if (productionWebhook) {
    productionWebhookSecret = await ensureProductionWebhook(stripe);
  }

  const envUpdates: Record<string, string> = {
    STRIPE_SECRET_KEY: secretKey,
    STRIPE_PRO_MONTHLY_PRICE_ID: eurMonthly.id,
    STRIPE_PRO_YEARLY_PRICE_ID: eurYearly.id,
    ...extraPrices,
  };

  if (productionWebhookSecret) {
    envUpdates.STRIPE_WEBHOOK_SECRET = productionWebhookSecret;
  }

  if (writeEnv) {
    upsertEnvFile(envUpdates);
    console.log("\nUpdated .env.local with Stripe keys and price IDs.");
  }

  console.log("\n--- Add to Vercel (Production) ---");
  console.log("Run: npm run stripe:vercel-env");
  for (const key of Object.keys(envUpdates)) {
    console.log(`  ${key}=<set>`);
  }

  console.log("\n--- Local webhook (run in a second terminal) ---");
  console.log("Install Stripe CLI: https://stripe.com/docs/stripe-cli");
  console.log("  stripe login");
  console.log("  stripe listen --forward-to localhost:3000/api/webhooks/stripe");
  console.log("Copy the whsec_... secret into STRIPE_WEBHOOK_SECRET in .env.local, then restart dev server.");

  if (!productionWebhook) {
    console.log("\nTo create the linklock.org webhook endpoint via API, re-run with:");
    console.log("  npm run stripe:setup -- --production-webhook");
  }

  console.log("\nDone. Test: sign in → Billing → Upgrade to Pro → card 4242 4242 4242 4242");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
