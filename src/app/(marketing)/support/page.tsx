import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata, faqJsonLd, SUPPORT_FAQS } from "@/lib/seo";
import { JsonLd } from "@/components/marketing/json-ld";

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
        <h1 className="font-body text-3xl font-bold mb-2">Support</h1>
        <p className="text-retro-text-dim mb-10">Help and common questions.</p>

        <div className="brutal-border brutal-shadow bg-retro-surface p-6 mb-10 text-center">
          <p className="font-body text-sm text-retro-text-dim">Email us</p>
          <a
            href="mailto:ltrobloxbrothers@gmail.com"
            className="font-body text-lg font-bold text-retro-blue hover:underline mt-2 inline-block"
          >
            ltrobloxbrothers@gmail.com
          </a>
        </div>

        <h2 className="font-body text-xl font-bold mb-4">FAQ</h2>
        <div className="flex flex-col gap-3 mb-8">
          {SUPPORT_FAQS.map((item) => (
            <details key={item.q} className="home-faq-item brutal-border bg-retro-surface-2 group">
              <summary className="home-faq-question font-body text-sm font-bold cursor-pointer list-none flex items-center justify-between gap-4 p-4">
                {item.q}
                <span className="home-faq-chevron font-display text-retro-accent shrink-0" aria-hidden>
                  +
                </span>
              </summary>
              <p className="font-body text-sm text-retro-text-dim leading-relaxed px-4 pb-4 border-t-2 border-retro-ink/10">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <p className="text-sm text-retro-text-dim">
          More questions on the{" "}
          <Link href="/#faq" className="text-retro-blue hover:underline">
            homepage FAQ
          </Link>
          .
        </p>
      </div>
    </>
  );
}
