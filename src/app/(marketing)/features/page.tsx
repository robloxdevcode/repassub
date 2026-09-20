import Link from "next/link";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { RetroButton } from "@/components/retro";
import {
  MarketingPageBody,
  MarketingPageCta,
  MarketingPageHero,
  MarketingPageSection,
} from "@/components/marketing/marketing-page-shell";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { BarChart3, Layers, Palette, Sparkles, Users } from "lucide-react";

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
    <>
      <MarketingPageHero
        label="Features"
        title="Built for creators"
        description="Gate downloads. Grow your audience. Everything you need in one tool."
      />

      <MarketingPageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="ll-bento-card">
              <div className={`ll-bento-icon ${f.accent}`}>
                <f.icon size={20} aria-hidden />
              </div>
              <h3 className="font-bold text-base mt-4 mb-2">{f.title}</h3>
              <p className="text-sm text-retro-text-dim leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>
      </MarketingPageBody>

      <MarketingPageSection muted>
        <MarketingPageBody width="5xl" className="py-0">
          <div className="grid md:grid-cols-2 gap-5">
            <article className="ll-plan-card">
              <p className="font-bold text-lg mb-1">Free</p>
              <PlanFeatureList features={PLAN_FEATURES.FREE} finePrint={PLAN_FINE_PRINT.FREE} />
            </article>
            <article className="ll-plan-card ll-plan-card--pro">
              <p className="font-bold text-lg mb-1 text-[#0ea5e9]">Pro</p>
              <PlanFeatureList features={PLAN_FEATURES.PRO} finePrint={PLAN_FINE_PRINT.PRO} />
              <Link href="/pricing" prefetch className="block mt-6">
                <RetroButton className="w-full">See Pro pricing</RetroButton>
              </Link>
            </article>
          </div>
        </MarketingPageBody>
      </MarketingPageSection>

      <MarketingPageCta title="Start gating content in minutes" buttonLabel="Start free" />
    </>
  );
}
