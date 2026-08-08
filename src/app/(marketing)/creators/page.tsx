import Link from "next/link";
import { RetroButton } from "@/components/retro";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "For Creators" };

export default function CreatorsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="font-display text-4xl tracking-wider glow-text mb-6">FOR CREATORS</h1>
      <p className="text-lg text-retro-text-dim mb-8">
        Whether you&apos;re a YouTuber, musician, artist, or community builder — Repassub helps you
        turn engagement into rewards.
      </p>
      <Link href="/sign-up"><RetroButton size="lg">START CREATING</RetroButton></Link>
    </div>
  );
}
