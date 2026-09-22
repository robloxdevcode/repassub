import { notFound, permanentRedirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { PublicCreatorProfile } from "@/components/unlock/public-creator-profile";
import { getPublicCreatorProfile } from "@/lib/public-profile";
import { getRequestSiteUrl } from "@/lib/site-url";
import { buildPageMetadata } from "@/lib/seo";
import { resolvePublicUsername } from "@/lib/username-resolve";
import { getCurrentUser } from "@/lib/auth";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const resolution = await resolvePublicUsername(username);
  const lookup = resolution.kind === "redirect" ? resolution.to : resolution.kind === "found" ? resolution.username : username;
  const profile = await getPublicCreatorProfile(lookup);
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
  const resolution = await resolvePublicUsername(username);

  if (resolution.kind === "redirect") {
    permanentRedirect(`/u/${resolution.to}`);
  }
  if (resolution.kind === "missing") notFound();

  const [profile, siteUrl] = await Promise.all([
    getPublicCreatorProfile(resolution.username),
    getRequestSiteUrl(),
  ]);

  if (!profile) notFound();

  const { userId } = await auth();
  let isOwner = false;
  if (userId) {
    const current = await getCurrentUser();
    isOwner =
      !!current?.username &&
      current.username.toLowerCase() === profile.user.username.toLowerCase();
  }

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
      profileSettings={profile.profileSettings}
      isOwner={isOwner}
    />
  );
}
