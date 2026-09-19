import { LeaderboardPageClient } from "@/components/marketing/leaderboard-page-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Weekly leaderboard — Linklock",
  description: "Top Linklock creators by fan unlocks this week. Opt in to compete.",
  path: "/leaderboard",
});

export default function LeaderboardPage() {
  return <LeaderboardPageClient />;
}
