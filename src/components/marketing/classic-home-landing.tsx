"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { DiscordSupportStrip } from "@/components/marketing/discord-support";
import { Lock, Sparkles, Zap } from "lucide-react";

const stripItems = ["FREE LINKS", "SUB 2 UNLOCK", "70+ PLATFORMS", "RETRO FUN", "FOR CREATORS"];

const words = ["followers", "subs", "fans", "growth"];

export function ClassicHomeLanding() {
  const [word, setWord] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    function onMove(e: MouseEvent) {
      const r = el!.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: px * 10, y: py * 8 });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const items = [...stripItems, ...stripItems];

  return (
    <div className="classic-landing">
      <section ref={heroRef} className="classic-landing-hero">
        <div
          className="classic-landing-float classic-landing-card"
          style={{ transform: `perspective(800px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)` }}
        >
          <p className="classic-kicker classic-bob inline-flex items-center gap-2">
            <Sparkles size={14} aria-hidden />
            Linklock classic
          </p>

          <h1 className="classic-title mt-6">
            One link.
            <br />
            Real{" "}
            <span key={word} className="classic-title-accent classic-word-pop">
              {words[word]}.
            </span>
          </h1>

          <p className="classic-sub mt-5 max-w-md mx-auto text-center">
            Subscribe-to-unlock — playful, fast, built for preset packs, beats, and mods.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <MarketingAuthLink href="/sign-up">
              <span className="classic-cta classic-cta--pulse ui-instant">Start free</span>
            </MarketingAuthLink>
            <Link
              href="/how-it-works"
              className="text-sm font-bold text-retro-text-dim underline underline-offset-4 hover:text-retro-text"
            >
              How it works
            </Link>
          </div>

          <ul className="classic-landing-pills mt-10" aria-label="Highlights">
            <li>
              <Zap size={16} aria-hidden /> Live in minutes
            </li>
            <li>
              <Lock size={16} aria-hidden /> Your unlock steps
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
