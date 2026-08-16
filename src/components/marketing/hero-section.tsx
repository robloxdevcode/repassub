"use client";

import { useEffect, useState } from "react";
import { BarChart3, Layers, Zap } from "lucide-react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { RetroButton, RetroLink } from "@/components/retro";

const HIGHLIGHTS = [
  {
    icon: Layers,
    title: "Action gating",
    desc: "Set the steps required before a download or link unlocks.",
  },
  {
    icon: BarChart3,
    title: "Built-in analytics",
    desc: "Views, unlocks, and conversion — all in one dashboard.",
  },
  {
    icon: Zap,
    title: "Live in minutes",
    desc: "Upload, configure, share. No code or complex setup.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "YouTube creator · 240K subs",
    quote:
      "I had been sending people to three different links in every video description — one for the Discord, one for the download, one for the newsletter — and I still got DMs every day asking where the file was. Linklock replaced all of that with a single page that actually looks professional. I set subscribe plus join server as the steps, dropped the link in my pinned comment, and within the first week my unlock rate went from basically guessing to something I could see in the dashboard. The best part is I did not have to rebuild my whole site or pay a developer. I typed what I wanted to share, picked the actions, and it was live in under ten minutes. My audience does not complain about extra steps anymore because the page is clean and fast on mobile, which is where almost all of my traffic comes from anyway.",
  },
  {
    name: "Marcus Torres",
    role: "Indie game dev",
    quote:
      "We used to gate our beta builds behind a Google Form and manually email keys — it was slow, easy to mess up, and people leaked the files anyway. Switching to Linklock meant fans complete two quick steps and the download opens right there, no waiting for us to approve anything. Conversion on our last launch was night and day compared to the form: more people finished the flow, fewer support tickets, and we finally had numbers that matched what we saw in analytics instead of guessing from form submissions. The dashboard feels like the rest of the product, same colors, same calm layout, so our team actually checks stats instead of ignoring another tool. We upgraded to Pro for the extra steps and branding because the free plan already proved it worked; hiding the Linklock badge and matching our colors made it feel like part of our site, not a third-party patch.",
  },
  {
    name: "James Wilson",
    role: "Digital products shop",
    quote:
      "I sell preset packs and sample kits, and for years I tried paywalls, Gumroad freebies, and ‘follow for link in bio’ hacks that never converted consistently. Linklock is the first thing that felt fair to customers and still grew my lists — they do a subscribe or follow, they get the file immediately, and I sleep knowing the link is not sitting public in a Discord channel. Setup is boring in the best way: upload your asset link, choose platforms, share one URL everywhere. I run EUR pricing on the billing page and the whole checkout flow matches what I expect from a modern SaaS app, not a random landing page with toggles everywhere. What sold me long term was reading the unlock analytics after a campaign and seeing exactly which step people dropped off on, so I could fix the page instead of blaming the algorithm. I have recommended it to two other sellers in my niche and both stuck with it after the first weekend.",
  },
];

export function HeroSection() {
  return (
    <section className="ll-hero ll-hero--business">
      <div className="ll-hero-grid-bg" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-[1fr_420px] gap-14 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="ll-hero-title ll-hero-title--light">
              Share a link.
              <br />
              <span className="text-retro-accent">Unlock on completion.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-retro-text-dim leading-relaxed max-w-lg mx-auto lg:mx-0">
              Gate files and links behind simple actions. Visitors finish the steps — your content opens. Free to
              start.
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
            <p className="mt-5 text-sm text-retro-text-muted">No credit card required</p>
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
    <section className="ll-highlights">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="ll-highlight-item ll-app-card p-6">
              <div className="ll-highlight-icon">
                <item.icon size={20} strokeWidth={2} />
              </div>
              <h2 className="text-base font-semibold text-retro-text mt-4">{item.title}</h2>
              <p className="mt-2 text-sm text-retro-text-dim leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="ll-testimonials" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-xs font-medium uppercase tracking-wide text-retro-text-muted mb-3">What people say</p>
          <h2 id="testimonials-heading" className="text-2xl md:text-3xl font-semibold tracking-tight text-retro-text">
            Trusted by creators and teams
          </h2>
          <p className="mt-4 text-retro-text-dim leading-relaxed">
            Real feedback from people using Linklock every day — in their own words.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article key={item.name} className="ll-testimonial-card ll-app-card p-6 md:p-7 flex flex-col">
              <blockquote className="flex-1">
                <p className="ll-testimonial-quote text-sm md:text-[0.9375rem] text-retro-text-dim leading-[1.75]">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </blockquote>
              <footer className="mt-6 pt-5 border-t border-retro-border">
                <p className="font-semibold text-retro-text">{item.name}</p>
                <p className="text-xs text-retro-text-muted mt-1">{item.role}</p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlatformCountStrip() {
  const [count, setCount] = useState(0);
  const target = 80;

  useEffect(() => {
    let frame = 0;
    let start = 0;
    const duration = 1400;

    const tick = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="ll-platform-count ll-platform-count--business" aria-label="Integrations">
      <p className="ll-platform-count-value">
        <span className="tabular-nums">{count}</span>+ integrations supported
      </p>
    </section>
  );
}

export function LandingCtaBar() {
  return (
    <section className="ll-landing-cta">
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
