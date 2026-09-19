import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RetroButton } from "@/components/retro";
import { JsonLd } from "@/components/marketing/json-ld";
import { SeoBreadcrumbs } from "@/components/marketing/seo-breadcrumbs";
import { SeoInternalLinks } from "@/components/marketing/seo-internal-links";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { articleJsonLd, breadcrumbJsonLd, buildPageMetadata, DEFAULT_KEYWORDS } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found", robots: { index: false, follow: false } };

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    openGraphType: "article",
    publishedTime: post.date,
    keywords: [...(post.keywords ?? []), ...DEFAULT_KEYWORDS.slice(0, 8)],
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <JsonLd
        data={[
          articleJsonLd({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            datePublished: post.date,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <SeoBreadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <header>
        <time dateTime={post.date} className="text-xs text-retro-text-dim">
          {post.date}
        </time>
        <h1 className="font-display text-3xl tracking-wider glow-text mb-6 mt-2">{post.title}</h1>
        <p className="text-retro-text-dim text-sm leading-relaxed">{post.excerpt}</p>
      </header>

      <div className="retro-panel p-8 text-retro-text-dim text-sm leading-relaxed mt-8 space-y-4">
        {post.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <Link href="/sign-up" className="mt-8 inline-block">
        <RetroButton>Start free — create your unlock link</RetroButton>
      </Link>

      <SeoInternalLinks title="Related guides" />
    </article>
  );
}
