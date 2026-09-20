import type { Metadata } from "next";
import { buildPageMetadata, faqJsonLd, SUPPORT_FAQS } from "@/lib/seo";
import { JsonLd } from "@/components/marketing/json-ld";
import { DiscordSupportCard } from "@/components/marketing/discord-support";
import {
  MarketingPageBody,
  MarketingPageHero,
  MarketingInlineLink,
} from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = buildPageMetadata({
  title: "Support & FAQ",
  description: "Get help with Linklock unlock links, billing, Pro plans, and creator setup.",
  path: "/support",
});

export default function SupportPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(SUPPORT_FAQS)} />
      <MarketingPageHero
        label="Support"
        title="We’re here on Discord"
        description="Fastest help is in our community server. FAQ below covers billing, links, and Pro."
      />
      <MarketingPageBody width="3xl">
        <DiscordSupportCard />

        <h2 className="text-lg font-bold mt-12 mb-4">FAQ</h2>
        <div className="flex flex-col gap-3">
          {SUPPORT_FAQS.map((item) => (
            <details key={item.q} className="retro-panel group">
              <summary className="font-body text-sm font-semibold cursor-pointer list-none flex items-center justify-between gap-4 p-4">
                {item.q}
                <span className="text-[#0ea5e9] shrink-0" aria-hidden>
                  +
                </span>
              </summary>
              <p className="font-body text-sm text-retro-text-dim leading-relaxed px-4 pb-4 border-t border-retro-border">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <p className="text-sm text-retro-text-dim mt-10">
          More on <MarketingInlineLink href="/help">Help & FAQ</MarketingInlineLink>.
        </p>
      </MarketingPageBody>
    </>
  );
}
