"use client";

import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";

const steps = [
  { title: "Create", desc: "Add your file or link" },
  { title: "Gate", desc: "Pick subscribe, follow, or join steps" },
  { title: "Share", desc: "One URL for your bio" },
];

export function HomeLanding() {
  return (
    <div className="pro-home">
      <section className="pro-home-hero" aria-labelledby="pro-home-title">
        <div className="pro-home-grid">
          <div className="pro-home-copy">
            <p className="pro-home-eyebrow">For creators</p>
            <h1 id="pro-home-title" className="pro-home-title">
              Subscribe-to-unlock links that are easy to read and easy to share
            </h1>
            <p className="pro-home-lede">
              Linklock gives you a clean unlock page fans understand in seconds. No account required
              for them. Free to start.
            </p>
            <div className="pro-home-cta-row">
              <MarketingAuthLink href="/sign-up">
                <span className="pro-btn pro-btn--primary">Get started — free</span>
              </MarketingAuthLink>
              <Link href="/sign-in" className="pro-btn pro-btn--secondary">
                Sign in
              </Link>
            </div>
          </div>
          <div className="pro-home-demo">
            <HeroLiveUnlock size="lg" className="pro-demo-card w-full max-w-[380px]" />
          </div>
        </div>

        <ul className="pro-home-steps" aria-label="How it works">
          {steps.map((step) => (
            <li key={step.title} className="pro-home-step">
              <span className="pro-home-step-title">{step.title}</span>
              <span className="pro-home-step-desc">{step.desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
