import { notFound } from "next/navigation";
import { PublicCreatorProfile } from "@/components/unlock/public-creator-profile";
import { getPublicCreatorProfile } from "@/lib/public-profile";
import { getRequestSiteUrl } from "@/lib/site-url";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getPublicCreatorProfile(username);
  if (!profile) return { title: "Creator not found" };
  const name = profile.user.displayName || profile.user.username;
  return buildPageMetadata({
    title: `${name} — Linklock`,
    description: `Unlock links by ${name} on Linklock.`,
    path: `/u/${profile.user.username}`,
  });
}

export default async function PublicCreatorPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const [profile, siteUrl] = await Promise.all([
    getPublicCreatorProfile(username),
    getRequestSiteUrl(),
  ]);

  if (!profile) notFound();

  return (
    <PublicCreatorProfile
      username={profile.user.username}
      displayName={profile.user.displayName}
      bio={profile.user.bio}
      avatarUrl={profile.user.avatarUrl}
      badgeIds={profile.badgeIds}
      links={profile.links}
      siteUrl={siteUrl}
      isPro={profile.plan === "PRO" || profile.plan === "BUSINESS"}
    />
  );
}
