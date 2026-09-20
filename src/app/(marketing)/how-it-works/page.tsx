import Link from "next/link";
import { RetroButton } from "@/components/retro";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import {
  MarketingPageBody,
  MarketingPageCta,
  MarketingPageHero,
} from "@/components/marketing/marketing-page-shell";

export const metadata: Metadata = buildPageMetadata({
  title: "How It Works",
  description:
    "Create a subscribe-to-download link in three steps: paste your file link, pick steps from 70+ platforms, share one URL.",
  path: "/how-it-works",
});

const steps = [
  { n: "01", title: "Create", desc: "Add your content and choose what fans must do first." },
  { n: "02", title: "Customize", desc: "Title, thumbnail, button text — make it yours." },
  { n: "03", title: "Share", desc: "Drop the link in bio, posts, or communities." },
  { n: "04", title: "Unlock", desc: "They complete tasks. Content opens. You gain a follower." },
];

export default function HowItWorksPage() {
  return (
    <>
      <MarketingPageHero
        label="How it works"
        title="Four steps, one link"
        description="Most creators publish in under two minutes. No code, no embeds."
      />
      <MarketingPageBody width="3xl">
        <ol className="space-y-4">
          {steps.map((step) => (
            <li key={step.n} className="ll-step flex-row md:flex-row md:items-start">
              <span className="ll-step-num">{step.n}</span>
              <div>
                <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-retro-text-dim leading-relaxed">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Link href="/sign-up">
            <RetroButton size="lg">Create your link</RetroButton>
          </Link>
        </div>
      </MarketingPageBody>
      <MarketingPageCta title="Turn downloads into followers" />
    </>
  );
}
