"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton, RetroLink } from "@/components/retro";
import { ArrowRight, Link2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="ll-hero">
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-16 pb-16 md:pt-24 md:pb-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="ll-brand-tag">For social creators</p>
            <h1 className="ll-hero-title mt-4">
              Share content only after
              <br />
              they subscribe or follow
            </h1>
            <p className="mt-5 text-lg text-retro-text-dim leading-relaxed max-w-lg mx-auto lg:mx-0">
              One link for YouTube, TikTok, Instagram, and Discord. Fans complete a step, then your file or link unlocks.
            </p>

            <div className="ll-url-bar mt-8 mx-auto lg:mx-0 max-w-md">
              <span className="ll-url-bar-icon" aria-hidden>
                <Link2 size={14} />
              </span>
              <span className="ll-url-bar-text">
                linklock.org/u/<strong>you</strong>/drop
              </span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <MarketingAuthLink href="/sign-up" className="inline-block w-full sm:w-auto">
                <RetroButton size="lg" className="w-full sm:min-w-[200px]">
                  Get started free
                </RetroButton>
              </MarketingAuthLink>
              <RetroLink
                href="/examples"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[160px] group"
              >
                See examples
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </RetroLink>
            </div>
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
