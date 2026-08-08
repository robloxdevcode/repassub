import type { Metadata } from "next";
import Link from "next/link";
import { RetroButton } from "@/components/retro";

export const metadata: Metadata = { title: "Blog Post" };

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/blog" className="text-sm text-retro-glow hover:underline mb-8 inline-block">
        ← BACK TO BLOG
      </Link>
      <h1 className="font-display text-3xl tracking-wider glow-text mb-6">{title}</h1>
      <div className="retro-panel p-8 text-retro-text-dim text-sm leading-relaxed">
        <p>This is a starter blog post for SEO. Replace with full MDX content as your content strategy grows.</p>
      </div>
      <Link href="/sign-up" className="mt-8 inline-block">
        <RetroButton>START CREATING</RetroButton>
      </Link>
    </div>
  );
}
