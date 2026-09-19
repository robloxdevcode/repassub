"use client";

import Link from "next/link";
import { HeroSection } from "@/components/marketing/hero-section";
import { PlatformMarquee } from "@/components/marketing/home-sections";
import { AnimatedDotBackground } from "@/components/marketing/animated-dot-background";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";

const STEPS = [
  { n: "1", title: "Add content", desc: "File or link" },
  { n: "2", title: "Pick steps", desc: "Sub, follow, join" },
  { n: "3", title: "Share", desc: "One bio link" },
];

export function HomeLanding() {
  return (
    <div className="rk-home">
      <div className="rk-home-bg" aria-hidden>
        <AnimatedDotBackground variant="light" connectLines density={0.9} />
        <div className="rk-hero-blob rk-hero-blob--orange rk-home-bg-blob" />
        <div className="rk-hero-blob rk-hero-blob--green rk-home-bg-blob" />
        <div className="rk-hero-grid rk-home-bg-grid" />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <PlatformMarquee />

        <section className="rk-home-steps" aria-label="How it works">
          <ol className="rk-home-steps-list">
            {STEPS.map((s) => (
              <li key={s.n} className="rk-home-step">
                <span className="rk-home-step-num">{s.n}</span>
                <span className="rk-home-step-title">{s.title}</span>
                <span className="rk-home-step-desc">{s.desc}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rk-home-cta">
          <p className="rk-home-cta-text">Ready? Free unlimited links.</p>
          <div className="rk-home-cta-row">
            <MarketingAuthLink href="/sign-up">
              <span className="rk-btn rk-btn--primary">Get started free</span>
            </MarketingAuthLink>
            <Link href="/pricing" className="rk-btn rk-btn--secondary">
              Pricing
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
