import Link from "next/link";
import { RetroLink } from "@/components/retro";
import { FAQ_SECTIONS } from "@/lib/faq-content";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/marketing/json-ld";
import { SeoInternalLinks } from "@/components/marketing/seo-internal-links";
import {
  MarketingInlineLink,
  MarketingPageBody,
  MarketingPageHero,
} from "@/components/marketing/marketing-page-shell";

const ALL_FAQS = FAQ_SECTIONS.flatMap((s) => s.items);

export const metadata = buildPageMetadata({
  title: "Help & FAQ",
  description:
    "Linklock help: why verifying takes ~10 seconds, how fan steps work, Free vs Pro, refunds, TikTok/Instagram steps, and preset pack unlock links.",
  path: "/help",
  keywords: [
    "linklock help",
    "unlock link faq",
    "subscribe to download help",
    "free vs pro linklock",
    "fan steps explained",
  ],
});

export default function HelpPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(ALL_FAQS.map((f) => ({ q: f.q, a: f.a })))} />
      <MarketingPageHero
        label="Help center"
        title="Questions? We got you."
        description="Short answers to what creators ask most. Still stuck? Contact support on Discord."
      />
      <MarketingPageBody width="3xl">
        <p className="text-sm text-retro-text-dim mb-10">
          <MarketingInlineLink href="/support">Contact support</MarketingInlineLink> anytime.
        </p>

        <div className="space-y-10">
          {FAQ_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <details key={item.q} className="retro-panel group">
                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between gap-3 p-4">
                      {item.q}
                      <span className="text-retro-text-muted group-open:rotate-45 transition-transform text-xl">
                        +
                      </span>
                    </summary>
                    <p className="px-4 pb-4 text-sm text-retro-text-dim leading-relaxed border-t border-retro-border pt-3">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 retro-panel p-6 text-center">
          <p className="font-semibold mb-2">Ready to try it?</p>
          <p className="text-sm text-retro-text-dim mb-4">Create your first unlock link in about two minutes.</p>
          <RetroLink href="/sign-up" variant="primary" size="md">
            Start free
          </RetroLink>
        </div>

        <SeoInternalLinks />
      </MarketingPageBody>
    </>
  );
}
