import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RetroButton } from "@/components/retro";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { buildPageMetadata } from "@/lib/seo";

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
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/blog" className="text-sm text-retro-glow hover:underline mb-8 inline-block">
        ← BACK TO BLOG
      </Link>
      <header>
        <time dateTime={post.date} className="text-xs text-retro-text-dim">
          {post.date}
        </time>
        <h1 className="font-display text-3xl tracking-wider glow-text mb-6 mt-2">{post.title}</h1>
      </header>
      <div className="retro-panel p-8 text-retro-text-dim text-sm leading-relaxed">
        <p>{post.excerpt}</p>
        <p className="mt-4">
          This is a starter blog post for SEO. Replace with full MDX content as your content strategy grows.
        </p>
      </div>
      <Link href="/sign-up" className="mt-8 inline-block">
        <RetroButton>START CREATING</RetroButton>
      </Link>
    </article>
  );
}
