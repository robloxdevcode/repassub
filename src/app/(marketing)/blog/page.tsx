import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata, itemListJsonLd } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { JsonLd } from "@/components/marketing/json-ld";
import { SeoInternalLinks } from "@/components/marketing/seo-internal-links";

export const metadata: Metadata = buildPageMetadata({
  title: "Creator Blog — Unlock Links & Growth Guides",
  description:
    "Linklock blog: subscribe-to-download guides, Rekonise alternatives, TikTok follow gates, preset pack downloads, and creator growth tips.",
  path: "/blog",
  keywords: [
    "subscribe to download blog",
    "unlock link guide",
    "rekonise alternative",
    "content gating tips",
    "creator growth",
  ],
});

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <JsonLd
        data={itemListJsonLd(
          BLOG_POSTS.map((post) => ({ name: post.title, path: `/blog/${post.slug}` }))
        )}
      />
      <p className="text-xs font-semibold uppercase tracking-wider text-retro-accent mb-2">Blog</p>
      <h1 className="font-display text-4xl tracking-wider glow-text mb-4">Creator guides</h1>
      <p className="text-sm text-retro-text-dim mb-12 max-w-2xl leading-relaxed">
        SEO-friendly guides on subscribe-to-download links, link-in-bio unlocks, preset packs, and
        alternatives to legacy content lockers.
      </p>
      <div className="flex flex-col gap-6">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="retro-panel p-6 hover:-translate-y-0.5 transition-transform block"
          >
            <p className="text-xs text-retro-text-dim">{post.date}</p>
            <h2 className="font-display text-lg tracking-wider mt-1">{post.title}</h2>
            <p className="text-sm text-retro-text-dim mt-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
      <SeoInternalLinks />
    </div>
  );
}
