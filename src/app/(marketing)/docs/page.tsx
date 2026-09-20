import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import {
  MarketingInlineLink,
  MarketingPageBody,
  MarketingPageHero,
  MarketingProse,
} from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = buildPageMetadata({
  title: "Documentation",
  description: "Linklock docs — create unlock links, add steps, customize pages, and track conversions.",
  path: "/docs",
});

export default function DocsPage() {
  return (
    <>
      <MarketingPageHero
        label="Docs"
        title="Creator documentation"
        description="Create unlock links, add fan steps, customize pages, and track conversions."
      />
      <MarketingPageBody width="4xl">
        <div className="retro-panel p-8">
          <MarketingProse>
            <h2 className="text-lg font-bold text-retro-text mb-2">Getting started</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <MarketingInlineLink href="/sign-up">Create an account</MarketingInlineLink>
              </li>
              <li>Open Create link in your dashboard</li>
              <li>Choose content type (file, URL, or text)</li>
              <li>Select required fan actions</li>
              <li>Customize your unlock page</li>
              <li>Publish and share your URL</li>
            </ol>
            <h2 className="text-lg font-bold text-retro-text mt-8 mb-2">Action types</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Follow</strong> — social follows (manual confirm)
              </li>
              <li>
                <strong>Subscribe</strong> — YouTube and similar
              </li>
              <li>
                <strong>Join</strong> — Discord and communities
              </li>
              <li>
                <strong>Email</strong> — collect addresses
              </li>
              <li>
                <strong>Visit</strong> — outbound link visits
              </li>
            </ul>
            <p className="mt-8">
              Need help? <Link href="/support">Support & FAQ</Link>.
            </p>
          </MarketingProse>
        </div>
      </MarketingPageBody>
    </>
  );
}
