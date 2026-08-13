"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton } from "@/components/retro";

export function HeroSection() {
  return (
    <section className="simple-hero border-b border-retro-border">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <h1 className="simple-hero-title">Follow to unlock your file.</h1>
            <p className="mt-4 text-lg text-retro-text-dim max-w-md mx-auto lg:mx-0">
              One link. Fans do your steps, then the download opens. Free: unlimited links, 4 steps. Pro: 10 steps,
              branding, no ads.
            </p>
            <div className="mt-8">
              <MarketingAuthLink href="/sign-up" className="inline-block w-full sm:w-auto">
                <RetroButton size="lg" className="w-full sm:min-w-[200px]">
                  Start free
                </RetroButton>
              </MarketingAuthLink>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HeroLiveUnlock size="lg" className="w-full max-w-[340px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
