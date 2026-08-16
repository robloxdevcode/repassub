"use client";

import { useEffect, useState } from "react";
import { BarChart3, Layers, Zap } from "lucide-react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton, RetroLink } from "@/components/retro";

const HIGHLIGHTS = [
  {
    icon: Layers,
    title: "Action gating",
    desc: "Set the steps required before a download or link unlocks.",
  },
  {
    icon: BarChart3,
    title: "Built-in analytics",
    desc: "Views, unlocks, and conversion — all in one dashboard.",
  },
  {
    icon: Zap,
    title: "Live in minutes",
    desc: "Upload, configure, share. No code or complex setup.",
  },
];

export function HeroSection() {
  return (
    <section className="ll-hero ll-hero--business">
      <div className="ll-hero-grid-bg" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-14 pb-16 md:pt-20 md:pb-20">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-14 items-center">
          <div className="text-center lg:text-left">
            <h1 className="ll-hero-title ll-hero-title--light">
              Share a link.
              <br />
              <span className="text-retro-accent">Unlock on completion.</span>
            </h1>
            <p className="mt-5 text-lg text-retro-text-dim leading-relaxed max-w-md mx-auto lg:mx-0">
              Gate files and links behind simple actions. Visitors finish the steps — your content opens. Free to
              start.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <MarketingAuthLink href="/sign-up" className="inline-block w-full sm:w-auto">
                <RetroButton size="lg" className="w-full sm:min-w-[180px]">
                  Get started
                </RetroButton>
              </MarketingAuthLink>
              <RetroLink href="/pricing" variant="secondary" size="lg" className="w-full sm:w-auto sm:min-w-[140px]">
                View pricing
              </RetroLink>
            </div>
            <p className="mt-4 text-sm text-retro-text-muted">No credit card required</p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="ll-demo-wrap ll-demo-wrap--light w-full max-w-[400px]">
              <HeroLiveUnlock size="lg" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BusinessHighlights() {
  return (
    <section className="ll-highlights">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="ll-highlight-item">
              <div className="ll-highlight-icon">
                <item.icon size={20} strokeWidth={2} />
              </div>
              <h2 className="text-base font-semibold text-retro-text mt-4">{item.title}</h2>
              <p className="mt-2 text-sm text-retro-text-dim leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlatformCountStrip() {
  const [count, setCount] = useState(0);
  const target = 80;

  useEffect(() => {
    let frame = 0;
    let start = 0;
    const duration = 1400;

    const tick = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="ll-platform-count ll-platform-count--business" aria-label="Integrations">
      <p className="ll-platform-count-value">
        <span className="tabular-nums">{count}</span>+ integrations supported
      </p>
    </section>
  );
}

export function LandingCtaBar() {
  return (
    <section className="ll-landing-cta">
      <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="text-lg font-semibold text-retro-text">Start gating content today</p>
          <p className="text-sm text-retro-text-muted mt-1">Free plan includes unlimited links.</p>
        </div>
        <MarketingAuthLink href="/sign-up" className="shrink-0 w-full sm:w-auto">
          <RetroButton size="lg" className="w-full sm:min-w-[160px]">
            Create account
          </RetroButton>
        </MarketingAuthLink>
      </div>
    </section>
  );
}
