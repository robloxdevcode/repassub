"use client";

import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { HOME_FAQS } from "@/lib/seo";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { Download, Layers, TrendingUp, Link2, MousePointerClick, Share2 } from "lucide-react";

export { HeroSection } from "@/components/marketing/hero-section";

const WHAT_WE_OFFER = [
  {
    icon: Download,
    title: "Block the download",
    desc: "Fans must follow, subscribe, or join before your file or code appears.",
  },
  {
    icon: Layers,
    title: "Stack fan steps",
    desc: "Free: 4 steps per link. Pro: 10 steps for longer funnels.",
  },
  {
    icon: TrendingUp,
    title: "Grow every share",
    desc: "Each unlock link turns downloads into followers, subs, and signups.",
  },
];

const STEPS = [
  { icon: Link2, title: "Paste file link", desc: "Drive, Dropbox, or any URL." },
  { icon: MousePointerClick, title: "Add fan steps", desc: "We detect the platform from your links." },
  { icon: Share2, title: "Share one URL", desc: "Bio, video description, Discord — anywhere." },
];

export function WhatWeOfferSection() {
  return (
    <section className="simple-section">
      <div className="mx-auto max-w-5xl px-4 py-14 md:py-16">
        <h2 className="simple-section-title text-center mb-2">What Linklock does</h2>
        <p className="text-center text-retro-text-dim mb-10 max-w-md mx-auto">
          A content gate for creators — not a file host. You keep your links; we handle the unlock flow.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {WHAT_WE_OFFER.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="simple-value-card">
              <Icon size={22} className="text-retro-accent mb-3" strokeWidth={2} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StepsSection() {
  return (
    <section className="simple-section bg-retro-surface-2">
      <div className="mx-auto max-w-5xl px-4 py-14 md:py-16">
        <h2 className="simple-section-title text-center mb-2">3 steps to launch</h2>
        <p className="text-center text-retro-text-dim mb-10">About two minutes. No code.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <article key={step.title} className="simple-step-card">
              <span className="simple-step-num">{i + 1}</span>
              <step.icon size={22} className="text-retro-accent mb-3" strokeWidth={2} />
              <h3 className="text-base font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-retro-text-dim leading-relaxed">{step.desc}</p>
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
      <div className="mx-auto max-w-5xl px-4 py-14 md:py-16">
        <h2 className="simple-section-title text-center mb-2">Pricing</h2>
        <p className="text-center text-retro-text-dim mb-10 max-w-lg mx-auto">
          Free = unlimited links + 4 steps. Pro = 10 steps + your branding + analytics + no ads.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <article className="simple-plan-card">
            <p className="text-sm font-semibold text-retro-text-dim mb-1">Free</p>
            <p className="text-3xl font-bold">{formatPrice(0)}</p>
            <p className="text-sm text-retro-text-muted mt-1">Unlimited links · 4 steps · starter stats</p>
            <div className="mt-6">
              <PlanFeatureList features={PLAN_FEATURES.FREE} finePrint={PLAN_FINE_PRINT.FREE} />
            </div>
            <div className="mt-6">
              <MarketingAuthLink href="/sign-up" className="block">
                <RetroButton variant="secondary" className="w-full">
                  Start free
                </RetroButton>
              </MarketingAuthLink>
            </div>
          </article>

          <article className="simple-plan-card simple-plan-card--popular">
            <p className="text-sm font-semibold text-retro-accent mb-1">Pro</p>
            <p className="text-3xl font-bold">
              {formatPrice(prices.yearly)}
              <span className="text-base font-normal text-retro-text-dim"> /yr</span>
            </p>
            <p className="text-xs text-retro-text-muted mt-1">{discountPercent}% off vs monthly</p>
            <div className="mt-6">
              <PlanFeatureList features={PLAN_FEATURES.PRO} finePrint={PLAN_FINE_PRINT.PRO} />
            </div>
            <div className="mt-6">
              <Link href="/pricing" prefetch className="block">
                <RetroButton variant="primary" className="w-full">
                  Upgrade to Pro
                </RetroButton>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const { labels, discountPercent } = useCurrency();

  const faqs = HOME_FAQS.map((item) =>
    item.q === "What does Pro include?"
      ? {
          ...item,
          a: `10 steps per link, full branding, deep analytics, no Linklock ads. ${labels.yearly} (${discountPercent}% off) or ${labels.monthly}.`,
        }
      : item
  );

  return (
    <section id="faq" className="simple-section bg-retro-surface-2 scroll-mt-20">
      <div className="mx-auto max-w-2xl px-4 py-14 md:py-16">
        <h2 className="simple-section-title text-center mb-8">Quick answers</h2>
        <div className="flex flex-col gap-3">
          {faqs.map((item) => (
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
    <section className="simple-section simple-cta">
      <div className="mx-auto max-w-2xl px-4 py-14 md:py-16 text-center">
        <h2 className="simple-section-title text-white mb-3">Start gating downloads for free</h2>
        <p className="text-white/85 mb-8 max-w-md mx-auto">
          Unlimited links. Four fan steps. No credit card.
        </p>
        <MarketingAuthLink href="/sign-up" className="inline-block">
          <RetroButton size="lg" variant="white" className="min-w-[220px]">
            Create my link
          </RetroButton>
        </MarketingAuthLink>
      </div>
    </section>
  );
}
