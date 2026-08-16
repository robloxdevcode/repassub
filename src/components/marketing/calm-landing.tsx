"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, FileText, Gift, Link2, Lock, Users } from "lucide-react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { HeroLiveUnlock } from "@/components/marketing/hero-live-unlock";
import { HOME_FAQS } from "@/lib/seo";

const USE_CASES = [
  {
    tag: "Files",
    title: "Downloads & PDFs",
    desc: "Share a file link that only opens after your steps are finished.",
    icon: FileText,
  },
  {
    tag: "Links",
    title: "Private URLs",
    desc: "Hide invite-only pages, forms, or resources behind a short checklist.",
    icon: Link2,
  },
  {
    tag: "Codes",
    title: "Coupons & keys",
    desc: "Reveal a discount code or license key once visitors complete the flow.",
    icon: Gift,
  },
  {
    tag: "Community",
    title: "Group access",
    desc: "Ask for a subscribe or join, then hand over your Discord or forum link.",
    icon: Users,
  },
  {
    tag: "Courses",
    title: "Lesson materials",
    desc: "Release worksheets, videos, or bonus content after a quick gate.",
    icon: Lock,
  },
  {
    tag: "Leads",
    title: "Guides & templates",
    desc: "Trade a few actions for a checklist, preset pack, or starter kit.",
    icon: FileText,
  },
];

const STEPS = [
  {
    num: "01",
    title: "Create your page",
    desc: "Add what you're sharing — a link, file URL, or text to reveal when done.",
  },
  {
    num: "02",
    title: "Set the steps",
    desc: "Pick what visitors do first. Subscribe, join, follow — up to 4 free, 10 on Pro.",
  },
  {
    num: "03",
    title: "Share one link",
    desc: "Post it anywhere. They finish the steps, your content unlocks. No account needed.",
  },
];

export function CalmLanding() {
  return (
    <div className="ll-landing">
      {/* Hero — Zylo-style split, Linklock light palette */}
      <section className="ll-landing-hero">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 md:pt-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <h1 className="ll-landing-display ll-landing-hero-title">
                Share content that unlocks when they&apos;re done.
              </h1>
              <p className="ll-landing-lead mt-5">
                One link for your audience. Set what they need to do first — then your file, URL, or
                message opens automatically.
              </p>
              <p className="ll-landing-accent mt-4">Free plan included · No credit card required</p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
                <MarketingAuthLink href="/sign-up">
                  <button type="button" className="ll-landing-pill ll-landing-pill--primary">
                    Get started free
                    <ChevronRight size={18} className="opacity-70" />
                  </button>
                </MarketingAuthLink>
                <Link href="/pricing" className="ll-landing-text-link">
                  View pricing
                </Link>
              </div>

              <p className="ll-landing-trust-strip mt-10">
                Trusted by creators and teams sharing gated content every day
              </p>
            </div>

            <div className="ll-landing-hero-visual">
              <div className="ll-landing-hero-glow" aria-hidden />
              <HeroLiveUnlock size="lg" className="relative z-10 w-full max-w-md mx-auto" calm />
              <p className="relative z-10 mt-4 text-center text-sm text-retro-text-muted">
                Try the preview — tap the steps above
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases grid */}
      <section className="ll-landing-section ll-landing-section--soft">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <h2 className="ll-landing-display ll-landing-section-title">What can you unlock?</h2>
            <p className="ll-landing-section-lead mt-4">
              Real unlock pages for files, links, codes, and community access — live in minutes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {USE_CASES.map((item) => (
              <MarketingAuthLink key={item.title} href="/sign-up" className="block h-full">
                <article className="ll-landing-card h-full">
                  <div className="ll-landing-card-preview">
                    <span className="ll-landing-tag">{item.tag}</span>
                    <item.icon size={28} className="ll-landing-card-icon" strokeWidth={1.5} />
                  </div>
                  <div className="ll-landing-card-body">
                    <h3 className="ll-landing-card-title">{item.title}</h3>
                    <p className="ll-landing-card-desc">{item.desc}</p>
                    <span className="ll-landing-card-link">
                      Create this page
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </article>
              </MarketingAuthLink>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="ll-landing-section scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="ll-landing-display ll-landing-section-title">Live in three steps</h2>
            <p className="ll-landing-section-lead mt-4">
              No code. No complicated setup. Describe what you share, pick your steps, and post the
              link.
            </p>
          </div>

          <ol className="ll-landing-steps">
            {STEPS.map((step) => (
              <li key={step.num} className="ll-landing-step">
                <span className="ll-landing-step-num">{step.num}</span>
                <h3 className="ll-landing-step-title">{step.title}</h3>
                <p className="ll-landing-step-desc">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="ll-landing-section ll-landing-section--soft">
        <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
          <h2 className="ll-landing-display ll-landing-section-title text-center">Common questions</h2>
          <div className="mt-10 flex flex-col gap-2">
            {HOME_FAQS.map((item) => (
              <details key={item.q} className="ll-landing-faq">
                <summary className="ll-landing-faq-q">
                  {item.q}
                  <ChevronDown size={18} className="ll-landing-faq-chevron shrink-0" />
                </summary>
                <p className="ll-landing-faq-a">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/pricing" className="ll-landing-text-link">
              View full pricing details →
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="ll-landing-section">
        <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
          <div className="ll-landing-cta-box text-center">
            <h2 className="ll-landing-display ll-landing-cta-title">
              Ready to share your first unlock link?
            </h2>
            <p className="ll-landing-section-lead mt-3 mx-auto max-w-md">
              Start free. Upgrade when you need more steps, branding, or analytics.
            </p>
            <MarketingAuthLink href="/sign-up" className="inline-block mt-8">
              <button type="button" className="ll-landing-pill ll-landing-pill--primary">
                Get started free
                <ChevronRight size={18} className="opacity-70" />
              </button>
            </MarketingAuthLink>
            <p className="mt-4 text-sm text-retro-text-muted">No credit card required</p>
          </div>
        </div>
      </section>
    </div>
  );
}
