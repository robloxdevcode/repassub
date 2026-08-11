import Link from "next/link";
import type { Metadata } from "next";
import { RetroButton } from "@/components/retro";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-retro-bg">
      <div className="text-center">
        <p className="font-display text-6xl font-bold text-retro-accent">404</p>
        <h1 className="font-display text-xl font-bold mt-4">Page not found</h1>
        <p className="text-retro-text-dim mt-2 text-sm">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="inline-block mt-8">
          <RetroButton>Back to home</RetroButton>
        </Link>
      </div>
    </div>
  );
}
