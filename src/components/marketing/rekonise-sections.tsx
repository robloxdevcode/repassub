"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  Link2,
  Mail,
  Share2,
  Sparkles,
  Timer,
  UserPlus,
} from "lucide-react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote:
      "I gate every beat pack behind a YouTube sub now. Views stayed the same but subs actually moved — that's the whole point.",
    name: "Marcus T.",
    handle: "@marcusbeats",
    stat: "12K+ unlocks",
  },
  {
    quote:
      "Discord grew faster once I stopped dropping files in DMs. One link, they join, they get the ZIP. Simple.",
    name: "Jade R.",
    handle: "@jade_mods",
    stat: "8K+ joins",
  },
  {
    quote:
      "Stats show which links convert. I doubled down on TikTok follow gates and cut the steps that nobody finished.",
    name: "Devon K.",
    handle: "@devoncreates",
    stat: "41% conversion",
  },
];

const BENTO = [
  {
    icon: Share2,
    title: "Social actions",
    desc: "Subscribe, follow, join — pick what fans do before they unlock.",
    tone: "ll-bento-icon--blue",
  },
  {
    icon: BarChart3,
    title: "Live analytics",
    desc: "Views, unlocks, and conversion rate for every link.",
    tone: "ll-bento-icon--red",
  },
  {
    icon: Mail,
    title: "Audience list",
    desc: "Collect emails when people unlock and export your list.",
    tone: "ll-bento-icon--green",
  },
  {
    icon: Sparkles,
    title: "70+ platforms",
    desc: "YouTube, TikTok, Instagram, Discord, X, Spotify, and more.",
    tone: "ll-bento-icon--yellow",
  },
  {
    icon: Link2,
    title: "Clean URLs",
    desc: "Branded links your fans recognize and trust.",
    tone: "ll-bento-icon--blue",
  },
  {
    icon: Timer,
    title: "Pro branding",
    desc: "Your logo and colors on unlock pages — no ads.",
    tone: "ll-bento-icon--red",
  },
];

function SocialActionsMock() {
  const rows = [
    { label: "Subscribe on YouTube", tone: "bg-[#fee2e2] text-[#991b1b]" },
    { label: "Join Discord server", tone: "bg-[#e0e7ff] text-[#3730a3]" },
    { label: "Follow on Instagram", tone: "bg-[#fce7f3] text-[#9d174d]" },
  ];

  return (
    <div className="ll-mock-panel">
      <p className="ll-mock-label">Unlock preview</p>
      <div className="space-y-2.5 mt-4">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium border border-black/5",
              row.tone,
              i === 1 && "ring-2 ring-indigo-500/30"
            )}
          >
            <UserPlus size={16} />
            {row.label}
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between text-xs text-retro-text-muted">
        <span>Progress</span>
        <span className="font-semibold text-retro-text">1/3</span>
      </div>
      <div className="ll-mock-progress mt-2">
        <div className="ll-mock-progress-fill" style={{ width: "33%" }} />
      </div>
    </div>
  );
}

function AnalyticsMock() {
  const bars = [38, 62, 48, 78, 55, 92, 70];
  return (
    <div className="ll-mock-panel">
      <p className="ll-mock-label">This week</p>
      <div className="grid grid-cols-3 gap-3 mt-4 mb-6">
        {[
          { label: "Unlocks", value: "247" },
          { label: "Views", value: "1.2K" },
          { label: "Conv.", value: "18%" },
        ].map((s) => (
          <div key={s.label} className="ll-mock-stat">
            <p className="text-lg font-bold text-retro-text tabular-nums">{s.value}</p>
            <p className="text-[11px] text-retro-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1.5 h-24 px-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-indigo-500/80 transition-all"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureSplit({
  eyebrow,
  title,
  description,
  reverse,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  reverse?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="ll-section">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div
          className={cn(
            "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center",
            reverse && "lg:[&>*:first-child]:order-2"
          )}
        >
          <div>
            <p className="ll-label">{eyebrow}</p>
            <h2 className="ll-section-title mt-3">{title}</h2>
            <p className="mt-4 text-retro-text-dim leading-relaxed max-w-md">{description}</p>
            <MarketingAuthLink href="/sign-up" className="inline-block mt-8">
              <RetroButton>Get started free</RetroButton>
            </MarketingAuthLink>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  return (
    <section className="ll-trust-strip" aria-label="Social proof">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <p className="text-center text-sm md:text-base text-retro-text-dim max-w-2xl mx-auto leading-relaxed">
          Built for <strong className="text-retro-text font-semibold">YouTube, TikTok, Instagram & Discord</strong>{" "}
          creators who want followers before the download drops.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-retro-text-muted">
          <span className="inline-flex items-center gap-2 text-[#ff0000]">● YouTube</span>
          <span>TikTok</span>
          <span>Instagram</span>
          <span className="text-[#5865f2]">Discord</span>
          <span>X</span>
          <span className="text-[#1db954]">Spotify</span>
        </div>
      </div>
    </section>
  );
}

export function SocialGrowthSection() {
  return (
    <FeatureSplit
      eyebrow="Social actions"
      title="Grow while people unlock"
      description="Pick the actions fans complete — subscribe, join, follow — then your file or link unlocks automatically. No account needed for them."
    >
      <SocialActionsMock />
    </FeatureSplit>
  );
}

export function AnalyticsGrowthSection() {
  return (
    <FeatureSplit
      reverse
      eyebrow="Audience insights"
      title="See what's working"
      description="Track views, unlocks, and conversion on every link. Know which posts and platforms actually grow your audience."
    >
      <AnalyticsMock />
    </FeatureSplit>
  );
}

export function FeaturesGridSection() {
  return (
    <section className="ll-section ll-section--muted">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-2xl mb-12">
          <p className="ll-label">Everything in one place</p>
          <h2 className="ll-section-title mt-3">Made for social growth</h2>
          <p className="mt-4 text-retro-text-dim leading-relaxed">
            Gate content, track performance, and keep fans moving — without juggling five different tools.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENTO.map((item) => (
            <article key={item.title} className="ll-bento-card h-full">
              <div className={cn("ll-bento-icon mb-4", item.tone)}>
                <item.icon size={20} />
              </div>
              <h3 className="font-semibold text-base mb-2">{item.title}</h3>
              <p className="text-sm text-retro-text-dim leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/features" prefetch className="text-sm font-medium text-retro-accent hover:underline">
            See all features →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="ll-section">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="ll-label">Creators</p>
        <h2 className="ll-section-title mt-3 mb-10">Trusted by people who post for a living</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <article key={t.handle} className="ll-testimonial">
              <p className="text-sm text-retro-text-dim leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 pt-4 border-t border-retro-border flex items-end justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-retro-text">{t.name}</p>
                  <p className="text-xs text-retro-text-muted mt-0.5">{t.handle}</p>
                </div>
                <span className="text-xs font-semibold text-retro-accent shrink-0">{t.stat}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
