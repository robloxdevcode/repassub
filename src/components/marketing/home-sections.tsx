"use client";

import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { HOME_FAQS } from "@/lib/seo";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";

export { HeroSection } from "@/components/marketing/hero-section";

const OFFERS = [
  {
    title: "Grow while people unlock",
    desc: "Pick actions like subscribe, join, or follow. Fans complete them to get your file.",
  },
  {
    title: "See what's working",
    desc: "Track views, unlocks, and conversion on every link you share.",
  },
  {
    title: "Free unlimited links",
    desc: "4 steps per link on Free. Pro adds 10 steps, branding, analytics, and no ads.",
  },
];

export function OfferSection() {
  return (
    <section className="simple-section bg-retro-surface-2">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid md:grid-cols-3 gap-5">
          {OFFERS.map((item) => (
            <article key={item.title} className="simple-step-card">
              <h3 className="font-bold text-base mb-2">{item.title}</h3>
              <p className="text-sm text-retro-text-dim leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlansSection() {
  const { formatPrice, prices, discountPercent } = useCurrency();

  return (
    <section id="pricing" className="simple-section scroll-mt-20">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="simple-section-title text-center mb-2">Plans</h2>
        <p className="text-center text-sm text-retro-text-dim mb-8">
          Free = unlimited links + 4 steps · Pro = 10 steps + branding + no ads
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <article className="simple-plan-card">
            <p className="font-bold text-lg">Free</p>
            <p className="text-2xl font-bold mt-1">{formatPrice(0)}</p>
            <div className="mt-4">
              <PlanFeatureList features={PLAN_FEATURES.FREE} finePrint={PLAN_FINE_PRINT.FREE} />
            </div>
            <MarketingAuthLink href="/sign-up" className="block mt-6">
              <RetroButton variant="secondary" className="w-full">
                Get started free
              </RetroButton>
            </MarketingAuthLink>
          </article>
          <article className="simple-plan-card simple-plan-card--popular">
            <p className="font-bold text-lg text-retro-accent">Pro</p>
            <p className="text-2xl font-bold mt-1">
              {formatPrice(prices.yearly)}
              <span className="text-sm font-normal text-retro-text-dim"> /yr</span>
            </p>
            <p className="text-xs text-retro-text-muted mt-1">{discountPercent}% off vs monthly</p>
            <div className="mt-4">
              <PlanFeatureList features={PLAN_FEATURES.PRO} finePrint={PLAN_FINE_PRINT.PRO} />
            </div>
            <Link href="/pricing" prefetch className="block mt-6">
              <RetroButton className="w-full">Upgrade to Pro</RetroButton>
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
      <div className="mx-auto max-w-xl px-4 py-14">
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
    <section className="simple-cta py-16 text-center px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Ready to turn traffic into followers?
      </h2>
      <p className="text-white/85 mb-8 text-sm md:text-base">
        Join creators who gate downloads and grow on every share.
      </p>
      <MarketingAuthLink href="/sign-up" className="inline-block">
        <RetroButton size="lg" variant="white">
          Get started for free
        </RetroButton>
      </MarketingAuthLink>
    </section>
  );
}
