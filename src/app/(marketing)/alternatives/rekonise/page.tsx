import Link from "next/link";
import type { Metadata } from "next";
import { breadcrumbJsonLd, buildPageMetadata, comparisonPageJsonLd, faqJsonLd, REKONISE_ALTERNATIVE_FAQS } from "@/lib/seo";
import {
  AnalyticsGrowthSection,
  FeaturesGridSection,
  SocialGrowthSection,
  TestimonialsSection,
  TrustStrip,
} from "@/components/marketing/rekonise-sections";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton, RetroLink } from "@/components/retro";
import { JsonLd } from "@/components/marketing/json-ld";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Rekonise Alternative (2026)",
  description:
    "Linklock vs Rekonise: unlimited free unlock links, cleaner mobile UX, per-link analytics, TikTok & Instagram steps. Switch in 2 minutes — no fan account required.",
  path: "/alternatives/rekonise",
  keywords: [
    "Rekonise alternative",
    "Rekonise alternatives",
    "Rekonise vs Linklock",
    "better than Rekonise",
    "St Rekonise alternative",
    "content locker alternative",
    "subscribe to download",
    "unlock link tool",
    "linklock.org",
  ],
});

const COMPARE_ROWS = [
  { feature: "Free links", linklock: "Unlimited", other: "Limited / unclear" },
  { feature: "Steps per link (Free)", linklock: "4", other: "Varies" },
  { feature: "Fan account required", linklock: "No", other: "Often no" },
  { feature: "Per-link analytics", linklock: "Yes", other: "Basic" },
  { feature: "TikTok / IG steps", linklock: "Yes", other: "Limited" },
  { feature: "Custom branding (Pro)", linklock: "Logo, colors, video", other: "Varies" },
  { feature: "Public creator profile", linklock: "/u/username", other: "No" },
  { feature: "Share kit (bio + QR)", linklock: "Built in", other: "Manual" },
];

const FAQ = REKONISE_ALTERNATIVE_FAQS;

export default function RekoniseAlternativePage() {
  const pageDescription =
    "Linklock vs Rekonise: unlimited free unlock links, cleaner mobile UX, per-link analytics, TikTok & Instagram steps. Switch in 2 minutes — no fan account required.";

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Alternatives", path: "/alternatives" },
            { name: "Rekonise alternative", path: "/alternatives/rekonise" },
          ]),
          comparisonPageJsonLd({
            name: "Best Rekonise Alternative (2026) — Linklock",
            description: pageDescription,
            path: "/alternatives/rekonise",
            aboutName: "Rekonise",
          }),
          faqJsonLd(FAQ),
        ]}
      />

      <section className="ll-hero-compact mx-auto max-w-4xl px-4 pt-16 pb-10 text-center">
        <p className="ll-brand-tag ll-brand-tag--dark mx-auto w-fit">Comparison</p>
        <h1 className="font-display text-3xl md:text-5xl tracking-tight mt-4 mb-4">
          Best Rekonise alternative for creators (2026)
        </h1>
        <p className="text-lg text-retro-text-dim max-w-2xl mx-auto leading-relaxed">
          Same idea — gate downloads behind social steps — but unlimited free links, cleaner pages,
          and stats that tell you which link converts.
        </p>
        <p className="sr-only">
          Linklock is a Rekonise alternative with unlimited free subscribe-to-download links, no fan
          account, TikTok and Instagram unlock steps, and per-link analytics at linklock.org.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <MarketingAuthLink href="/sign-up">
            <RetroButton size="lg">Try Linklock free</RetroButton>
          </MarketingAuthLink>
          <RetroLink href="/pricing" variant="secondary" size="lg">
            See pricing
          </RetroLink>
        </div>
      </section>

      <TrustStrip />

      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-xl font-bold mb-6 text-center">Linklock vs Rekonise at a glance</h2>
        <div className="overflow-x-auto brutal-border rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-retro-surface-2 border-b-2 border-retro-ink">
                <th className="text-left p-4 font-bold">Feature</th>
                <th className="text-left p-4 font-bold text-retro-accent">Linklock</th>
                <th className="text-left p-4 font-bold text-retro-text-dim">Typical locker</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-retro-border">
                  <td className="p-4 font-medium">{row.feature}</td>
                  <td className="p-4 text-retro-accent font-semibold">{row.linklock}</td>
                  <td className="p-4 text-retro-text-dim">{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SocialGrowthSection />
      <AnalyticsGrowthSection />
      <FeaturesGridSection />
      <TestimonialsSection />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="ll-section-title mb-8">FAQ</h2>
        <div className="flex flex-col gap-3">
          {FAQ.map((item) => (
            <details key={item.q} className="ll-faq ll-faq--clean">
              <summary className="ll-faq-q ll-faq-q--clean">{item.q}</summary>
              <p className="ll-faq-a ll-faq-a--clean">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="ll-cta mx-auto max-w-xl px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold mb-3">Switch in 2 minutes</h2>
        <p className="text-retro-text-dim mb-6">
          Create your first link, paste the Share kit bio line in your profile, and you&apos;re live.
        </p>
        <MarketingAuthLink href="/sign-up">
          <RetroButton size="lg">Create free account</RetroButton>
        </MarketingAuthLink>
        <p className="mt-4 text-xs text-retro-text-muted">
          <Link href="/blog/rekonise-alternative" className="hover:text-retro-accent underline">
            Read the full comparison on our blog →
          </Link>
        </p>
      </section>
    </>
  );
}
