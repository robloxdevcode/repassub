"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";
import { HOME_FAQS } from "@/lib/seo";
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
