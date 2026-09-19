"use client";

import { PlatformMarqueeTrack } from "@/components/marketing/platform-brand-icon";

export function TrustSocialStrip() {
  return (
    <section className="lt-platforms" aria-label="Platforms supported">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-center">
        <p className="text-base lt-subcopy">
          Plays nice with{" "}
          <span className="font-bold lt-accent-grape">80+ platforms</span>
        </p>
      </div>
      <div className="ll-trust-marquee-wrap">
        <PlatformMarqueeTrack iconSize="lg" />
      </div>
    </section>
  );
}
