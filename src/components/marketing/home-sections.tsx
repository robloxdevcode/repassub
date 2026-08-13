"use client";

import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { HOME_FAQS } from "@/lib/seo";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { Link2, MousePointerClick, Share2 } from "lucide-react";

export { HeroSection } from "@/components/marketing/hero-section";

const STEPS = [
  {
    icon: Link2,
    title: "Paste your file link",
    desc: "Google Drive, Dropbox, or any URL you already use.",
  },
  {
    icon: MousePointerClick,
    title: "Add 1–2 simple steps",
    desc: "Subscribe, follow, or join — we detect the platform for you.",
  },
  {
    icon: Share2,
    title: "Share one link",
    desc: "Put it in your bio, video, or Discord. Done.",
  },
];

export function StepsSection() {
  return (
    <section className="simple-section bg-retro-surface-2">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
        <h2 className="simple-section-title text-center mb-3">How it works</h2>
        <p className="text-center text-retro-text-dim mb-12 max-w-md mx-auto">
          Three steps. About two minutes. No tech skills needed.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
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
    <section className="simple-section bg-retro-surface-2">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
        <h2 className="simple-section-title text-center mb-3">Free vs Pro</h2>
        <p className="text-center text-retro-text-dim mb-10 max-w-lg mx-auto">
          Start free with everything you need. Upgrade when you want unlimited links, full branding, and growth
          insights.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <article className="simple-plan-card">
            <p className="text-sm font-semibold text-retro-text-dim mb-1">Free</p>
            <p className="text-2xl font-bold">{formatPrice(0)}</p>
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
            <p className="text-sm font-semibold text-retro-accent mb-1">Pro · Most popular</p>
            <p className="text-2xl font-bold">
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
          a: `${PLAN_FEATURES.PRO[0]}. ${PLAN_FEATURES.PRO[1]}. ${PLAN_FEATURES.PRO[3]}. ${labels.yearly} (${discountPercent}% off) or ${labels.monthly}.`,
        }
      : item
  );

  return (
    <section id="faq" className="simple-section scroll-mt-20">
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-20">
        <h2 className="simple-section-title text-center mb-10">Questions</h2>

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
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-20 text-center">
        <h2 className="simple-section-title text-white mb-3">
          Ready to grow while you share?
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Join creators who turn downloads into followers. Start free in minutes.
        </p>
        <MarketingAuthLink href="/sign-up" className="inline-block">
          <RetroButton size="lg" variant="white" className="min-w-[220px]">
            Get started free
          </RetroButton>
        </MarketingAuthLink>
      </div>
    </section>
  );
}
