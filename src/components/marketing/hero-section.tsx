"use client";

import { BarChart3, Layers, Mail, Zap } from "lucide-react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton, RetroLink } from "@/components/retro";

const HIGHLIGHTS = [
  {
    icon: Layers,
    title: "Control access",
    desc: "Decide exactly who unlocks your files, links, or codes — and when.",
  },
  {
    icon: Mail,
    title: "Fan emails captured",
    desc: "See emails from fans who completed every step on your link.",
  },
  {
    icon: BarChart3,
    title: "Grow with data",
    desc: "Views, unlocks, and conversion in one dashboard built for creators.",
  },
  {
    icon: Zap,
    title: "Live in minutes",
    desc: "Set your steps, share one URL everywhere — no code needed.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "YouTube · 240K subs",
    quote:
      "One link replaced my whole description mess. I can finally see who finished the steps and grab their emails.",
  },
  {
    name: "Marcus Torres",
    role: "Indie dev",
    quote:
      "Beta keys used to leak from our form. Now fans complete two steps and the build opens instantly — way cleaner.",
  },
  {
    name: "James Wilson",
    role: "Beat packs",
    quote:
      "Subscribe for the download still works, but now I collect emails from everyone who completes the link. Game changer.",
  },
];

export function HeroSection() {
  return (
    <section className="ll-hero ll-hero--business relative z-10">
      <div className="ll-hero-grid-bg" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-[1fr_420px] gap-14 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="ll-hero-title ll-hero-title--light">
              Control access to your content
              <br />
              <span className="ll-trust-neon">and grow your audience</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-retro-text-dim leading-relaxed max-w-lg mx-auto lg:mx-0">
              Gate downloads and links behind subscribe, follow, or join steps — then see fan emails from everyone
              who completes your link.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <MarketingAuthLink href="/sign-up" className="inline-block w-full sm:w-auto">
                <RetroButton size="lg" className="w-full sm:min-w-[200px]">
                  Get started
                </RetroButton>
              </MarketingAuthLink>
              <RetroLink href="/pricing" variant="secondary" size="lg" className="w-full sm:w-auto sm:min-w-[160px]">
                View pricing
              </RetroLink>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="ll-demo-wrap ll-demo-wrap--light w-full max-w-[420px]">
              <HeroLiveUnlock size="lg" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BusinessHighlights() {
  return (
    <section className="ll-highlights relative z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="ll-highlight-item ll-app-card p-5">
              <div className="ll-highlight-icon">
                <item.icon size={20} strokeWidth={2} />
              </div>
              <h2 className="text-sm font-semibold text-retro-text mt-4">{item.title}</h2>
              <p className="mt-2 text-xs text-retro-text-dim leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="ll-testimonials relative z-10" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 md:py-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-medium uppercase tracking-wide text-retro-text-muted mb-2">What people say</p>
          <h2 id="testimonials-heading" className="text-xl md:text-2xl font-semibold tracking-tight text-retro-text">
            Creators who switched to one link
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article key={item.name} className="ll-testimonial-card ll-app-card p-5 flex flex-col">
              <blockquote className="flex-1">
                <p className="text-xs text-retro-text-dim leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
              </blockquote>
              <footer className="mt-4 pt-4 border-t border-retro-border">
                <p className="text-sm font-medium text-retro-text">{item.name}</p>
                <p className="text-[11px] text-retro-text-muted mt-0.5">{item.role}</p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingCtaBar() {
  return (
    <section className="ll-landing-cta relative z-10">
      <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="text-lg font-semibold text-retro-text">Start gating content today</p>
          <p className="text-sm text-retro-text-muted mt-1">Free plan includes unlimited links.</p>
        </div>
        <MarketingAuthLink href="/sign-up" className="shrink-0 w-full sm:w-auto">
          <RetroButton size="lg" className="w-full sm:min-w-[160px]">
            Create account
          </RetroButton>
        </MarketingAuthLink>
      </div>
    </section>
  );
}
