"use client";

import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton, RetroLink } from "@/components/retro";
import { Play, MessageCircle, Music2, Share2 } from "lucide-react";

const PLATFORMS = [
  { icon: Play, label: "YouTube", color: "#ff0000" },
  { icon: MessageCircle, label: "Discord", color: "#5865f2" },
  { icon: Music2, label: "Spotify", color: "#1db954" },
  { icon: Share2, label: "Instagram", color: "#e1306c" },
];

export function HeroSection() {
  return (
    <section className="ll-hero">
      <div className="ll-hero-glow ll-hero-glow--1" aria-hidden />
      <div className="ll-hero-glow ll-hero-glow--2" aria-hidden />
      <div className="ll-hero-grid" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
          <div className="text-center lg:text-left">
            <span className="ll-pill">Unlock links for creators</span>
            <h1 className="ll-hero-title mt-6">
              Gate downloads.
              <br />
              <span className="ll-gradient-text">Grow your audience.</span>
            </h1>
            <p className="mt-6 text-lg text-white/65 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Fans complete subscribe, join, or follow steps — then your file unlocks.
              No account needed for them.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <MarketingAuthLink href="/sign-up" className="inline-block w-full sm:w-auto">
                <RetroButton size="lg" className="w-full sm:min-w-[200px] ll-btn-glow">
                  Get started free
                </RetroButton>
              </MarketingAuthLink>
              <RetroLink href="/#pricing" variant="ghost" size="lg" className="ll-hero-ghost w-full sm:w-auto">
                See pricing
              </RetroLink>
            </div>
            <p className="mt-5 text-sm text-white/40">
              Unlimited links · 4 steps on Free · No card
            </p>

            <div className="mt-10 flex flex-wrap gap-2 justify-center lg:justify-start">
              {PLATFORMS.map(({ icon: Icon, label, color }) => (
                <span key={label} className="ll-platform-chip">
                  <Icon size={14} style={{ color }} />
                  {label}
                </span>
              ))}
              <span className="ll-platform-chip ll-platform-chip--muted">+70 more</span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="ll-demo-wrap">
              <HeroLiveUnlock size="lg" className="w-full max-w-[380px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
