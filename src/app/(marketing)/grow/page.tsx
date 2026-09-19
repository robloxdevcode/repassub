import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { GrowPageClient } from "@/components/marketing/grow-page-client";

export const metadata: Metadata = buildPageMetadata({
  title: "Creator Growth Kit — Copy-Paste Templates",
  description:
    "DM templates, TikTok hooks, bio lines, and Reddit posts to promote your Linklock unlock links.",
  path: "/grow",
});

export default async function GrowPage() {
  const { userId } = await auth();
  return <GrowPageClient signedIn={!!userId} />;
}
