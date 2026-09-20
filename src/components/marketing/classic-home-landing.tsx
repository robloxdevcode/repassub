"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, Share2, Sparkles } from "lucide-react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { DiscordSupportStrip } from "@/components/marketing/discord-support";
import { RetroWindow } from "@/components/retro/memphis-ui";

const stripItems = [
  "★ FREE LINKS",
  "★ SUB TO UNLOCK",
  "★ 70+ PLATFORMS",
  "★ REAL STATS",
  "★ CLASSIC VIBES",
  "★ MADE FOR CREATORS",
];

const accentWords = ["followers.", "subs.", "fans.", "growth."];

function HeroDemo() {
  return (
    <RetroWindow title="UNLOCK.EXE — demo" headerColor="purple">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-retro-blue-dim mb-4">
        <Sparkles size={14} aria-hidden className="classic-bob" />
        How it feels
      </div>
      <ul className="space-y-3">
        <li className="classic-step">
          <span className="classic-step-num">1</span>
          Pick your unlock steps
        </li>
        <li className="classic-step">
          <span className="classic-step-num">2</span>
          <Share2 size={16} className="shrink-0" aria-hidden />
          Share one link everywhere
        </li>
        <li className="classic-step">
          <span className="classic-step-num">3</span>
          <Lock size={16} className="shrink-0" aria-hidden />
          They unlock your file
        </li>
      </ul>
      <p className="mt-4 text-xs text-retro-text-muted leading-relaxed">
        Sign up free — publish in minutes. No card.
      </p>
    </RetroWindow>
  );
}

export function ClassicHomeLanding() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % accentWords.length), 2400);
    return () => clearInterval(id);
  }, []);

  const items = [...stripItems, ...stripItems];

  return (
    <div>
      <section className="classic-hero">
        <div className="classic-hero-inner">
          <div>
            <p className="classic-kicker">Linklock classic · retro fun</p>
            <h1 className="classic-title">
              Turn downloads into real{" "}
              <span key={wordIndex} className="classic-title-accent classic-bob">
                {accentWords[wordIndex]}
              </span>
            </h1>
            <p className="classic-sub">
              Subscribe-to-unlock links with playful retro style. Set your steps, share one URL, grow
              your audience — preset packs, beats, mods, whatever you ship.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <MarketingAuthLink href="/sign-up">
                <span className="classic-cta ui-instant">Start free — let&apos;s go</span>
              </MarketingAuthLink>
              <p className="text-sm text-retro-text-muted font-semibold">
                <Link href="/sign-in" className="underline underline-offset-4 hover:text-retro-text">
                  Sign in
                </Link>
                <span className="mx-2 opacity-40">·</span>
                <Link href="/pricing" className="underline underline-offset-4 hover:text-retro-text">
                  Pricing
                </Link>
              </p>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end classic-bob">
            <HeroDemo />
          </div>
        </div>
      </section>

      <div className="classic-strip" aria-hidden>
        <div className="classic-strip-track">
          <div className="classic-strip-group">
            {items.map((item, i) => (
              <span key={`${item}-${i}`}>{item}</span>
            ))}
          </div>
          <div className="classic-strip-group" aria-hidden>
            {items.map((item, i) => (
              <span key={`dup-${item}-${i}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="ll-section ll-section--muted border-b-[3px] border-[#0a0a0a]">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-display text-[0.5625rem] md:text-xs text-retro-text mb-4">
            SIMPLE. FAST. RETRO.
          </h2>
          <p className="text-retro-text-dim leading-relaxed">
            One link, your rules — YouTube sub, Discord join, Instagram follow, custom visits. Fans
            complete steps; you get growth. Pro removes ads and adds your branding.
          </p>
        </div>
      </section>

      <DiscordSupportStrip />
    </div>
  );
}
