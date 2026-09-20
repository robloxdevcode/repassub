import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { DiscordSupportStrip } from "@/components/marketing/discord-support";
import { Lock, Share2, Sparkles } from "lucide-react";

function HeroVisual() {
  return (
    <div className="unlock-v2-card w-full max-w-[360px] p-6 lg:ml-auto">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-retro-accent mb-4">
        <Sparkles size={14} aria-hidden />
        Creator flow
      </div>
      <ul className="space-y-3 text-sm text-retro-text-dim">
        <li className="flex items-center gap-3 rounded-lg border border-retro-border bg-retro-surface-2 px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-retro-glow text-retro-accent font-bold text-xs">
            1
          </span>
          Set your unlock steps
        </li>
        <li className="flex items-center gap-3 rounded-lg border border-retro-border bg-retro-surface-2 px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-retro-glow text-retro-accent font-bold text-xs">
            2
          </span>
          <Share2 size={16} className="text-retro-accent shrink-0" aria-hidden />
          Share one link everywhere
        </li>
        <li className="flex items-center gap-3 rounded-lg border border-retro-border bg-retro-surface-2 px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-retro-glow text-retro-accent font-bold text-xs">
            3
          </span>
          <Lock size={16} className="text-retro-accent shrink-0" aria-hidden />
          Fans unlock your content
        </li>
      </ul>
      <p className="mt-4 text-xs text-retro-text-muted leading-relaxed">
        No demo account needed — sign up free and publish in minutes.
      </p>
    </div>
  );
}

export function HomeLanding() {
  return (
    <div>
      <section className="llv2-hero">
        <div className="llv2-hero-inner">
          <div>
            <p className="llv2-kicker">Linklock</p>
            <h1 className="llv2-title">
              Grow your audience
              <br />
              <span className="llv2-title-accent">one unlock at a time</span>
            </h1>
            <p className="llv2-sub">
              Subscribe-to-unlock links built for creators. Set your steps, share one URL, and turn
              downloads into follows and subs.
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
            <HeroVisual />
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
