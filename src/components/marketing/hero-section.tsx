"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton } from "@/components/retro";

export function HeroSection() {
  return (
    <section className="simple-hero">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="simple-badge mb-4">70+ platforms · Free to start</p>
            <h1 className="simple-hero-title">
              Make them follow.
              <br />
              Then unlock your file.
            </h1>
            <p className="mt-5 text-lg text-retro-text-dim leading-relaxed max-w-lg mx-auto lg:mx-0">
              One link. Fans tap your steps — subscribe, follow, or join — then your download opens.
              No account needed for them.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <MarketingAuthLink href="/sign-up" className="w-full sm:w-auto">
                <RetroButton size="lg" variant="primary" className="w-full sm:min-w-[220px]">
                  Create my first link
                </RetroButton>
              </MarketingAuthLink>
            </div>
            <p className="mt-4 text-sm text-retro-text-muted">
              Free forever · No card required
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
