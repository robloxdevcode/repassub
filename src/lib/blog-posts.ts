export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "introducing-linklock",
    title: "Introducing Linklock — Free Subscribe-to-Download Links",
    date: "2026-01-15",
    excerpt:
      "Linklock lets creators gate downloads behind follow, subscribe, and join steps across 70+ platforms. Free to start.",
    body: [
      "Linklock is a subscribe-to-download tool built for creators who want growth without complicated setup. Paste your file link, add the steps fans must complete, and share one URL everywhere.",
      "Unlike heavy content lockers, Linklock keeps the fan experience clean: a short checklist, a progress bar, and instant unlock when steps are done. You keep hosting files on your own links — we never store your downloads.",
      "The free plan includes 5 links per week with 2 steps each. Pro removes ads, unlocks unlimited links, custom branding, and advanced analytics.",
      "Whether you share preset packs, mod files, guides, or invite links, Linklock turns every download into a chance to grow your audience.",
    ],
  },
  {
    slug: "unlock-best-practices",
    title: "Unlock Link Best Practices for Higher Conversion",
    date: "2026-02-01",
    excerpt:
      "How to choose steps, write button labels, and place your unlock link for the best subscribe-to-download conversion.",
    body: [
      "The best unlock pages use 1–2 clear steps instead of long checklists. Ask for one high-value action — follow, subscribe, or join — then deliver the file immediately.",
      "Write button labels in plain language fans understand: \"Subscribe to my channel\" beats vague text. Match the label to the platform you paste in the step URL.",
      "Place your link where intent is highest: video descriptions, pinned comments, bio links, and community announcements. One link everywhere is easier to track than different URLs per platform.",
      "Use a short page title that states the reward: \"Free drum kit\" or \"Exclusive preset pack.\" Fans should know what they get before they start.",
      "Check your stats weekly. Links with views but low unlocks often mean the steps are too hard or the reward is unclear — tweak one thing at a time.",
    ],
  },
  {
    slug: "action-gating-guide",
    title: "Action Gating Guide — Pick the Right Steps for Your Audience",
    date: "2026-02-20",
    excerpt:
      "Subscribe, follow, join, or visit — how to pick unlock steps that grow your audience without frustrating fans.",
    body: [
      "Action gating means fans complete a task before accessing your content. Linklock supports 70+ platforms so you can match steps to where your audience already lives.",
      "For video creators, a subscribe step plus a like or notification reminder converts well. For communities, a single join step is often enough.",
      "Free accounts can add 2 steps per link; Pro allows 4 for deeper funnels. Start simple — you can always duplicate a winning link and experiment.",
      "Avoid steps that feel unrelated to the reward. If you offer a music pack, asking fans to join your community is fine; asking for unrelated actions hurts trust.",
      "Test on mobile. Most fans open bio and description links on phones — keep titles short and buttons easy to tap.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
