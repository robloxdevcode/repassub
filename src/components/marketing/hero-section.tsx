"use client";

import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";

const DEMO = "/u/demo/free-preset-pack";

const PLATFORMS = [
  { name: "YouTube", className: "platform-youtube" },
  { name: "Discord", className: "platform-discord" },
  { name: "Spotify", className: "platform-spotify" },
  { name: "Drive", className: "bg-retro-surface-2 text-retro-ink border-2 border-retro-ink" },
];

export function HeroSection() {
  const { labels, discountPercent } = useCurrency();

  return (
    <section className="relative border-b-[3px] border-retro-ink overflow-hidden">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hero-stage px-6 py-10 md:px-10 md:py-14 lg:py-16 lg:pl-12 lg:pr-8">
          <div className="hero-orb hero-orb-red" aria-hidden />
          <div className="hero-orb hero-orb-blue" aria-hidden />
          <div className="hero-orb hero-orb-yellow" aria-hidden />

          <span className="hp-deco hp-deco-star hp-deco-1" aria-hidden />
          <span className="hp-deco hp-deco-square hp-deco-2" aria-hidden />
          <span className="hp-deco hp-deco-square hp-deco-3" aria-hidden />

          <div className="relative max-w-xl">
            <div className="hero-stagger hero-stagger-1 inline-flex items-center gap-2 font-display text-[8px] bg-retro-yellow border-2 border-retro-ink px-3 py-1.5 brutal-shadow-sm mb-6 animate-wiggle">
              <span className="live-pill live-pill-sm !text-[5px]">NEW</span>
              PRO {discountPercent}% OFF YEARLY
            </div>

            <h1 className="hero-stagger hero-stagger-2 hero-title font-body text-retro-ink">
              Make them <span className="hero-accent-word">follow</span>.
              <br />
              Then <span className="text-retro-blue">unlock</span>.
            </h1>

            <p className="hero-stagger hero-stagger-3 mt-5 text-base md:text-lg text-retro-text-dim font-body leading-relaxed max-w-md">
              One link. They subscribe, follow, or join — then your preset, pack, or file drops. Free to start. Live in
              ~2 minutes.
            </p>

            <div className="hero-stagger hero-stagger-4 mt-6 flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <span
                  key={p.name}
                  className={`font-display text-[6px] px-2.5 py-1.5 border-2 border-retro-ink brutal-shadow-sm ${p.className}`}
                >
                  {p.name.toUpperCase()}
                </span>
              ))}
            </div>

            <div className="hero-stagger hero-stagger-5 mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <MarketingAuthLink href="/sign-up">
                <RetroButton size="lg" variant="primary" className="w-full sm:w-auto min-w-[168px]">
                  Start free
                </RetroButton>
              </MarketingAuthLink>
              <Link href="/pricing">
                <RetroButton size="lg" variant="secondary" className="w-full sm:w-auto min-w-[168px]">
                  Pro {labels.monthly}
                </RetroButton>
              </Link>
              <Link
                href={DEMO}
                className="inline-flex items-center justify-center font-body text-sm font-bold text-retro-blue hover:underline px-2 py-3"
              >
                Try live demo →
              </Link>
            </div>

            <p className="hero-stagger hero-stagger-6 mt-5 font-body text-sm text-retro-text-muted">
              5 links/week · no card · stats on every link
            </p>
          </div>
        </div>

        <div className="relative bg-pop-blue border-t-[3px] lg:border-t-0 lg:border-l-[3px] border-retro-ink px-6 py-10 md:py-12 lg:py-14 lg:pr-10 lg:pl-8 flex flex-col items-center lg:items-end justify-start overflow-hidden">
          <div className="marketing-grain pointer-events-none" aria-hidden />
          <div className="hp-checker hp-checker-hero" aria-hidden />

          <p className="relative hero-stagger hero-stagger-7 font-display text-[8px] text-white mb-4 lg:self-end tracking-[0.15em] flex items-center gap-2">
            <span className="live-pill live-pill-sm">LIVE</span>
            FAN VIEW
          </p>

          <div className="relative hero-stagger hero-stagger-8 w-full max-w-[340px] lg:mr-0 hp-demo-stack">
            <div className="hp-demo-offset hp-demo-offset-red" aria-hidden />
            <div className="hp-demo-offset hp-demo-offset-yellow" aria-hidden />
            <div className="relative hp-demo-float">
              <HeroLiveUnlock size="lg" />
            </div>
          </div>

          <p className="relative mt-5 font-body text-xs text-white/85 text-center lg:text-right max-w-[340px]">
            Tasks tick off · bar fills · file unlocks. Your fans never leave confused.
          </p>
        </div>
      </div>

      <div className="hp-stripe-bar border-t-[3px] border-retro-ink" aria-hidden />
    </section>
  );
}
