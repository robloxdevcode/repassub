import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { TestimonialsSection } from "@/components/marketing/rekonise-sections";
import { RetroButton, RetroLink } from "@/components/retro";
import { Music, Package, Palette, Video, Users } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "For Creators — Gate Downloads, Grow Your Audience",
  description:
    "Preset packs, beats, mods, tutorials — Linklock helps creators gate files behind subscribe, follow, and join steps. Unlimited free links.",
  path: "/creators",
});

const PERSONAS = [
  {
    icon: Palette,
    title: "Preset & overlay sellers",
    desc: "Gate LUTs and packs behind IG follow + YT sub. Share kit bio line in every drop.",
    href: "/use-cases/preset-packs",
  },
  {
    icon: Music,
    title: "Beat & sample producers",
    desc: "Trade a subscribe for your latest kit. Per-link stats show what converts.",
    href: "/use-cases/beat-packs",
  },
  {
    icon: Package,
    title: "Mod & resource pack devs",
    desc: "Discord join before the ZIP. One link in announcements.",
    href: "/use-cases/minecraft-mods",
  },
  {
    icon: Video,
    title: "YouTube tutorialists",
    desc: "Project files that actually grow subs — not raw Drive leaks.",
    href: "/use-cases/youtube-tutorials",
  },
  {
    icon: Users,
    title: "Community builders",
    desc: "Every file drop grows Discord. Public profile lists all your links.",
    href: "/use-cases/discord-community",
  },
];

export default function CreatorsPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-retro-accent mb-2">For creators</p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Your downloads should grow your channels</h1>
        <p className="text-lg text-retro-text-dim max-w-2xl mx-auto leading-relaxed mb-8">
          Linklock turns every free drop into follows, subs, and joins — without fan sign-ups or sketchy
          locker pages. Unlimited links on Free.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <MarketingAuthLink href="/sign-up">
            <RetroButton size="lg">Start free — unlimited links</RetroButton>
          </MarketingAuthLink>
          <RetroLink href="/grow" variant="secondary" size="lg">
            Copy-paste growth kit
          </RetroLink>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-bold text-center mb-8">Built for how you actually post</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PERSONAS.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="retro-panel p-5 hover:border-retro-accent transition-colors group"
            >
              <div className="h-10 w-10 rounded-lg bg-retro-accent/10 flex items-center justify-center mb-4 text-retro-accent">
                <p.icon size={20} />
              </div>
              <h3 className="font-bold mb-2 group-hover:text-retro-accent">{p.title}</h3>
              <p className="text-sm text-retro-text-dim leading-relaxed">{p.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <TestimonialsSection />

      <section className="mx-auto max-w-xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-3">Two minutes to your first link</h2>
        <p className="text-retro-text-dim mb-6">
          Paste your file URL → pick steps → publish → copy Share kit to your bio.
        </p>
        <MarketingAuthLink href="/sign-up">
          <RetroButton size="lg">Create free account</RetroButton>
        </MarketingAuthLink>
        <p className="mt-4 text-xs text-retro-text-muted">
          <Link href="/alternatives/rekonise" className="hover:text-retro-accent underline">
            Compare vs Rekonise
          </Link>
        </p>
      </section>
    </>
  );
}
