import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description: "Linklock creator tips — unlock links, subscribe-to-download strategy, and growth guides.",
  path: "/blog",
});

export default function BlogPage() {  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-wider glow-text mb-12">BLOG</h1>
      <div className="flex flex-col gap-6">
        {BLOG_POSTS.map((post) => (
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
