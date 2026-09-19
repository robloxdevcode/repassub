import { BLOG_POSTS } from "@/lib/blog-posts";
import { absoluteUrl } from "@/lib/seo";

export function GET() {
  const items = BLOG_POSTS.map((post) => {
    const url = absoluteUrl(`/blog/${post.slug}`);
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`;
  }).join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Linklock Blog</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>Subscribe-to-download tips, creator growth, and Linklock updates.</description>
    <language>en-us</language>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
