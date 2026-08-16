"use client";

import { useEffect, useState } from "react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton } from "@/components/retro";

export function HeroSection() {
  return (
    <section className="ll-hero ll-hero--mesh">
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="ll-hero-title">
              Control access to your content
              <br />
              <span className="ll-gradient-text">and grow your audience</span>
            </h1>
            <p className="mt-6 text-lg text-white/75 leading-relaxed max-w-lg mx-auto lg:mx-0">
              One link — fans subscribe, join, or follow, then your content unlocks. They don&apos;t need an
              account.
            </p>

            <div className="mt-8 flex justify-center lg:justify-start">
              <MarketingAuthLink href="/sign-up" className="inline-block w-full sm:w-auto">
                <RetroButton size="lg" className="w-full sm:min-w-[220px] ll-btn-glow">
                  Create my first link
                </RetroButton>
              </MarketingAuthLink>
            </div>
            <p className="mt-5 text-sm text-white/45">Free forever · No card required</p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="ll-demo-wrap w-full max-w-[380px]">
              <HeroLiveUnlock size="lg" className="w-full" />
            </div>
          </div>
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
    <section className="ll-platform-count" aria-label="Supported platforms">
      <p className="ll-platform-count-value">
        <span className="tabular-nums">{count}</span>+ platforms supported
      </p>
    </section>
  );
}
