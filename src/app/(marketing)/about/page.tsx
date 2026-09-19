import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";

export const metadata: Metadata = buildPageMetadata({
  title: "About Linklock",
  description:
    "Linklock helps creators gate downloads behind social steps — subscribe, follow, join — with unlimited free unlock links.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wider text-retro-accent mb-2">About</p>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">We think unlock links should feel good</h1>
      <div className="prose prose-sm max-w-none space-y-4 text-retro-text-dim leading-relaxed">
        <p>
          Linklock is a subscribe-to-download tool for creators who give away preset packs, beats, mods,
          tutorial files, and community drops. Instead of leaking raw Google Drive URLs, you share one
          unlock page — fans complete your steps, you grow, they get the file.
        </p>
        <p>
          Free includes unlimited links and real per-link stats. Pro adds deeper analytics, your branding,
          more steps, and no ads on your pages.
        </p>
        <p>
          Built at{" "}
          <a href="https://linklock.org" className="text-retro-accent hover:underline">
            linklock.org
          </a>
          . Questions?{" "}
          <Link href="/support" className="text-retro-accent hover:underline">
            Contact support
          </Link>
          .
        </p>
      </div>
      <div className="mt-10">
        <MarketingAuthLink href="/sign-up">
          <RetroButton size="lg">Try Linklock free</RetroButton>
        </MarketingAuthLink>
      </div>
    </div>
  );
}
