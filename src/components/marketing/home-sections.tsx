"use client";

import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { HOME_FAQS } from "@/lib/seo";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";

export { HeroSection } from "@/components/marketing/hero-section";

export function StepsSection() {
  return (
    <section className="simple-section bg-retro-surface-2">
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="simple-section-title mb-8">How it works</h2>
        <ol className="text-left space-y-3 text-retro-text-dim">
          <li>
            <strong className="text-retro-text">1.</strong> Paste your file link
          </li>
          <li>
            <strong className="text-retro-text">2.</strong> Add fan steps (follow, subscribe, join…)
          </li>
          <li>
            <strong className="text-retro-text">3.</strong> Share one URL
          </li>
        </ol>
      </div>
    </section>
  );
}

export function PlansSection() {
  const { formatPrice, prices, discountPercent } = useCurrency();

  return (
    <section id="pricing" className="simple-section scroll-mt-20">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="simple-section-title text-center mb-8">Plans</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <article className="simple-plan-card">
            <p className="font-bold">Free · {formatPrice(0)}</p>
            <div className="mt-4">
              <PlanFeatureList features={PLAN_FEATURES.FREE} finePrint={PLAN_FINE_PRINT.FREE} />
            </div>
            <MarketingAuthLink href="/sign-up" className="block mt-6">
              <RetroButton variant="secondary" className="w-full">
                Start free
              </RetroButton>
            </MarketingAuthLink>
          </article>
          <article className="simple-plan-card simple-plan-card--popular">
            <p className="font-bold text-retro-accent">
              Pro · {formatPrice(prices.yearly)}/yr
            </p>
            <p className="text-xs text-retro-text-muted mt-1">{discountPercent}% off vs monthly</p>
            <div className="mt-4">
              <PlanFeatureList features={PLAN_FEATURES.PRO} finePrint={PLAN_FINE_PRINT.PRO} />
            </div>
            <Link href="/pricing" prefetch className="block mt-6">
              <RetroButton className="w-full">Go Pro</RetroButton>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="simple-section bg-retro-surface-2 scroll-mt-20">
      <div className="mx-auto max-w-xl px-4 py-12">
        <h2 className="simple-section-title text-center mb-6">FAQ</h2>
        <div className="flex flex-col gap-2">
          {HOME_FAQS.map((item) => (
            <details key={item.q} className="simple-faq">
              <summary className="simple-faq-q">{item.q}</summary>
              <p className="simple-faq-a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="simple-cta py-12 text-center">
      <MarketingAuthLink href="/sign-up" className="inline-block">
        <RetroButton size="lg" variant="white">
          Create a link
        </RetroButton>
      </MarketingAuthLink>
    </section>
  );
}
