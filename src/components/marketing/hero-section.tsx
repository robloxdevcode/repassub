"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton } from "@/components/retro";

const PLATFORMS = [
  { name: "YouTube", className: "platform-youtube" },
  { name: "Discord", className: "platform-discord" },
  { name: "Spotify", className: "platform-spotify" },
  { name: "Drive", className: "landing-tag-neutral" },
];

export function HeroSection() {
  return (
    <section className="landing-simple-hero border-b-[3px] border-retro-ink overflow-hidden">
      <div className="landing-color-stripe" aria-hidden />

      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="text-center md:text-left min-w-0">
            <h1 className="landing-hero-title font-body text-retro-ink">
              Make them <span className="text-retro-accent">follow</span>.
              <br />
              Then <span className="text-retro-blue">unlock</span>.
            </h1>

            <p className="mt-4 text-base md:text-lg text-retro-text-dim leading-relaxed max-w-md mx-auto md:mx-0">
              One link. Fans finish your steps — then your file drops. Free to start.
            </p>

            <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-2">
              {PLATFORMS.map((p) => (
                <span
                  key={p.name}
                  className={`font-display text-[6px] sm:text-[7px] px-2.5 py-1 border-2 border-retro-ink brutal-shadow-sm ${p.className}`}
                >
                  {p.name.toUpperCase()}
                </span>
              ))}
            </div>

            <div className="mt-8 flex justify-center md:justify-start">
              <MarketingAuthLink href="/sign-up" className="w-full sm:w-auto">
                <RetroButton size="lg" variant="primary" className="w-full sm:w-auto min-w-[180px]">
                  Start free
                </RetroButton>
              </MarketingAuthLink>
            </div>

            <p className="mt-4 font-body text-sm text-retro-text-muted max-w-md mx-auto md:mx-0">
              Over <span className="font-bold text-retro-ink">1,250+</span> users already joined.
            </p>
          </div>

          <div className="landing-demo-panel min-w-0 flex flex-col items-center md:items-end">
            <p className="font-display text-[8px] text-retro-text-muted tracking-[0.15em] mb-3 flex items-center gap-2">
              <span className="live-pill live-pill-sm">LIVE</span>
              FAN VIEW
            </p>
            <div className="landing-demo-frame w-full max-w-[280px]">
              <HeroLiveUnlock size="md" className="w-full mx-auto" />
            </div>
            <p className="mt-3 text-xs text-retro-text-muted text-center md:text-right max-w-[280px]">
              Tasks tick off · bar fills · file unlocks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
