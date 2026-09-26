import Link from "next/link";
import type { Metadata } from "next";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  itemListJsonLd,
  REKONISE_ALTERNATIVE_FAQS,
  faqJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/marketing/json-ld";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";

export const metadata: Metadata = buildPageMetadata({
  title: "Subscribe-to-Download Tool Alternatives",
  description:
    "Compare content locker and Rekonise alternatives. Linklock offers unlimited free unlock links, TikTok and YouTube steps, and per-link analytics for creators.",
  path: "/alternatives",
  keywords: [
    "Rekonise alternative",
    "Rekonise alternatives",
    "content locker alternative",
    "subscribe to download tools",
    "better than Rekonise",
    "unlock link platform",
  ],
});

const ALTERNATIVES = [
  {
    href: "/alternatives/rekonise",
    title: "Rekonise alternative",
    description: "Unlimited free links, cleaner mobile UX, Share kit, and per-link stats vs typical lockers.",
  },
  {
    href: "/blog/rekonise-alternative",
    title: "Linklock vs Rekonise (blog)",
    description: "Long-form comparison for creators switching unlock tools in 2026.",
  },
  {
    href: "/use-cases/preset-packs",
    title: "Preset pack unlock links",
    description: "Gate Lightroom presets and packs behind follows and subs.",
  },
];

export default function AlternativesHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Alternatives", path: "/alternatives" },
          ]),
          itemListJsonLd(
            ALTERNATIVES.map((a) => ({ name: a.title, path: a.href })),
          ),
          faqJsonLd(REKONISE_ALTERNATIVE_FAQS.slice(0, 3)),
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-16 pb-20">
        <p className="text-sm font-semibold text-retro-accent mb-2">For creators &amp; search</p>
        <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
          Rekonise alternatives &amp; unlock link tools
        </h1>
        <p className="text-lg text-retro-text-dim leading-relaxed mb-6">
          If you are looking for a <strong>Rekonise alternative</strong>, a tool{" "}
          <strong>better than Rekonise</strong> for preset packs and beats, or a subscribe-to-download
          platform with unlimited free links, start with Linklock — then read the detailed comparison
          below.
        </p>

        <ul className="flex flex-col gap-4 mb-12">
          {ALTERNATIVES.map((item) => (
            <li key={item.href} className="brutal-border rounded-xl p-5 bg-retro-surface">
              <Link href={item.href} className="text-lg font-bold text-retro-accent hover:underline">
                {item.title}
              </Link>
              <p className="text-sm text-retro-text-dim mt-2">{item.description}</p>
            </li>
          ))}
        </ul>

        <section aria-labelledby="alt-faq-heading">
          <h2 id="alt-faq-heading" className="text-xl font-bold mb-4">
            Quick answers
          </h2>
          <div className="flex flex-col gap-3">
            {REKONISE_ALTERNATIVE_FAQS.slice(0, 3).map((item) => (
              <details key={item.q} className="ll-faq ll-faq--clean">
                <summary className="ll-faq-q ll-faq-q--clean">{item.q}</summary>
                <p className="ll-faq-a ll-faq-a--clean">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <MarketingAuthLink href="/sign-up">
            <RetroButton size="lg">Try Linklock free</RetroButton>
          </MarketingAuthLink>
        </div>
      </article>
    </>
  );
}
