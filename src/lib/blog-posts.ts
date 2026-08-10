export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "introducing-linklock",
    title: "Introducing Linklock",
    date: "2026-01-15",
    excerpt: "The retro creator unlock platform is here.",
  },
  {
    slug: "unlock-best-practices",
    title: "Unlock Best Practices",
    date: "2026-02-01",
    excerpt: "Tips for maximizing your unlock conversion rates.",
  },
  {
    slug: "action-gating-guide",
    title: "Action Gating Guide",
    date: "2026-02-20",
    excerpt: "How to choose the right actions for your audience.",
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
