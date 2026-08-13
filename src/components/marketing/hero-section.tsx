"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton } from "@/components/retro";

const OFFER_POINTS = [
  { title: "Unlimited links", detail: "Free forever — no weekly cap" },
  { title: "4 fan steps", detail: "10 steps on Pro" },
  { title: "70+ platforms", detail: "YouTube, Discord, Spotify…" },
  { title: "No fan sign-up", detail: "They finish steps, file opens" },
];

export function HeroSection() {
  return (
    <section className="simple-hero border-b border-retro-border">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="text-center lg:text-left">
            <p className="simple-badge mb-4">Follow-to-unlock links for creators</p>
            <h1 className="simple-hero-title">
              Gate any download behind a follow or subscribe.
            </h1>
            <p className="mt-4 text-lg text-retro-text-dim leading-relaxed max-w-lg mx-auto lg:mx-0">
              Paste your file link, add the steps fans must do, share one URL. When they finish, the download
              opens — you grow your audience every time.
            </p>

            <div className="simple-offer-grid max-w-xl mx-auto lg:mx-0">
              {OFFER_POINTS.map((item) => (
                <div key={item.title} className="simple-offer-item">
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <MarketingAuthLink href="/sign-up" className="w-full sm:w-auto">
                <RetroButton size="lg" variant="primary" className="w-full sm:min-w-[220px]">
                  Create free link
                </RetroButton>
              </MarketingAuthLink>
              <MarketingAuthLink href="/pricing" signedInHref="/billing" className="w-full sm:w-auto">
                <RetroButton size="lg" variant="secondary" className="w-full sm:min-w-[160px]">
                  See pricing
                </RetroButton>
              </MarketingAuthLink>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroLiveUnlock size="lg" className="w-full max-w-[360px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
