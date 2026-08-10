import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Documentation",
  description: "Linklock docs — create unlock links, add steps, customize pages, and track conversions.",
  path: "/docs",
});

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-wider glow-text mb-8">DOCS</h1>
      <div className="retro-panel p-8 prose prose-invert max-w-none">
        <h2 className="font-display text-lg tracking-wider text-retro-glow">Getting Started</h2>
        <p className="text-retro-text-dim mt-2">
          Welcome to Linklock! This guide will help you create your first unlock campaign.
        </p>
        <ol className="mt-4 flex flex-col gap-3 text-sm text-retro-text-dim list-decimal list-inside">
          <li><Link href="/sign-up" className="text-retro-glow hover:underline">Create an account</Link></li>
          <li>Navigate to Create Unlock in your dashboard</li>
          <li>Choose your content type (file, URL, or text)</li>
          <li>Select required actions for your audience</li>
          <li>Customize your unlock page appearance</li>
          <li>Publish and share your link</li>
        </ol>
        <h2 className="font-display text-lg tracking-wider text-retro-glow mt-8">Action Types</h2>
        <ul className="mt-4 flex flex-col gap-2 text-sm text-retro-text-dim">
          <li><strong className="text-retro-text">Follow</strong> — Manual confirmation for social follows</li>
          <li><strong className="text-retro-text">Subscribe</strong> — Manual confirmation for subscriptions</li>
          <li><strong className="text-retro-text">Join</strong> — Manual confirmation for community joins</li>
          <li><strong className="text-retro-text">Email</strong> — Collect email addresses</li>
          <li><strong className="text-retro-text">Visit</strong> — Track page visits with outbound links</li>
        </ul>
      </div>
    </div>
  );
}
