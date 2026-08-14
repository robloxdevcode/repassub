"use client";

import Link from "next/link";
import { ChevronDown, Download, Music, Package, Palette } from "lucide-react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { AnimatedDotBackground } from "@/components/marketing/animated-dot-background";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { HOME_FAQS } from "@/lib/seo";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";

export { HeroSection } from "@/components/marketing/hero-section";

const STEPS = [
  {
    num: "01",
    title: "Drop your file",
    desc: "MP3, ZIP, PDF, or a URL — whatever fans are grabbing.",
  },
  {
    num: "02",
    title: "Set the steps",
    desc: "Subscribe, join Discord, follow — up to 4 on Free, 10 on Pro.",
  },
  {
    num: "03",
    title: "Share one link",
    desc: "Post it anywhere. Fans unlock without making an account.",
  },
];

const USE_CASES = [
  {
    icon: Music,
    title: "Beat packs & samples",
    desc: "Gate downloads behind a YouTube sub or Discord join.",
    tag: "Producers",
  },
  {
    icon: Package,
    title: "Mod & asset files",
    desc: "Require a follow or server join before the ZIP opens.",
    tag: "Creators",
  },
  {
    icon: Palette,
    title: "Presets & templates",
    desc: "Trade a subscribe for your latest pack or project file.",
    tag: "Designers",
  },
];

const PLATFORMS = [
  "YouTube",
  "Discord",
  "Spotify",
  "Instagram",
  "TikTok",
  "Twitter",
  "Twitch",
  "Telegram",
  "SoundCloud",
  "Patreon",
];

export function HowItWorksSection() {
  return (
    <section className="ll-section ll-section--surface">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="ll-brand-tag ll-brand-tag--dark">HOW IT WORKS</p>
            <h2 className="ll-section-title mt-3">Three steps, one link</h2>
          </div>
          <p className="text-sm text-retro-text-dim max-w-sm md:text-right">
            Most links are live in under 2 minutes. No code, no embeds.
          </p>
        </div>

        <ol className="ll-steps">
          {STEPS.map((step, i) => (
            <li key={step.num} className="ll-step">
              <span className="ll-step-num">{step.num}</span>
              <div>
                <h3 className="font-bold text-base mb-1">{step.title}</h3>
                <p className="text-sm text-retro-text-dim leading-relaxed">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 ? (
                <span className="ll-step-arrow hidden md:block" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PlatformMarquee() {
  const items = [...PLATFORMS, ...PLATFORMS];

  return (
    <section className="ll-marquee-wrap" aria-label="Supported platforms">
      <div className="ll-marquee-track">
        {items.map((name, i) => (
          <span key={`${name}-${i}`} className="ll-marquee-item">
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

export function UseCasesSection() {
  return (
    <section className="ll-section">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="ll-brand-tag ll-brand-tag--dark">USE CASES</p>
        <h2 className="ll-section-title mt-3 mb-10">What people gate</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {USE_CASES.map((item) => (
            <article key={item.title} className="ll-use-case">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="ll-use-case-icon">
                  <item.icon size={20} />
                </div>
                <span className="ll-use-case-tag">{item.tag}</span>
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-retro-text-dim leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/use-cases" prefetch className="text-sm font-medium text-retro-accent hover:underline">
            More use cases →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** @deprecated */
export function TrustStrip() {
  return null;
}

/** @deprecated */
export function FeaturesSection() {
  return null;
}

export function PlansSection() {
  const { formatPrice, prices, discountPercent } = useCurrency();

  return (
    <section id="pricing" className="ll-section ll-section--muted scroll-mt-20">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="mb-10">
          <p className="ll-brand-tag ll-brand-tag--dark">PRICING</p>
          <h2 className="ll-section-title mt-3">Free to start</h2>
          <p className="mt-3 text-retro-text-dim text-sm max-w-lg">
            Unlimited links on both plans. Pro unlocks more steps, your branding, and no ads.
          </p>
        </div>

        <div className="ll-plan-compare mb-6">
          <span>4 steps / link</span>
          <span className="ll-plan-compare-divider" />
          <span className="text-retro-accent font-semibold">10 steps on Pro</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <article className="ll-plan-card">
            <p className="font-bold text-lg">Free</p>
            <p className="ll-plan-price mt-1">{formatPrice(0)}</p>
            <div className="mt-6 flex-1">
              <PlanFeatureList features={PLAN_FEATURES.FREE} finePrint={PLAN_FINE_PRINT.FREE} />
            </div>
            <MarketingAuthLink href="/sign-up" className="block mt-10">
              <RetroButton variant="secondary" className="w-full">
                Start free
              </RetroButton>
            </MarketingAuthLink>
          </article>

          <article className="ll-plan-card ll-plan-card--pro">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-lg">Pro</p>
              <span className="ll-plan-badge">Pro</span>
            </div>
            <p className="ll-plan-price mt-1">
              {formatPrice(prices.yearly)}
              <span className="text-sm font-normal text-retro-text-dim"> /yr</span>
            </p>
            <p className="text-xs text-retro-text-muted mt-1">{discountPercent}% off vs monthly</p>
            <div className="mt-6 flex-1">
              <PlanFeatureList features={PLAN_FEATURES.PRO} finePrint={PLAN_FINE_PRINT.PRO} />
            </div>
            <Link href="/pricing" prefetch className="block mt-10">
              <RetroButton className="w-full ll-btn-glow">Go Pro</RetroButton>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="ll-section scroll-mt-20">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <p className="ll-brand-tag ll-brand-tag--dark">FAQ</p>
        <h2 className="ll-section-title mt-3 mb-8">Common questions</h2>
        <div className="flex flex-col gap-2">
          {HOME_FAQS.map((item) => (
            <details key={item.q} className="ll-faq ll-faq--clean">
              <summary className="ll-faq-q ll-faq-q--clean">
                {item.q}
                <ChevronDown size={18} className="ll-faq-chevron shrink-0" />
              </summary>
              <p className="ll-faq-a ll-faq-a--clean">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="ll-cta">
      <AnimatedDotBackground variant="dark" connectLines density={0.7} />
      <div className="ll-hero-glow ll-hero-glow--1" aria-hidden />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-20">
        <div className="ll-cta-box">
          <Download size={28} className="text-retro-accent mb-4 mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight text-center">
            Make your first unlock link
          </h2>
          <p className="mt-3 text-white/55 text-center text-sm">
            Free · unlimited links · no card
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <MarketingAuthLink href="/sign-up" className="inline-block">
              <RetroButton size="lg" variant="white" className="w-full sm:min-w-[200px]">
                Create a link
              </RetroButton>
            </MarketingAuthLink>
            <Link href="/how-it-works" prefetch className="inline-block">
              <RetroButton size="lg" variant="ghost" className="ll-hero-ghost w-full sm:min-w-[200px]">
                How it works
              </RetroButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
