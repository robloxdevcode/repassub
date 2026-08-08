import Link from "next/link";
import { Check, X } from "lucide-react";
import { RetroButton } from "@/components/retro";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { PRO_PRICE_MONTHLY_LABEL } from "@/lib/stripe";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 md:pt-8 md:pb-20">
        <div className="inline-block font-display text-[8px] bg-retro-yellow border-2 border-retro-ink px-3 py-1 brutal-shadow-sm mb-6">
          BUILT FOR CREATORS — NOT CORPORATE TEAMS
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 lg:gap-10">
          <div className="flex-1 min-w-0 max-w-xl">
            <h1 className="hero-title font-body text-retro-text">
              Make them{" "}
              <span className="text-retro-accent underline decoration-4 decoration-retro-yellow underline-offset-4">
                follow
              </span>
              .<br />
              Then unlock.
            </h1>

            <p className="mt-4 text-base md:text-lg text-retro-text-dim font-body leading-relaxed">
              The unlock link tool that&apos;s free to start, takes two minutes to set up, and actually turns views into subscribers — not just clicks.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/sign-up">
                <RetroButton size="lg" variant="primary">Start free — no card</RetroButton>
              </Link>
              <Link href="/how-it-works">
                <RetroButton size="lg" variant="secondary">How it works</RetroButton>
              </Link>
            </div>

            <p className="mt-5 font-body text-sm text-retro-text-dim">
              Join 500+ creators who switched from bloated unlock tools.
            </p>
          </div>

          <HeroLiveUnlock className="shrink-0 mx-auto sm:mx-0 sm:ml-auto lg:-mt-1" />
        </div>
      </div>
    </section>
  );
}

const COMPARISON: {
  label: string;
  repassub: string;
  others: string;
  edge: "repassub" | "others" | "tie";
}[] = [
  {
    label: "Free links",
    repassub: "Unlimited, no card",
    others: "Unlimited, free forever",
    edge: "tie",
  },
  {
    label: "Pro price",
    repassub: PRO_PRICE_MONTHLY_LABEL,
    others: "€9.99/mo",
    edge: "repassub",
  },
  {
    label: "Support",
    repassub: "24/7 — we've got you",
    others: "No 24/7 support",
    edge: "repassub",
  },
];

function ComparisonIcon({ edge, side }: { edge: "repassub" | "others" | "tie"; side: "repassub" | "others" }) {
  if (edge === "tie") {
    return (
      <span className="shrink-0 flex h-5 w-5 items-center justify-center bg-retro-blue border-2 border-retro-ink text-white">
        <Check size={12} strokeWidth={3} />
      </span>
    );
  }

  const wins = edge === side;

  return (
    <span
      className={
        wins
          ? "shrink-0 flex h-5 w-5 items-center justify-center bg-retro-success border-2 border-retro-ink text-retro-ink"
          : "shrink-0 flex h-5 w-5 items-center justify-center bg-retro-surface-3 border-2 border-retro-ink/30 text-retro-text-muted"
      }
    >
      {wins ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
    </span>
  );
}

export function WhyRepassubSection() {
  return (
    <section className="py-14 md:py-16 bg-retro-surface-2 border-y-[3px] border-retro-ink">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 md:mb-10">
          <div className="inline-block font-display text-[8px] bg-retro-yellow border-2 border-retro-ink px-3 py-1 brutal-shadow-sm mb-4">
            VS OTHERS
          </div>
          <h2 className="section-title font-body text-retro-text">
            Cheaper Pro. Same free links.
          </h2>
          <p className="mt-4 font-body text-base text-retro-text-dim leading-relaxed max-w-2xl">
            Unlimited free on both. Repassub Pro is {PRO_PRICE_MONTHLY_LABEL} with 24/7 support — others charge €9.99/mo without it.
          </p>
        </div>

        <div className="brutal-border brutal-shadow bg-retro-surface overflow-hidden">
          <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)] border-b-[3px] border-retro-ink">
            <div className="p-4 font-body text-sm font-bold text-retro-text-dim" />
            <div className="p-4 bg-pop-red text-white border-x-[3px] border-retro-ink">
              <p className="font-display text-[8px]">REPASSUB</p>
            </div>
            <div className="p-4 bg-retro-surface-2">
              <p className="font-display text-[8px] text-retro-text-muted">OTHERS</p>
            </div>
          </div>

          <div className="divide-y-[2px] divide-retro-ink">
            {COMPARISON.map((row) => (
              <div
                key={row.label}
                className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)] md:divide-x-[2px] md:divide-retro-ink"
              >
                <div className="px-4 py-3 md:p-4 bg-retro-surface-3 md:bg-transparent font-body text-sm font-bold text-retro-text md:flex md:items-center">
                  {row.label}
                </div>

                <div className="flex gap-2.5 items-center px-4 py-3 md:p-4 bg-retro-surface-3/80 md:border-x-[2px] md:border-retro-ink">
                  <ComparisonIcon edge={row.edge} side="repassub" />
                  <p className="font-body text-sm font-semibold text-retro-text leading-snug">{row.repassub}</p>
                </div>

                <div className="flex gap-2.5 items-center px-4 py-3 md:p-4 bg-retro-surface-2 border-t-[2px] md:border-t-0 border-retro-ink">
                  <ComparisonIcon edge={row.edge} side="others" />
                  <p className="font-body text-sm text-retro-text-dim leading-snug">{row.others}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6">
          <Link href="/pricing" className="font-body text-sm font-semibold text-retro-blue hover:underline">
            Full pricing →
          </Link>
        </p>
      </div>
    </section>
  );
}

export function StepsSection() {
  const steps = [
    { n: "01", title: "Upload or paste", desc: "Your file, link, code, or text.", color: "bg-pop-red" },
    { n: "02", title: "Pick actions", desc: "Subscribe, follow, join — your rules.", color: "bg-pop-blue" },
    { n: "03", title: "Share & grow", desc: "One link. Real audience growth.", color: "bg-pop-yellow" },
  ];

  return (
    <section className="section-y bg-retro-surface-2 border-y-[3px] border-retro-ink">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="section-title font-body mb-12 md:mb-16">
          Three steps. <span className="text-retro-blue">That&apos;s it.</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className={`${s.color} brutal-border brutal-shadow p-6 md:p-8 hover-lift ${s.color === "bg-pop-yellow" ? "text-retro-ink" : ""}`}
            >
              <p className="font-display text-[10px] opacity-80 mb-4">{s.n}</p>
              <h3 className="font-body text-xl font-bold mb-2">{s.title}</h3>
              <p className="font-body text-sm opacity-90">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SocialProof() {
  const quotes = [
    { q: "Switched from another unlock tool — Repassub just works.", who: "Alex", stat: "360K unlocks" },
    { q: "Most of our Discord came from these links.", who: "Ronix", stat: "530K members" },
    { q: "Setup took five minutes. No BS.", who: "Velo", stat: "1M subs" },
  ];

  return (
    <section className="bg-pop-blue border-y-[3px] border-retro-ink section-y text-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="section-title font-body mb-12 text-white">
          Creators who made the switch.
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((item) => (
            <div key={item.who} className="bg-retro-surface text-retro-text brutal-border brutal-shadow p-6 hover-lift">
              <p className="font-body text-base leading-relaxed mb-6">&ldquo;{item.q}&rdquo;</p>
              <div className="flex justify-between items-end border-t-2 border-retro-ink pt-4">
                <span className="font-body font-bold">{item.who}</span>
                <span className="font-display text-[8px] text-retro-accent">{item.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="section-y bg-retro-yellow border-b-[3px] border-retro-ink">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="section-title font-body text-retro-ink mb-4">
          Stop overpaying for unlock links.
        </h2>
        <p className="font-body text-lg text-retro-ink/70 max-w-md mx-auto mb-10">
          Repassub is free to start. No card. No enterprise sales call. Just create and share.
        </p>
        <Link href="/sign-up">
          <RetroButton size="lg" variant="primary">Get started — it&apos;s free</RetroButton>
        </Link>
      </div>
    </section>
  );
}
