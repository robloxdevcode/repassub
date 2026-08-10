"use client";

import { useState } from "react";
import Link from "next/link";
import { RetroButton, RetroCard } from "@/components/retro";
import { createCheckoutSession } from "@/lib/actions/payments";
import { useToast } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { PLAN_FEATURES } from "@/lib/stripe";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { prices, formatPrice, yearlyCompareAtCents, discountPercent, currency } = useCurrency();

  const plans = [
    {
      name: "Free",
      plan: null as null,
      price: { monthly: 0, yearly: 0 },
      features: [...PLAN_FEATURES.FREE],
      color: "white" as const,
    },
    {
      name: "Pro",
      plan: "PRO" as const,
      price: prices,
      features: [...PLAN_FEATURES.PRO],
      color: "yellow" as const,
      popular: true,
    },
  ];

  async function handleUpgrade() {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession("PRO", yearly ? "yearly" : "monthly", currency);
      if (url) window.location.href = url;
    } catch {
      toast("Stripe not configured.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section className="bg-pop-red text-white border-b-[3px] border-retro-ink py-16 md:py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <p className="font-display text-[8px] text-retro-yellow mb-4">PRICING</p>
          <h1 className="section-title font-body text-white">
            Free to start.<br />
            Pro from {formatPrice(prices.yearly)}/yr — {discountPercent}% off.
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="inline-flex border-[3px] border-retro-ink mb-12 brutal-shadow-sm">
          <button
            onClick={() => setYearly(false)}
            className={cn(
              "font-display text-[8px] px-5 py-3 transition-colors",
              !yearly ? "bg-retro-ink text-white" : "bg-white text-retro-ink hover:bg-retro-surface-2"
            )}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setYearly(true)}
            className={cn(
              "font-display text-[8px] px-5 py-3 border-l-[3px] border-retro-ink transition-colors",
              yearly ? "bg-retro-yellow text-retro-ink" : "bg-white text-retro-ink hover:bg-retro-surface-2"
            )}
          >
            YEARLY -{discountPercent}%
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          {plans.map((p) => (
            <RetroCard key={p.name} color={p.color} glow={p.popular} className="flex flex-col">
              {p.popular && <span className="font-display text-[8px] mb-2">MOST POPULAR</span>}
              <h3 className="font-body text-2xl font-bold">{p.name}</h3>
              <p className="font-display text-2xl mt-4">
                {p.price.monthly === 0
                  ? formatPrice(0)
                  : formatPrice(yearly ? p.price.yearly : p.price.monthly)}
                {p.price.monthly > 0 && (
                  <span className="font-body text-sm font-normal opacity-70"> /{yearly ? "yr" : "mo"}</span>
                )}
              </p>
              {p.plan && yearly && (
                <p className="mt-2 font-body text-sm text-retro-text-dim">
                  <span className="line-through opacity-60">{formatPrice(yearlyCompareAtCents)}/yr</span>
                  <span className="ml-2 font-semibold text-retro-accent">{discountPercent}% off</span>
                </p>
              )}
              {p.plan && yearly && (
                <p className="mt-1 font-body text-xs text-retro-text-muted">
                  Works out to {formatPrice(Math.round(p.price.yearly / 12))}/mo billed yearly
                </p>
              )}
              <ul className="mt-8 space-y-3 flex-1 font-body text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span>✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {p.plan ? (
                  <RetroButton className="w-full" variant="primary" loading={loading} onClick={handleUpgrade}>
                    Upgrade to Pro
                  </RetroButton>
                ) : (
                  <Link href="/sign-up">
                    <RetroButton className="w-full" variant="secondary">Start free</RetroButton>
                  </Link>
                )}
              </div>
            </RetroCard>
          ))}
        </div>
      </div>
    </div>
  );
}
