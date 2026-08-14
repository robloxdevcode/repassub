"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton } from "@/components/retro";

export function HeroSection() {
  return (
    <section className="simple-hero border-b border-retro-border">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="simple-hero-title">
              Gate your downloads.
              <br className="hidden sm:block" /> Grow your audience.
            </h1>
            <p className="mt-5 text-lg text-retro-text-dim leading-relaxed max-w-lg mx-auto lg:mx-0">
              Unlock links that require a subscribe, join, or follow — then the file opens.
              Viewers never need an account.
            </p>
            <div className="mt-8">
              <MarketingAuthLink href="/sign-up" className="inline-block w-full sm:w-auto">
                <RetroButton size="lg" className="w-full sm:min-w-[200px]">
                  Get started free
                </RetroButton>
              </MarketingAuthLink>
            </div>
            <p className="mt-4 text-sm text-retro-text-muted">
              Unlimited links · 4 steps on Free · No card
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HeroLiveUnlock size="lg" className="w-full max-w-[360px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
