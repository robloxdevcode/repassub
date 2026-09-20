import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { DiscordSupportStrip } from "@/components/marketing/discord-support";
export function HomeLanding() {
  return (
    <div>
      <section className="llv2-hero">
        <div className="llv2-hero-inner">
          <div>
            <p className="llv2-kicker">Linklock</p>
            <h1 className="llv2-title">
              Build your audience
              <br />
              <span className="llv2-title-accent">one unlock at a time</span>
            </h1>
            <p className="llv2-sub">
              Subscribe-to-unlock links with a fast, focused flow. Fans finish your steps once; you
              grow on every share.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <MarketingAuthLink href="/sign-up">
                <span className="llv2-cta ui-instant">Start free — no card</span>
              </MarketingAuthLink>
              <p className="text-sm text-retro-text-muted">
                <Link href="/sign-in" className="llv2-meta-link">
                  Sign in
                </Link>
                <span className="mx-2 opacity-40">/</span>
                <Link href="/pricing" className="llv2-meta-link">
                  Pricing
                </Link>
              </p>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HeroLiveUnlock size="lg" className="w-full max-w-[360px] unlock-v2-card p-1" />
          </div>
        </div>
      </section>
      <section className="llv2-strip" aria-label="How it works">
        <div className="llv2-strip-inner">
          <span>Create</span>
          <span>Set steps</span>
          <span>Share one link</span>
          <span>70+ platforms</span>
        </div>
      </section>
      <DiscordSupportStrip />
    </div>
  );
}
