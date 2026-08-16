"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { AnimatedDotBackground } from "@/components/marketing/animated-dot-background";
import { RetroButton, RetroLink } from "@/components/retro";
import { ArrowRight, Link2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="ll-hero">
      <AnimatedDotBackground variant="dark" connectLines />
      <div className="ll-hero-glow ll-hero-glow--1" aria-hidden />
      <div className="ll-hero-glow ll-hero-glow--2" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left relative">
            <span
              className="ll-float-sticker ll-sticker ll-sticker--lime absolute -top-1 right-2 sm:right-8 lg:right-auto lg:left-[52%] hidden sm:inline-block"
              aria-hidden
            >
              free
            </span>
            <span
              className="ll-float-sticker ll-sticker ll-sticker--pink absolute top-28 -right-1 hidden lg:inline-block"
              aria-hidden
            >
              1 tap
            </span>
            <p className="ll-brand-tag">For creators</p>
            <h1 className="ll-hero-title font-display mt-4">
              Gate your drops.
              <br />
              <span className="ll-gradient-text">Grow your fans.</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Beat packs, mods, presets — one link. Fans subscribe or join, then the file unlocks. No signup for them.
            </p>

            <div className="ll-url-bar mt-8 mx-auto lg:mx-0 max-w-md">
              <span className="ll-url-bar-icon" aria-hidden>
                <Link2 size={14} />
              </span>
              <span className="ll-url-bar-text">
                linklock.org/u/<strong>you</strong>/pack-v3
              </span>
              <span className="ll-url-bar-badge">Live</span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <MarketingAuthLink href="/sign-up" className="inline-block w-full sm:w-auto">
                <RetroButton size="lg" variant="yellow" className="w-full sm:min-w-[220px] ll-btn-glow">
                  Make my first link
                </RetroButton>
              </MarketingAuthLink>
              <RetroLink
                href="/examples"
                variant="ghost"
                size="lg"
                className="ll-hero-ghost w-full sm:w-auto sm:min-w-[160px] group"
              >
                See examples
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-rotate-12" />
              </RetroLink>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="ll-demo-wrap w-full max-w-[400px]">
              <HeroLiveUnlock size="lg" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
