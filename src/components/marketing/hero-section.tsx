"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroLink } from "@/components/retro";

export function HeroSection() {
  return (
    <section className="rk-hero ll-hero--business relative z-10 border-b-0">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-10 md:pt-14 md:pb-12">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-center">
          <div className="text-center lg:text-left">
            <p
              className="rk-hero-kicker mx-auto lg:mx-0 w-fit animate-fade-up"
              style={{ animationDelay: "0s" }}
            >
              <span className="rk-hero-kicker-dot" aria-hidden />
              Subscribe to unlock
            </p>
            <h1
              className="rk-hero-title mt-5 animate-fade-up"
              style={{ animationDelay: "0.08s" }}
            >
              Gate your content.
              <br />
              <span className="rk-hero-accent-orange">Grow your crowd.</span>
            </h1>
            <p
              className="mt-6 text-base md:text-lg text-retro-text-dim leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-up"
              style={{ animationDelay: "0.16s" }}
            >
              One link fans understand in seconds — subscribe, follow, or join, then your download unlocks.{" "}
              <span className="rk-hero-accent-green font-semibold">Free to start.</span>
            </p>

            <div
              className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-up"
              style={{ animationDelay: "0.24s" }}
            >
              <MarketingAuthLink href="/sign-up" className="inline-block w-full sm:w-auto">
                <span className="rk-btn rk-btn--primary w-full sm:min-w-[200px]">Get started free</span>
              </MarketingAuthLink>
              <RetroLink href="/sign-in" variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign in
              </RetroLink>
            </div>
          </div>

          <div
            className="flex justify-center lg:justify-end animate-fade-up rk-demo-ring"
            style={{ animationDelay: "0.32s" }}
          >
            <div className="rk-demo-inner w-full max-w-[380px]">
              <HeroLiveUnlock size="lg" className="w-full pro-demo-card" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
