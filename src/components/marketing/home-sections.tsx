"use client";

import Link from "next/link";
import {
  Check,
  Link2,
  MessageCircle,
  MousePointerClick,
  Music2,
  Play,
  Share2,
  Sparkles,
  Timer,
  Wallet,
} from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";
import { useCurrency } from "@/components/providers/currency-provider";

export { HeroSection } from "@/components/marketing/hero-section";

const STEPS = [
  {
    n: "01",
    title: "Paste your link",
    desc: "Drive, Dropbox, or any URL you already host.",
    color: "bg-pop-red text-white",
    icon: Link2,
  },
  {
    n: "02",
    title: "Pick the steps",
    desc: "Subscribe, follow, join Discord — 2 free, 4 on Pro.",
    color: "bg-pop-blue text-white",
    icon: MousePointerClick,
  },
  {
    n: "03",
    title: "Share once",
    desc: "Bio, video description, Discord — one link everywhere.",
    color: "bg-pop-yellow text-retro-ink",
    icon: Share2,
  },
];

const PLATFORMS = [
  {
    name: "YouTube",
    hook: "Sub + like + bell",
    desc: "Turn viewers into subscribers before they grab your preset.",
    icon: Play,
    card: "home-platform-red",
    btn: "platform-youtube",
  },
  {
    name: "Discord",
    hook: "Join your server",
    desc: "Gate downloads behind a join — grow your community fast.",
    icon: MessageCircle,
    card: "home-platform-blue",
    btn: "platform-discord",
  },
  {
    name: "Spotify",
    hook: "Follow + save",
    desc: "Pack drops for fans who actually follow your artist page.",
    icon: Music2,
    card: "home-platform-yellow",
    btn: "platform-spotify",
  },
];

const WINS = [
  {
    title: "No ad circus",
    desc: "Clean unlock pages. Pro kills ads completely.",
    icon: Sparkles,
    bg: "bg-pop-red text-white",
  },
  {
    title: "Cheaper Pro",
    desc: "Yearly plan beats Rekonise on price — by a lot.",
    icon: Wallet,
    bg: "bg-pop-yellow text-retro-ink",
  },
  {
    title: "~2 min setup",
    desc: "Paste link, pick steps, share. Not a 20-click maze.",
    icon: Timer,
    bg: "bg-pop-blue text-white",
  },
  {
    title: "Creator-first",
    desc: "Built for subscribe-to-download — not generic short links.",
    icon: Check,
    bg: "bg-retro-surface brutal-border",
  },
];

const TESTIMONIALS = [
  {
    quote: "Switched from Rekonise — way less ad spam and my subs actually went up.",
    who: "Preset creator",
  },
  {
    quote: "Took me ninety seconds to publish my first pack link. Not joking.",
    who: "Roblox dev",
  },
  {
    quote: "The live unlock preview sold me. Fans know exactly what to tap.",
    who: "YouTube editor",
  },
];

export function StepsSection() {
  return (
    <section className="section-y bg-retro-bg border-b-[3px] border-retro-ink relative overflow-hidden">
      <span className="hp-deco hp-deco-square hp-deco-steps" aria-hidden />

      <div className="mx-auto max-w-6xl px-4 relative">
        <Reveal>
          <div className="mb-10 md:mb-12 max-w-xl">
            <p className="font-display text-[8px] text-retro-accent tracking-[0.2em] mb-3">HOW IT WORKS</p>
            <h2 className="section-title font-body">
              Three steps.
              <span className="text-retro-accent"> Two minutes.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 80}>
              <article
                className={`step-card ${step.color} brutal-border brutal-shadow p-6 md:p-7 h-full hover-lift ${i === 1 ? "md:-translate-y-2" : ""}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-[10px] opacity-80">{step.n}</span>
                  <step.icon size={22} strokeWidth={2.5} />
                </div>
                <h3 className="font-body text-xl font-bold mb-2">{step.title}</h3>
                <p className="font-body text-sm opacity-90 leading-relaxed">{step.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlatformsSection() {
  return (
    <section className="section-y home-platforms border-b-[3px] border-retro-ink">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="mb-10 md:mb-12 max-w-2xl">
            <p className="font-display text-[8px] text-retro-accent tracking-[0.2em] mb-3">PLATFORMS</p>
            <h2 className="section-title font-body">Steps that look like the real app</h2>
            <p className="mt-4 font-body text-retro-text-dim leading-relaxed">
              Platform-colored buttons your fans already recognize — not generic gray boxes.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {PLATFORMS.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}>
              <article className={`home-platform-card ${p.card} hover-lift`}>
                <div className="home-platform-icon mb-5">
                  <p.icon size={20} />
                </div>
                <p className="font-display text-[8px] text-retro-accent mb-2">{p.hook.toUpperCase()}</p>
                <h3 className="font-body text-xl font-bold mb-2">{p.name}</h3>
                <p className="font-body text-sm text-retro-text-dim leading-relaxed mb-6">{p.desc}</p>
                <div className={`platform-btn ${p.btn} !py-2 !px-3 !text-xs pointer-events-none`}>
                  <p.icon size={14} />
                  <span>Example step</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WinsSection() {
  const { labels, discountPercent } = useCurrency();

  return (
    <section className="section-y bg-retro-surface-2 border-b-[3px] border-retro-ink">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="mb-10 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-display text-[8px] text-retro-accent tracking-[0.2em] mb-3">WHY LINKLOCK</p>
              <h2 className="section-title font-body">Better than the old tools</h2>
            </div>
            <p className="font-body text-sm font-bold text-retro-blue md:text-right">
              Pro from {labels.yearly} · {discountPercent}% off
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {WINS.map((win, i) => (
            <Reveal key={win.title} delay={i * 60}>
              <article
                className={`${win.bg} brutal-border brutal-shadow p-6 md:p-7 hover-lift flex gap-4 ${i % 2 === 1 ? "sm:translate-x-2" : ""}`}
              >
                <div className="home-step-icon shrink-0">
                  <win.icon size={20} />
                </div>
                <div>
                  <h3 className="font-body text-lg font-bold mb-1">{win.title}</h3>
                  <p className="font-body text-sm opacity-90 leading-relaxed">{win.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="section-y bg-pop-blue text-white border-b-[3px] border-retro-ink relative overflow-hidden">
      <div className="marketing-grain pointer-events-none opacity-30" aria-hidden />

      <div className="mx-auto max-w-6xl px-4 relative">
        <Reveal>
          <p className="font-display text-[8px] text-retro-yellow tracking-[0.2em] mb-3">CREATORS</p>
          <h2 className="section-title font-body text-white mb-10 max-w-lg">People actually switch to this</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.who} delay={i * 80}>
              <blockquote
                className={`bg-retro-surface text-retro-ink brutal-border brutal-shadow p-6 md:p-7 hover-lift ${i === 1 ? "md:-rotate-1" : i === 2 ? "md:rotate-1" : ""}`}
              >
                <p className="font-body text-base leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-5 font-display text-[7px] text-retro-accent tracking-widest">{t.who.toUpperCase()}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const { labels, discountPercent } = useCurrency();

  const faqs = [
    {
      q: "Is Linklock free?",
      a: "Yes. 5 unlock links per week, 2 steps each, basic stats. No credit card to sign up.",
    },
    {
      q: "What can I give away?",
      a: "Any link — Drive, Dropbox, your site — or text after unlock. We don't host files; you keep your existing links.",
    },
    {
      q: "How many steps can I add?",
      a: "Free: 2 per link. Pro: 4. YouTube, Discord, Spotify, and more.",
    },
    {
      q: "Do fans need an account?",
      a: "No. They open your link, finish your steps, and get the content.",
    },
    {
      q: "What does Pro include?",
      a: `No ads, unlimited links, custom branding, and stats. ${labels.yearly} (${discountPercent}% off) or ${labels.monthly}.`,
    },
  ];

  return (
    <section id="faq" className="section-y bg-retro-bg border-b-[3px] border-retro-ink scroll-mt-20">
      <div className="mx-auto max-w-3xl px-4">
        <Reveal>
          <p className="font-display text-[8px] text-retro-accent tracking-[0.2em] mb-3">FAQ</p>
          <h2 className="section-title font-body mb-10">Quick answers</h2>
        </Reveal>

        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 40}>
              <details className="brutal-border brutal-shadow bg-retro-surface p-4 md:p-5 group hover-lift">
                <summary className="font-body font-bold text-sm md:text-base cursor-pointer list-none flex items-center justify-between gap-4">
                  {item.q}
                  <span className="font-display text-retro-accent group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="font-body text-sm text-retro-text-dim leading-relaxed mt-3 pt-3 border-t-2 border-retro-ink/10">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="relative section-y bg-pop-yellow border-b-[3px] border-retro-ink overflow-hidden">
      <span className="hp-deco hp-deco-star hp-deco-cta" aria-hidden />

      <div className="mx-auto max-w-3xl px-4 text-center relative">
        <Reveal>
          <h2 className="section-title font-body text-retro-ink mb-4">
            Your audience is waiting.
            <span className="block text-retro-accent text-2xl md:text-3xl mt-2">Ship the link.</span>
          </h2>
          <p className="font-body text-retro-ink/75 mb-8 max-w-md mx-auto text-base">
            First unlock link in about two minutes. Free every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MarketingAuthLink href="/sign-up">
              <RetroButton size="lg" variant="primary" className="min-w-[200px]">
                Create your link
              </RetroButton>
            </MarketingAuthLink>
            <Link href="/pricing">
              <RetroButton size="lg" variant="secondary" className="min-w-[200px]">
                View pricing
              </RetroButton>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
