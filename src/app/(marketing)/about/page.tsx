import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";
import {
  MarketingPageBody,
  MarketingPageHero,
  MarketingProse,
  MarketingInlineLink,
} from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = buildPageMetadata({
  title: "About Linklock",
  description:
    "Linklock helps creators gate downloads behind social steps — subscribe, follow, join — with unlimited free unlock links.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <MarketingPageHero
        label="About"
        title="Unlock links should feel good"
        description="Subscribe-to-download for creators who give away packs, beats, mods, and community drops."
      />
      <MarketingPageBody width="3xl">
        <MarketingProse>
          <p>
            Instead of leaking raw file URLs, you share one unlock page — fans complete your steps, you
            grow, they get the file.
          </p>
          <p>
            Free includes unlimited links and per-link stats. Pro adds branding, more steps, deeper
            analytics, and no ads on your pages.
          </p>
          <p>
            Built at{" "}
            <a href="https://linklock.org" className="text-[#0ea5e9] font-medium hover:underline">
              linklock.org
            </a>
            . Questions? <MarketingInlineLink href="/support">Contact support</MarketingInlineLink>.
          </p>
        </MarketingProse>
        <div className="mt-10">
          <MarketingAuthLink href="/sign-up">
            <RetroButton size="lg">Try Linklock free</RetroButton>
          </MarketingAuthLink>
        </div>
      </MarketingPageBody>
    </>
  );
}
