"use client";

import { useEffect, useState } from "react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton, RetroLink } from "@/components/retro";

export function HeroSection() {
  return (
    <section className="ll-hero ll-hero--business relative z-10">
      <div className="ll-hero-grid-bg" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-16 md:pt-20 md:pb-20">
        <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-center">
          <div className="text-center lg:text-left">
            <p className="ll-hero-kicker">linklock.org</p>
            <h1 className="ll-hero-title ll-hero-title--light">
              Share a link.
              <br />
              <span className="ll-hero-accent">They finish the steps.</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-retro-text-dim leading-relaxed max-w-md mx-auto lg:mx-0">
              Your download or URL stays hidden until fans subscribe, follow, or join. You can also collect emails
              from people who complete the link.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <MarketingAuthLink href="/sign-up" className="inline-block w-full sm:w-auto">
                <RetroButton size="lg" className="w-full sm:min-w-[180px] ll-btn-playful">
                  Get started
                </RetroButton>
              </MarketingAuthLink>
              <RetroLink href="/pricing" variant="secondary" size="lg" className="w-full sm:w-auto sm:min-w-[130px]">
                Pricing
              </RetroLink>
            </div>
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

export function SimplePlatformLine() {
  const [count, setCount] = useState(0);
  const target = 80;

  useEffect(() => {
    let frame = 0;
    let start = 0;
    const duration = 1200;

    const tick = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="ll-platform-line" aria-label="Supported platforms">
      <p>
        Works with <span className="ll-hero-accent tabular-nums">{count}+</span> platforms — YouTube, Discord,
        TikTok, and more
      </p>
    </section>
  );
}
