"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { DiscordSupportStrip } from "@/components/marketing/discord-support";
import { ArrowRight, Check } from "lucide-react";

const steps = [
  "Pick your unlock steps",
  "Share one link everywhere",
  "Fans unlock — you grow",
];

export function ClassicHomeLanding() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="home-landing">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-hero-tag">Subscribe-to-unlock · free to start</p>
            <h1 className="home-hero-title">
              Turn every download into{" "}
              <span className="home-hero-title-line">real growth.</span>
            </h1>
            <p className="home-hero-lead">
              One link for YouTube subs, Discord joins, follows, and more. Built for preset packs, beats,
              mods, and creators who hate sketchy gate sites.
            </p>

            <div className="home-hero-actions">
              <MarketingAuthLink href="/sign-up">
                <span className="home-hero-cta">
                  Create your link — free
                  <ArrowRight size={18} aria-hidden />
                </span>
              </MarketingAuthLink>
              <Link href="/pricing" className="home-hero-secondary">
                See pricing
              </Link>
            </div>

            <ul className="home-hero-checklist">
              {["Unlimited links on Free", "Live stats", "Retro-fast setup"].map((item) => (
                <li key={item}>
                  <Check size={16} strokeWidth={3} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="home-hero-visual" aria-hidden>
            <div className="home-hero-orbit home-hero-orbit--a" />
            <div className="home-hero-orbit home-hero-orbit--b" />
            <div className="home-hero-demo">
              <div className="home-hero-demo-bar">
                <span className="home-hero-demo-dot bg-[#fb7185]" />
                <span className="home-hero-demo-dot bg-[#ffe566]" />
                <span className="home-hero-demo-dot bg-[#5eead4]" />
                <span className="home-hero-demo-label font-display text-[0.4375rem] md:text-[0.5rem] uppercase">
                  unlock.flow
                </span>
              </div>
              <div className="home-hero-demo-body">
                <p className="home-hero-demo-kicker font-display text-[0.5rem] uppercase text-retro-text-muted">
                  Step {step + 1} of 3
                </p>
                <p key={step} className="home-hero-demo-step">
                  {steps[step]}
                </p>
                <div className="home-hero-demo-progress">
                  <span
                    className="home-hero-demo-progress-fill"
                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  />
                </div>
                <div className="home-hero-demo-fake-btn">Unlock content</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-proof">
        <div className="home-proof-inner">
          <span>TikTok</span>
          <span>YouTube</span>
          <span>Discord</span>
          <span>Instagram</span>
          <span>70+ platforms</span>
        </div>
      </section>

      <DiscordSupportStrip />
    </div>
  );
}
