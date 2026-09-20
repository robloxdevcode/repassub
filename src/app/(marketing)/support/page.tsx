import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata, faqJsonLd, SUPPORT_FAQS } from "@/lib/seo";
import { JsonLd } from "@/components/marketing/json-ld";
import { DiscordSupportCard } from "@/components/marketing/discord-support";

export const metadata: Metadata = buildPageMetadata({
  title: "Support & FAQ",
  description: "Get help with Linklock unlock links, billing, Pro plans, and creator setup.",
  path: "/support",
});

export default function SupportPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(SUPPORT_FAQS)} />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-body text-3xl font-semibold tracking-tight mb-2">Support</h1>
        <p className="text-retro-text-dim mb-10">Help and common questions.</p>

        <DiscordSupportCard />

        <h2 className="font-body text-xl font-semibold mb-4">FAQ</h2>
        <div className="flex flex-col gap-3 mb-8">
          {SUPPORT_FAQS.map((item) => (
            <details key={item.q} className="retro-panel group">
              <summary className="font-body text-sm font-semibold cursor-pointer list-none flex items-center justify-between gap-4 p-4">
                {item.q}
                <span className="text-retro-accent shrink-0" aria-hidden>
                  +
                </span>
              </summary>
              <p className="font-body text-sm text-retro-text-dim leading-relaxed px-4 pb-4 border-t border-retro-border">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <p className="text-sm text-retro-text-dim">
          More questions on the{" "}
          <Link href="/help" className="text-retro-accent hover:underline">
            Help & FAQ
          </Link>
          .
        </p>
      </div>
    </>
  );
}
