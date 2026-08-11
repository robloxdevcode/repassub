import Link from "next/link";
import { RetroButton } from "@/components/retro";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "How It Works",
  description:
    "Create a subscribe-to-download link in three steps: paste your file link, pick steps from 70+ platforms, share one URL.",
  path: "/how-it-works",
});

const steps = [
  { n: "1", title: "Create", desc: "Add your content and choose what fans must do first.", bg: "bg-pop-yellow" },
  { n: "2", title: "Customize", desc: "Title, thumbnail, button text — make it yours.", bg: "bg-pop-red text-white" },
  { n: "3", title: "Share", desc: "Drop the link in bio, posts, or communities.", bg: "bg-pop-blue text-white" },
  { n: "4", title: "Unlock", desc: "They complete tasks. Content opens. You gain a follower.", bg: "bg-retro-surface" },
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="bg-retro-yellow border-b-[3px] border-retro-ink py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="section-title font-body text-retro-ink">How it works</h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14 space-y-4">
        {steps.map((step) => (
          <div key={step.n} className={`${step.bg} brutal-border brutal-shadow p-6 md:p-8 flex gap-6 hover-lift`}>
            <span className="font-display text-sm shrink-0">{step.n}</span>
            <div>
              <h3 className="font-body text-xl font-bold mb-2">{step.title}</h3>
              <p className="font-body text-sm opacity-90">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-20">
        <Link href="/sign-up"><RetroButton size="lg" variant="primary">Create your link</RetroButton></Link>
      </div>
    </div>
  );
}
