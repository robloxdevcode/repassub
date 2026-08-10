import Link from "next/link";
import { RetroButton, RetroCard } from "@/components/retro";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Examples",
  description: "See how creators use Linklock unlock links for preset packs, Discord joins, and subscribe-to-download flows.",
  path: "/examples",
});

const examples = [
  { title: "FREE PRESET PACK", desc: "Music producer shares sample pack after YouTube subscribe.", actions: ["Subscribe"] },
  { title: "EXCLUSIVE GUIDE", desc: "Creator shares PDF guide after email signup.", actions: ["Email"] },
  { title: "DISCORD ACCESS", desc: "Community owner gates invite link behind join action.", actions: ["Join Community"] },
  { title: "AFFILIATE LINK", desc: "Marketer shares deal after page visit confirmation.", actions: ["Visit Page"] },
];

export default function ExamplesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-wider text-center glow-text mb-12">EXAMPLES</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {examples.map((ex) => (
          <RetroCard key={ex.title}>
            <h3 className="font-display text-lg tracking-wider text-retro-glow">{ex.title}</h3>
            <p className="mt-2 text-sm text-retro-text-dim">{ex.desc}</p>
            <div className="mt-4 flex gap-2">
              {ex.actions.map((a) => (
                <span key={a} className="font-display text-xs border border-retro-border-dim px-2 py-1 text-retro-text-dim">
                  {a}
                </span>
              ))}
            </div>
          </RetroCard>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/sign-up"><RetroButton size="lg">CREATE YOUR OWN</RetroButton></Link>
      </div>
    </div>
  );
}
