"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { HOME_FAQS } from "@/lib/seo";
export { HeroSection } from "@/components/marketing/hero-section";

const STEPS = [
  {
    n: "01",
    title: "Paste your link",
    desc: "Drive, Dropbox, or any URL you already host.",
    tone: "landing-step-red",
  },
  {
    n: "02",
    title: "Pick the steps",
    desc: "Subscribe, follow, join Discord — 2 free, 4 on Pro.",
    tone: "landing-step-blue",
  },
  {
    n: "03",
    title: "Share once",
    desc: "Bio, video description, Discord — one link everywhere.",
    tone: "landing-step-yellow",
  },
];

export function StepsSection() {
  return (
    <section className="landing-section border-b-[3px] border-retro-ink bg-retro-surface-2">
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="mb-10 max-w-xl">
          <p className="font-display text-[8px] text-retro-accent tracking-[0.2em] mb-3">HOW IT WORKS</p>
          <h2 className="landing-section-title font-body text-retro-ink">
            Three steps. <span className="text-retro-blue">Two minutes.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {STEPS.map((step) => (
            <article
              key={step.n}
              className={`landing-step-card brutal-border brutal-shadow p-5 md:p-6 h-full ${step.tone}`}
            >
              <span className="font-display text-[10px] opacity-90">{step.n}</span>
              <h3 className="font-body text-lg font-bold mt-3 mb-2">{step.title}</h3>
              <p className="font-body text-sm opacity-95 leading-relaxed">{step.desc}</p>
            </article>
          ))}
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
          a: `No ads, unlimited links, custom branding, and stats. ${labels.yearly} (${discountPercent}% off) or ${labels.monthly}.`,
        }
      : item
  );
  return (
    <section id="faq" className="landing-section border-b-[3px] border-retro-ink bg-retro-bg scroll-mt-20">
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <p className="font-display text-[8px] text-retro-accent tracking-[0.2em] mb-3">FAQ</p>
        <h2 className="landing-section-title font-body text-retro-ink mb-8">
          Quick <span className="text-retro-accent">answers</span>
        </h2>

        <div className="flex flex-col gap-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="brutal-border brutal-shadow bg-retro-surface p-4 md:p-5 group landing-faq-item"
            >
              <summary className="font-body font-bold text-sm md:text-base cursor-pointer list-none flex items-center justify-between gap-4">
                {item.q}
                <span className="font-display text-retro-accent group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="font-body text-sm text-retro-text-dim leading-relaxed mt-3 pt-3 border-t-2 border-retro-ink/10">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="landing-section landing-cta bg-pop-red text-white border-b-[3px] border-retro-ink">
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 text-center">
        <h2 className="landing-section-title font-body mb-3">
          Your audience is waiting.
        </h2>
        <p className="font-body text-white/85 mb-8 max-w-md mx-auto">
          First unlock link in about two minutes. Free every week.
        </p>
        <MarketingAuthLink href="/sign-up" className="inline-block">
          <RetroButton size="lg" variant="secondary" className="min-w-[200px] bg-retro-yellow text-retro-ink border-retro-ink">
            Start free
          </RetroButton>
        </MarketingAuthLink>
      </div>
    </section>
  );
}
