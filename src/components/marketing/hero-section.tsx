"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { AnimatedDotBackground } from "@/components/marketing/animated-dot-background";
import { RetroButton } from "@/components/retro";

export function HeroSection() {
  return (
    <section className="ll-hero">
      <AnimatedDotBackground variant="dark" connectLines />
      <div className="ll-hero-glow ll-hero-glow--1" aria-hidden />
      <div className="ll-hero-glow ll-hero-glow--2" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="ll-brand-tag">For social creators</p>
            <h1 className="ll-hero-title mt-4">
              Control access to your content
              <br />
              <span className="ll-gradient-text">and grow your audience</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg mx-auto lg:mx-0">
              One link — fans subscribe, join, or follow, then your content unlocks. They don&apos;t need an account.
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
