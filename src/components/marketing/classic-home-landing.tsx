"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { DiscordSupportStrip } from "@/components/marketing/discord-support";
import { Lock, Sparkles, Zap } from "lucide-react";

const stripItems = ["FREE LINKS", "SUB 2 UNLOCK", "70+ PLATFORMS", "RETRO FUN", "FOR CREATORS"];

const words = ["followers", "subs", "fans", "growth"];

export function ClassicHomeLanding() {
  const [word, setWord] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, []);

  const items = [...stripItems, ...stripItems];

  return (
    <div className="classic-landing">
      <section className="classic-landing-hero classic-landing-hero--fullscreen">
        <div className="classic-landing-hero-content">
          <p className="classic-kicker classic-bob inline-flex items-center gap-2">
            <Sparkles size={14} aria-hidden />
            Linklock classic
          </p>

          <h1 className="classic-landing-headline mt-8">
            One link.
            <br />
            Real{" "}
            <span key={word} className="classic-title-accent classic-word-pop">
              {words[word]}.
            </span>
          </h1>

          <p className="classic-landing-lead mt-6">
            Subscribe-to-unlock — playful, fast, built for preset packs, beats, and mods.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <MarketingAuthLink href="/sign-up">
              <span className="classic-cta classic-cta--pulse ui-instant text-base px-8 min-h-[56px]">
                Start free
              </span>
            </MarketingAuthLink>
            <Link
              href="/how-it-works"
              className="text-sm font-bold text-retro-text-dim underline underline-offset-4 hover:text-retro-text"
            >
              How it works
            </Link>
          </div>

          <ul className="classic-landing-pills mt-12" aria-label="Highlights">
            <li>
              <Zap size={18} aria-hidden /> Live in minutes
            </li>
            <li>
              <Lock size={18} aria-hidden /> Your unlock steps
            </li>
          </ul>
        </div>
      </section>

      <div className="classic-strip" aria-hidden>
        <div className="classic-strip-track">
          <div className="classic-strip-group">
            {items.map((item, i) => (
              <span key={`${item}-${i}`}>★ {item}</span>
            ))}
          </div>
          <div className="classic-strip-group">
            {items.map((item, i) => (
              <span key={`dup-${item}-${i}`}>★ {item}</span>
            ))}
          </div>
        </div>
      </div>

      <DiscordSupportStrip />
    </div>
  );
}
