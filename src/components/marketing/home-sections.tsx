"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { HOME_FAQS } from "@/lib/seo";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { cn } from "@/lib/utils";

export { HeroSection } from "@/components/marketing/hero-section";

function FeatureRow({
  label,
  title,
  desc,
  visual,
  reverse,
}: {
  label: string;
  title: string;
  desc: string;
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={cn("simple-feature-row", reverse && "simple-feature-row--reverse")}>
      <div className="simple-feature-copy">
        <p className="simple-feature-label">{label}</p>
        <h2 className="simple-section-title mb-3">{title}</h2>
        <p className="text-retro-text-dim leading-relaxed max-w-md">{desc}</p>
      </div>
      <div className="simple-feature-visual">{visual}</div>
    </div>
  );
}

export function TrustStrip() {
  return (
    <section className="border-b border-retro-border bg-retro-surface-2">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <p className="text-center text-sm text-retro-text-dim">
          Unlimited links on Free · 70+ platform actions · No account needed for viewers
        </p>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="simple-section">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20 flex flex-col gap-20">
        <FeatureRow
          label="Unlock steps"
          title="Turn downloads into followers"
          desc="Choose what viewers must do — subscribe, join a server, follow a profile. They finish the list, then your file unlocks."
          visual={
            <div className="rounded-xl border border-retro-border bg-retro-surface p-5">
              <p className="text-xs text-retro-text-muted mb-3">Actions on this link</p>
              <div className="flex flex-wrap gap-2">
                {["Subscribe", "Join Discord", "Follow", "Like post", "Visit link"].map((action) => (
                  <span key={action} className="simple-action-chip">
                    {action}
                  </span>
                ))}
              </div>
            </div>
          }
        />
        <FeatureRow
          label="Analytics"
          title="Track what converts"
          desc="Views, unlocks, and completion rate on every link. See which shares actually grow your channels."
          reverse
          visual={
            <div className="grid grid-cols-3 gap-3">
              <div className="simple-stat-pill">
                <strong>2.4k</strong>
                <span>Views</span>
              </div>
              <div className="simple-stat-pill">
                <strong>891</strong>
                <span>Unlocks</span>
              </div>
              <div className="simple-stat-pill">
                <strong>37%</strong>
                <span>Rate</span>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}

/** @deprecated Use FeaturesSection */
export function OfferSection() {
  return <FeaturesSection />;
}

export function PlansSection() {
  const { formatPrice, prices, discountPercent } = useCurrency();

  return (
    <section id="pricing" className="simple-section scroll-mt-20 bg-retro-surface-2">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="simple-section-title text-center mb-2">Pricing</h2>
        <p className="text-center text-sm text-retro-text-dim mb-8">
          Free includes unlimited links. Pro adds more steps, branding, and removes ads.
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
                Get started
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
              <RetroButton className="w-full">View Pro plans</RetroButton>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="simple-section scroll-mt-20">
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
        Start gating content today
      </h2>
      <p className="text-white/85 mb-8 text-sm md:text-base max-w-md mx-auto">
        Free plan — unlimited links, 4 steps per link, basic stats.
      </p>
      <MarketingAuthLink href="/sign-up" className="inline-block">
        <RetroButton size="lg" variant="white">
          Get started free
        </RetroButton>
      </MarketingAuthLink>
    </section>
  );
}
