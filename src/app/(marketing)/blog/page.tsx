import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog" };

const posts = [
  { slug: "introducing-repassub", title: "Introducing Repassub", date: "2026-01-15", excerpt: "The retro creator unlock platform is here." },
  { slug: "unlock-best-practices", title: "Unlock Best Practices", date: "2026-02-01", excerpt: "Tips for maximizing your unlock conversion rates." },
  { slug: "action-gating-guide", title: "Action Gating Guide", date: "2026-02-20", excerpt: "How to choose the right actions for your audience." },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-wider glow-text mb-12">BLOG</h1>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="retro-panel p-6 hover:-translate-y-0.5 transition-transform block">
            <p className="text-xs text-retro-text-dim">{post.date}</p>
            <h2 className="font-display text-lg tracking-wider mt-1">{post.title}</h2>
            <p className="text-sm text-retro-text-dim mt-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
