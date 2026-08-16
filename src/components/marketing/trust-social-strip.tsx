"use client";

import { MARKETING_PLATFORMS, PlatformBrandIcon } from "@/components/marketing/platform-brand-icon";

const EXTRA_PLATFORMS = [
  { id: "facebook", name: "Facebook" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "reddit", name: "Reddit" },
  { id: "kick", name: "Kick" },
] as const;

const MARQUEE_ITEMS = [...MARKETING_PLATFORMS, ...EXTRA_PLATFORMS, ...MARKETING_PLATFORMS];

export function TrustSocialStrip() {
  return (
    <section className="ll-trust-strip" aria-label="Trusted by creators worldwide">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-12 text-center">
        <p className="ll-trust-strip-text">
          Trusted by <span className="ll-trust-neon">95K+ creators</span> who gained{" "}
          <span className="ll-trust-neon">647M+</span> followers
        </p>
      </div>
      <div className="ll-trust-marquee-wrap" aria-hidden>
        <div className="ll-trust-marquee-track">
          {MARQUEE_ITEMS.map((p, i) => (
            <span key={`${p.id}-${i}`} className="ll-trust-marquee-item">
              <PlatformBrandIcon platform={p.id} size="md" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
