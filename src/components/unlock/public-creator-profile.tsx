"use client";

import { getBadgeLabel, type ProfileSettings, type SocialLinks } from "@/lib/profile-settings";
import { StaffRoleBadge, StaffVerifiedMark } from "@/components/brand/staff-verified-mark";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { ProfileHeroPanLayer } from "@/components/profile/profile-hero-pan-layer";
import { ShareProfileButton } from "@/components/unlock/share-profile-button";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Lock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type PublicCreatorLink = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  viewCount: number;
};

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  youtube: "YouTube",
  discord: "Discord",
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "X",
  twitch: "Twitch",
};

export function PublicCreatorProfile({
  username,
  displayName,
  bio,
  avatarUrl,
  badgeIds,
  links,
  siteUrl,
  profileSettings,
  isOwner = false,
}: {
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  badgeIds: string[];
  links: PublicCreatorLink[];
  siteUrl: string;
  isPro?: boolean;
  profileSettings: ProfileSettings;
  isOwner?: boolean;
}) {
  const name = displayName || username;
  const style = profileSettings.style;
  const profileUrl = `${siteUrl}/u/${username}`;
  const socialEntries = (Object.entries(profileSettings.socials) as [keyof SocialLinks, string | undefined][]).filter(
    ([, url]) => typeof url === "string" && url.trim().length > 0,
  );

  return (
    <div className="public-creator-page classic-shell unlock-v2 bg-retro-bg">
      <header className="public-creator-topbar shrink-0">
        <div className="public-creator-topbar-inner">
          <Link href="/" className="public-creator-brand" prefetch>
            <LinklockLogo size={34} />
          </Link>
          <Link href={isOwner ? "/create" : "/sign-up"} className="public-creator-top-cta" prefetch>
            {isOwner ? "New link" : "Create your link"}
          </Link>
        </div>
      </header>

      <section className={cn("public-creator-hero", "relative")}>
        <ProfileHeroPanLayer style={style} bgUrl={profileSettings.bgUrl} />
        <div className="public-creator-hero-overlay" aria-hidden />
        <div className="public-creator-hero-content">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={112}
              height={112}
              className="public-creator-avatar mx-auto mb-4 object-cover"
              unoptimized
            />
          ) : (
            <div className="profile-preview-avatar-fallback public-creator-avatar mx-auto mb-4 text-2xl">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <h1 className="public-creator-name">
            <span>{name}</span>
            {badgeIds.length > 0 ? (
              <StaffVerifiedMark className="h-6 w-6 text-emerald-400 drop-shadow" title="Verified Linklock staff" />
            ) : null}
          </h1>
          <p className="text-sm text-white/70 mt-1">@{username}</p>
          {bio ? <p className="public-creator-bio">{bio}</p> : null}
          <ShareProfileButton url={profileUrl} title={`${name} on Linklock`} className="mt-4" />
          {socialEntries.length > 0 ? (
            <ul className="public-creator-socials">
              {socialEntries.map(([key, url]) => (
                <li key={key}>
                  <a href={url!} target="_blank" rel="noopener noreferrer" className="public-creator-social-link">
                    {SOCIAL_LABELS[key]}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {badgeIds.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {badgeIds.map((id) => {
                const badge = getBadgeLabel(id);
                if (!badge) return null;
                return <StaffRoleBadge key={id} label={badge.label} />;
              })}
            </div>
          ) : null}
        </div>
      </section>

      <main className="public-creator-body">
        <h2 className="public-creator-section-title">Unlock links</h2>
        {links.length === 0 ? (
          <div className="public-creator-empty">
            <p className="font-bold text-retro-text">No published links yet</p>
            <p className="text-sm text-retro-text-dim mt-2 leading-relaxed">
              {isOwner
                ? "Publish your first unlock link and it will appear here for fans."
                : `When ${username} publishes unlock pages, they will show up here.`}
            </p>
            {isOwner ? (
              <Link href="/create" prefetch className="public-creator-empty-cta">
                <Plus size={16} aria-hidden />
                Create your first link
              </Link>
            ) : null}
          </div>
        ) : (
          <ul className="public-creator-link-list">
            {links.map((link) => {
              const href = `${siteUrl}/u/${username}/${link.slug}`;
              return (
                <li key={link.id}>
                  <Link href={href} className="public-creator-link-card">
                    <div className="public-creator-link-icon" aria-hidden>
                      <Lock size={18} className="text-retro-accent" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="font-semibold text-retro-text truncate">{link.title}</p>
                      {link.description ? (
                        <p className="text-xs text-retro-text-muted mt-0.5 line-clamp-2">{link.description}</p>
                      ) : null}
                      <p className="text-xs text-retro-text-dim mt-1">{formatNumber(link.viewCount)} views</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <footer className="public-creator-footer">
        <p>
          Powered by{" "}
          <Link href="/" className="font-bold text-retro-accent hover:underline">
            Linklock
          </Link>
        </p>
      </footer>
    </div>
  );
}
