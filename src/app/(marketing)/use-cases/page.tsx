import Link from "next/link";
import { RetroButton, RetroCard } from "@/components/retro";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Use Cases",
  description: "Subscribe-to-download for music producers, game devs, streamers, and online communities.",
  path: "/use-cases",
});

const cases = [
  { title: "Music & Audio", desc: "Share sample packs, stems, and presets." },
  { title: "Gaming", desc: "Gate mods, configs, and exclusive content." },
  { title: "Education", desc: "Deliver courses and guides after signup." },
  { title: "Marketing", desc: "Boost conversions with action-gated offers." },
];

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-wider text-center glow-text mb-12">USE CASES</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {cases.map((c) => (
          <RetroCard key={c.title}>
            <h3 className="font-display text-lg tracking-wider">{c.title}</h3>
            <p className="mt-2 text-sm text-retro-text-dim">{c.desc}</p>
          </RetroCard>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/sign-up"><RetroButton size="lg">GET STARTED</RetroButton></Link>
      </div>
    </div>
  );
}
