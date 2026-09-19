import Link from "next/link";
import { RetroLink } from "@/components/retro";
import { FAQ_SECTIONS } from "@/lib/faq-content";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/marketing/json-ld";
import { SeoInternalLinks } from "@/components/marketing/seo-internal-links";

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
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <JsonLd data={faqJsonLd(ALL_FAQS.map((f) => ({ q: f.q, a: f.a })))} />
      <p className="text-xs font-semibold uppercase tracking-wider text-retro-accent mb-2">Help center</p>
      <h1 className="text-3xl md:text-4xl font-bold text-retro-text mb-3">Questions? We got you.</h1>
      <p className="text-base text-retro-text-dim leading-relaxed mb-10">
        Short answers to the stuff people ask us most. Still stuck?{" "}
        <Link href="/support" className="text-retro-accent hover:underline">
          Contact support
        </Link>
        .
      </p>

      <div className="space-y-10">
        {FAQ_SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-retro-text mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.items.map((item) => (
                <details key={item.q} className="retro-panel p-5 group">
                  <summary className="font-semibold text-retro-text cursor-pointer list-none flex items-center justify-between gap-3">
                    {item.q}
                    <span className="text-retro-text-muted group-open:rotate-45 transition-transform text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-retro-text-dim leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 retro-panel p-6 text-center">
        <p className="font-semibold text-retro-text mb-2">Ready to try it?</p>
        <p className="text-sm text-retro-text-dim mb-4">Create your first unlock link in about two minutes.</p>
        <RetroLink href="/sign-up" variant="primary" size="md">
          Start free
        </RetroLink>
      </div>

      <SeoInternalLinks />
    </div>
  );
}
