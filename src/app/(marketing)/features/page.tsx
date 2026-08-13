import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { RetroButton } from "@/components/retro";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";

export const metadata: Metadata = buildPageMetadata({
  title: "Features",
  description:
    "Unlock pages, action gating, analytics, audience export, and custom branding — everything creators need to gate downloads and grow.",
  path: "/features",
});

const features = [
  { title: "Create unlocks", desc: "Files, URLs, embeds, or text blocks." },
  { title: "Action gating", desc: "Subscribe, follow, join, email — your pick." },
  { title: "Live preview", desc: "See the page update as you edit." },
  { title: "Analytics", desc: "Views, starts, completions, conversion." },
  { title: "Audience CRM", desc: "Export people who unlocked." },
  { title: "Custom branding", desc: "Logo, colors, button copy — Pro." },
];

export default function FeaturesPage() {
  return (
    <div>
      <section className="simple-hero border-b border-retro-border">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <h1 className="simple-hero-title">What you get</h1>
          <p className="mt-4 text-lg text-retro-text-dim max-w-xl">
            Follow-to-unlock pages, unlimited free links, and Pro tools for branding and analytics.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <article key={f.title} className="simple-step-card">
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-retro-text-dim leading-relaxed">{f.desc}</p>
          </article>
        ))}
      </div>

      <section className="simple-section bg-retro-surface-2">
        <div className="mx-auto max-w-5xl px-4 py-14 grid md:grid-cols-2 gap-6">
          <article className="simple-plan-card">
            <p className="font-bold mb-1">Free</p>
            <PlanFeatureList features={PLAN_FEATURES.FREE} finePrint={PLAN_FINE_PRINT.FREE} />
          </article>
          <article className="simple-plan-card simple-plan-card--popular">
            <p className="font-bold mb-1 text-retro-accent">Pro</p>
            <PlanFeatureList features={PLAN_FEATURES.PRO} finePrint={PLAN_FINE_PRINT.PRO} />
            <Link href="/pricing" prefetch className="block mt-6">
              <RetroButton className="w-full">See Pro pricing</RetroButton>
            </Link>
          </article>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <MarketingAuthLink href="/sign-up" className="inline-block">
          <RetroButton size="lg">Start free</RetroButton>
        </MarketingAuthLink>
      </div>
    </div>
  );
}
