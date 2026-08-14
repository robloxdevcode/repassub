"use client";

import Link from "next/link";
import {
  BarChart3,
  Layers,
  Palette,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { AnimatedDotBackground } from "@/components/marketing/animated-dot-background";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { HOME_FAQS } from "@/lib/seo";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { cn } from "@/lib/utils";

export { HeroSection } from "@/components/marketing/hero-section";

const BENTO = [
  {
    icon: Layers,
    title: "Stack unlock steps",
    desc: "Subscribe, join Discord, follow — up to 4 on Free, 10 on Pro.",
    className: "md:col-span-2",
    accent: "red",
  },
  {
    icon: BarChart3,
    title: "Live stats",
    desc: "Views, unlocks, and conversion on every link.",
    className: "",
    accent: "blue",
  },
  {
    icon: Palette,
    title: "Your branding",
    desc: "Logo, colors, and button copy on Pro.",
    className: "",
    accent: "yellow",
  },
  {
    icon: Users,
    title: "Audience export",
    desc: "CSV of everyone who unlocked.",
    className: "",
    accent: "green",
  },
  {
    icon: Shield,
    title: "No viewer accounts",
    desc: "Fans unlock in one click — no signup friction.",
    className: "md:col-span-2",
    accent: "red",
  },
];

const accentMap: Record<string, string> = {
  red: "ll-bento-icon--red",
  blue: "ll-bento-icon--blue",
  yellow: "ll-bento-icon--yellow",
  green: "ll-bento-icon--green",
};

export function TrustStrip() {
  return (
    <section className="ll-trust">
      <div className="mx-auto max-w-6xl px-4 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-sm text-retro-text-dim">
        <span className="flex items-center gap-2">
          <Zap size={15} className="text-retro-accent" />
          Unlimited links on Free
        </span>
        <span className="flex items-center gap-2">
          <Sparkles size={15} className="text-retro-accent" />
          70+ platform actions
        </span>
        <span className="flex items-center gap-2">
          <Shield size={15} className="text-retro-accent" />
          No account for viewers
        </span>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="ll-section ll-section--dots">
      <AnimatedDotBackground variant="light" connectLines density={0.75} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="ll-label">Features</p>
          <h2 className="ll-section-title mt-3">Everything to gate &amp; grow</h2>
          <p className="mt-4 text-retro-text-dim leading-relaxed">
            Build unlock pages in minutes. Share one link. Watch your channels grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {BENTO.map((item) => (
            <article
              key={item.title}
              className={cn("ll-bento-card", item.className)}
            >
              <div className={cn("ll-bento-icon", accentMap[item.accent])}>
                <item.icon size={20} />
              </div>
              <h3 className="font-bold text-base mt-4 mb-2">{item.title}</h3>
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
    <section id="pricing" className="ll-section ll-section--muted scroll-mt-20">
      <div className="mx-auto max-w-4xl px-4 py-20 md:py-28">
        <div className="text-center mb-12">
          <p className="ll-label">Pricing</p>
          <h2 className="ll-section-title mt-3">Simple plans</h2>
          <p className="mt-4 text-retro-text-dim text-sm">
            Start free. Upgrade when you need more steps and branding.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <article className="ll-plan-card">
            <p className="font-bold text-lg">Free</p>
            <p className="ll-plan-price mt-1">{formatPrice(0)}</p>
            <p className="text-xs text-retro-text-muted mt-1">forever</p>
            <div className="mt-6 flex-1">
              <PlanFeatureList features={PLAN_FEATURES.FREE} finePrint={PLAN_FINE_PRINT.FREE} />
            </div>
            <MarketingAuthLink href="/sign-up" className="block mt-8">
              <RetroButton variant="secondary" className="w-full">
                Get started
              </RetroButton>
            </MarketingAuthLink>
          </article>

          <article className="ll-plan-card ll-plan-card--pro">
            <div className="flex items-center gap-2">
              <p className="font-bold text-lg">Pro</p>
              <span className="ll-plan-badge">Popular</span>
            </div>
            <p className="ll-plan-price mt-1">
              {formatPrice(prices.yearly)}
              <span className="text-sm font-normal text-retro-text-dim"> /yr</span>
            </p>
            <p className="text-xs text-retro-text-muted mt-1">{discountPercent}% off vs monthly</p>
            <div className="mt-6 flex-1">
              <PlanFeatureList features={PLAN_FEATURES.PRO} finePrint={PLAN_FINE_PRINT.PRO} />
            </div>
            <Link href="/pricing" prefetch className="block mt-8">
              <RetroButton className="w-full ll-btn-glow">View Pro plans</RetroButton>
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
      <div className="mx-auto max-w-2xl px-4 py-20 md:py-28">
        <div className="text-center mb-10">
          <p className="ll-label">FAQ</p>
          <h2 className="ll-section-title mt-3">Questions</h2>
        </div>
        <div className="flex flex-col gap-3">
          {HOME_FAQS.map((item, i) => (
            <details key={item.q} className="ll-faq">
              <summary className="ll-faq-q">
                <span className="ll-faq-num">{String(i + 1).padStart(2, "0")}</span>
                {item.q}
              </summary>
              <p className="ll-faq-a">{item.a}</p>
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
      <AnimatedDotBackground variant="dark" connectLines density={0.85} />
      <div className="ll-hero-glow ll-hero-glow--1" aria-hidden />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Ready to grow on every share?
        </h2>
        <p className="mt-4 text-white/60 max-w-md mx-auto">
          Create your first unlock link in under 2 minutes. Free, unlimited links.
        </p>
        <MarketingAuthLink href="/sign-up" className="inline-block mt-9">
          <RetroButton size="lg" variant="white" className="min-w-[220px]">
            Get started free
          </RetroButton>
        </MarketingAuthLink>
      </div>
    </section>
  );
}
