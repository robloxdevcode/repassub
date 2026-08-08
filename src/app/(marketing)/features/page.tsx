import Link from "next/link";
import { RetroButton, RetroCard } from "@/components/retro";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Features" };

const features = [
  { title: "Create unlocks", desc: "Files, URLs, embeds, or text blocks.", color: "yellow" as const },
  { title: "Action gating", desc: "Subscribe, follow, join, email — your pick.", color: "red" as const },
  { title: "Live preview", desc: "See the page update as you edit.", color: "blue" as const },
  { title: "Analytics", desc: "Views, starts, completions, conversion.", color: "white" as const },
  { title: "Audience CRM", desc: "Export people who unlocked.", color: "white" as const },
  { title: "Custom branding", desc: "Logo, colors, button copy.", color: "yellow" as const },
];

export default function FeaturesPage() {
  return (
    <div>
      <section className="bg-pop-blue text-white border-b-[3px] border-retro-ink py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="section-title font-body">Features</h1>
          <p className="font-body text-lg mt-4 opacity-90 max-w-lg">Tools to gate content and grow your channels.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <RetroCard key={f.title} color={f.color}>
            <h3 className="font-body text-lg font-bold mb-2">{f.title}</h3>
            <p className="font-body text-sm opacity-90">{f.desc}</p>
          </RetroCard>
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20">
        <Link href="/sign-up"><RetroButton size="lg">Start free</RetroButton></Link>
      </div>
    </div>
  );
}
