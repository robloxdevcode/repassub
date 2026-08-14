"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { RetroButton, RetroLink } from "@/components/retro";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { getBillingData, createCheckoutSession } from "@/lib/actions/payments";
import { useToast } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { PLAN_FEATURES, PLAN_FINE_PRINT, PLAN_TAGLINE } from "@/lib/stripe";
import { cn } from "@/lib/utils";

function checkoutErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "Unauthorized") {
    return "Sign in first, then try Upgrade to Pro again.";
  }
  if (message === "Already subscribed") {
    return "You're already on Pro. Open Billing to manage your plan.";
  }
  if (message.includes("Stripe not configured")) {
    return "Stripe isn’t configured on this server yet.";
  }
  return "Couldn’t start checkout. Try again from Billing while signed in.";
}

export default function PricingPage() {
  const { isSignedIn } = useAuth();
  const [yearly, setYearly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const { prices, formatPrice, yearlyCompareAtCents, discountPercent, currency } = useCurrency();

  useEffect(() => {
    if (!isSignedIn) {
      setCurrentPlan(null);
      return;
    }
    getBillingData()
      .then((data) => setCurrentPlan(data.plan))
      .catch(() => setCurrentPlan(null));
  }, [isSignedIn]);

  const isPro = currentPlan === "PRO" || currentPlan === "BUSINESS";

  const plans = [
    {
      name: "Free",
      plan: null as null,
      price: { monthly: 0, yearly: 0 },
      features: [...PLAN_FEATURES.FREE],
      finePrint: PLAN_FINE_PRINT.FREE,
      tagline: PLAN_TAGLINE.FREE,
      popular: false,
    },
    {
      name: "Pro",
      plan: "PRO" as const,
      price: prices,
      features: [...PLAN_FEATURES.PRO],
      finePrint: PLAN_FINE_PRINT.PRO,
      tagline: PLAN_TAGLINE.PRO,
      popular: true,
    },
  ];

  async function handleUpgrade() {
    if (!isSignedIn) {
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent("/pricing")}`;
      return;
    }

    if (isPro) {
      window.location.href = "/billing";
      return;
    }

    setLoading(true);
    try {
      const { url } = await createCheckoutSession("PRO", yearly ? "yearly" : "monthly", currency);
      if (url) window.location.href = url;
    } catch (error) {
      toast(checkoutErrorMessage(error), "error");
      setLoading(false);
    }
  }

  return (
    <div>
      <section className="ll-page-hero border-b border-retro-border">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="ll-label">Pricing</p>
          <h1 className="ll-section-title mt-3">Plans</h1>
          <p className="mt-4 text-retro-text-dim max-w-lg">
            Free: unlimited links, 4 steps. Pro: 10 steps, branding, no ads.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="ll-toggle mb-10">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={cn("ll-toggle-btn", !yearly && "ll-toggle-btn--active")}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={cn("ll-toggle-btn", yearly && "ll-toggle-btn--active")}
          >
            Yearly · {discountPercent}% off
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 max-w-3xl mx-auto">
          {plans.map((p) => (
            <article
              key={p.name}
              className={cn("ll-plan-card", p.popular && "ll-plan-card--pro")}
            >
              {p.popular ? (
                <span className="text-xs font-semibold text-retro-accent mb-2">Most popular</span>
              ) : null}
              <h3 className="text-2xl font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-retro-text-dim">{p.tagline}</p>
              <p className="text-3xl font-bold mt-5">
                {p.price.monthly === 0
                  ? formatPrice(0)
                  : formatPrice(yearly ? p.price.yearly : p.price.monthly)}
                {p.price.monthly > 0 ? (
                  <span className="text-base font-normal text-retro-text-dim"> /{yearly ? "yr" : "mo"}</span>
                ) : null}
              </p>
              {p.plan && yearly ? (
                <p className="mt-2 text-sm text-retro-text-dim">
                  <span className="line-through opacity-60">{formatPrice(yearlyCompareAtCents)}/yr</span>
                  <span className="ml-2 font-semibold text-retro-accent">{discountPercent}% off</span>
                </p>
              ) : null}
              {p.plan && yearly ? (
                <p className="mt-1 text-xs text-retro-text-muted">
                  Works out to {formatPrice(Math.round(p.price.yearly / 12))}/mo billed yearly
                </p>
              ) : null}
              <div className="mt-8">
                <PlanFeatureList features={p.features} finePrint={p.finePrint} />
              </div>
              <div className="mt-8">
                {p.plan ? (
                  isPro ? (
                    <RetroLink href="/billing" variant="secondary" className="w-full">
                      You&apos;re on Pro — manage billing
                    </RetroLink>
                  ) : (
                    <RetroButton className="w-full ll-btn-glow" variant="primary" loading={loading} onClick={handleUpgrade}>
                      Upgrade to Pro
                    </RetroButton>
                  )
                ) : (
                  <RetroLink href="/sign-up" variant="secondary" className="w-full">
                    Get started free
                  </RetroLink>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
