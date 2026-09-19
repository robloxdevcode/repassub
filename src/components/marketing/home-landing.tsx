"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";

export function HomeLanding() {
  return (
    <div className="min-land">
      <section className="min-land-hero">
        <div className="min-land-glow min-land-glow--lavender" aria-hidden />
        <div className="min-land-glow min-land-glow--sky" aria-hidden />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-14 md:pt-20 md:pb-20 relative">
          <div className="grid lg:grid-cols-[1fr_380px] gap-14 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <motion.p
                className="min-land-kicker"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                Subscribe-to-download platform
              </motion.p>

              <motion.h1
                className="min-land-title min-land-title--pro"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
              >
                Turn downloads into{" "}
                <span className="min-land-accent">audience growth</span>
              </motion.h1>

              <motion.p
                className="min-land-sub min-land-sub--pro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                Gate files and links behind subscribe, follow, or join actions. Fans complete the
                steps once — you keep the growth, they get the content.
              </motion.p>

              <motion.div
                className="mt-9"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.14 }}
              >
                <MarketingAuthLink href="/sign-up" className="inline-block">
                  <span className="min-land-cta">Get started — it&apos;s free</span>
                </MarketingAuthLink>
                <p className="mt-4 text-sm text-retro-text-muted">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="min-land-text-link">
                    Sign in
                  </Link>
                  <span className="mx-2 text-retro-border">·</span>
                  <Link href="/pricing" className="min-land-text-link">
                    Pricing
                  </Link>
                </p>
              </motion.div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <HeroLiveUnlock size="lg" className="w-full max-w-[380px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="min-land-strip" aria-label="How it works">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
          <p className="min-land-strip-text">
            <span>Upload content</span>
            <span className="min-land-strip-dot" aria-hidden />
            <span>Set unlock steps</span>
            <span className="min-land-strip-dot" aria-hidden />
            <span>Share one link</span>
            <span className="min-land-strip-dot min-land-strip-dot--hide-sm" aria-hidden />
            <span className="min-land-strip-muted">70+ platforms supported</span>
          </p>
        </div>
      </section>
    </div>
  );
}
