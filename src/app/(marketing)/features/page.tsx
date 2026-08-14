import Link from "next/link";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { RetroButton } from "@/components/retro";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import {
  BarChart3,
  Layers,
  Palette,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Features",
  description:
    "Unlock pages, action gating, analytics, audience export, and custom branding — everything creators need to gate downloads and grow.",
  path: "/features",
});

const features = [
  { icon: Layers, title: "Create unlocks", desc: "Files, URLs, embeds, or text blocks.", accent: "ll-bento-icon--red" },
  { icon: Sparkles, title: "Action gating", desc: "Subscribe, follow, join, email — your pick.", accent: "ll-bento-icon--blue" },
  { icon: Palette, title: "Live preview", desc: "See the page update as you edit.", accent: "ll-bento-icon--yellow" },
  { icon: BarChart3, title: "Analytics", desc: "Views, starts, completions, conversion.", accent: "ll-bento-icon--blue" },
  { icon: Users, title: "Audience CRM", desc: "Export people who unlocked.", accent: "ll-bento-icon--green" },
  { icon: Palette, title: "Custom branding", desc: "Logo, colors, button copy — Pro.", accent: "ll-bento-icon--red" },
];

export default function FeaturesPage() {
  return (
    <div>
      <section className="ll-page-hero border-b border-retro-border">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="ll-label">Features</p>
          <h1 className="ll-section-title mt-3">Built for creators</h1>
          <p className="mt-4 text-retro-text-dim max-w-lg leading-relaxed">
            Gate downloads. Grow your audience. Everything you need in one tool.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <article key={f.title} className="ll-bento-card">
            <div className={`ll-bento-icon ${f.accent}`}>
              <f.icon size={20} />
            </div>
            <h3 className="font-bold text-base mt-4 mb-2">{f.title}</h3>
            <p className="text-sm text-retro-text-dim leading-relaxed">{f.desc}</p>
          </article>
        ))}
      </div>

      <section className="ll-section ll-section--muted">
        <div className="mx-auto max-w-5xl px-4 py-16 grid md:grid-cols-2 gap-5">
          <article className="ll-plan-card">
            <p className="font-bold text-lg mb-1">Free</p>
            <PlanFeatureList features={PLAN_FEATURES.FREE} finePrint={PLAN_FINE_PRINT.FREE} />
          </article>
          <article className="ll-plan-card ll-plan-card--pro">
            <p className="font-bold text-lg mb-1 text-retro-accent">Pro</p>
            <PlanFeatureList features={PLAN_FEATURES.PRO} finePrint={PLAN_FINE_PRINT.PRO} />
            <Link href="/pricing" prefetch className="block mt-6">
              <RetroButton className="w-full ll-btn-glow">See Pro pricing</RetroButton>
            </Link>
          </article>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <MarketingAuthLink href="/sign-up" className="inline-block">
          <RetroButton size="lg" className="ll-btn-glow">Start free</RetroButton>
        </MarketingAuthLink>
      </div>
    </div>
  );
}
