import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { USE_CASE_PAGES } from "@/lib/use-cases-content";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";

export const metadata: Metadata = buildPageMetadata({
  title: "Use Cases — Subscribe to Download by Niche",
  description:
    "Preset pack, beat kit, Minecraft mod, YouTube tutorial, and Discord community unlock link guides — setup steps and example fan actions.",
  path: "/use-cases",
  keywords: [
    "preset pack download link",
    "beat pack gate",
    "minecraft mod download",
    "youtube subscribe unlock",
    "discord join download",
  ],
});

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-retro-accent mb-2">Use cases</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">What creators gate with Linklock</h1>
        <p className="text-lg text-retro-text-dim max-w-2xl mx-auto">
          Pick your niche — each guide shows example steps and how to share your link.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {USE_CASE_PAGES.map((page) => (
          <Link
            key={page.slug}
            href={`/use-cases/${page.slug}`}
            className="retro-panel p-6 hover:border-retro-accent transition-colors block"
          >
            <h2 className="font-bold text-lg mb-2">{page.title}</h2>
            <p className="text-sm text-retro-text-dim leading-relaxed mb-4">{page.description}</p>
            <span className="text-sm font-semibold text-retro-accent">Read guide →</span>
          </Link>
        ))}
      </div>

      <div className="text-center mt-14">
        <MarketingAuthLink href="/sign-up">
          <RetroButton size="lg">Create your unlock link</RetroButton>
        </MarketingAuthLink>
        <p className="mt-3 text-sm text-retro-text-muted">
          Not sure?{" "}
          <Link href="/help" className="text-retro-accent hover:underline">
            Help & FAQ
          </Link>
        </p>
      </div>
    </div>
  );
}
