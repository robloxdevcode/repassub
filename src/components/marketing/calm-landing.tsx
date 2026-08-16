"use client";

import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton } from "@/components/retro";

export function CalmLanding() {
  return (
    <div className="ll-calm-landing">
      <section className="ll-calm-hero">
        <div className="mx-auto max-w-2xl px-4 pt-16 pb-10 md:pt-24 md:pb-14 text-center">
          <h1 className="ll-calm-title">
            Content that unlocks
            <br className="hidden sm:block" />
            when the steps are done
          </h1>
          <p className="ll-calm-lead mt-5">
            Share one link. Set what visitors need to do first. Your file or URL opens when they&apos;re finished.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3">
            <MarketingAuthLink href="/sign-up" className="w-full sm:w-auto">
              <RetroButton size="lg" className="ll-calm-cta w-full sm:min-w-[200px]">
                Get started — it&apos;s free
              </RetroButton>
            </MarketingAuthLink>
            <Link href="/pricing" className="text-sm text-retro-text-muted hover:text-retro-text transition-colors">
              See pricing
            </Link>
          </div>

          <ul className="ll-calm-trust mt-10" aria-label="Trust highlights">
            <li>Free plan available</li>
            <li>Secure checkout</li>
            <li>Set up in minutes</li>
          </ul>
        </div>

        <div className="mx-auto max-w-md px-4 pb-16 md:pb-24">
          <HeroLiveUnlock size="lg" className="w-full" calm />
        </div>

        <p className="ll-calm-footnote pb-16 text-center">
          Works with <span className="font-medium text-retro-text">80+ integrations</span>
        </p>
      </section>
    </div>
  );
}
