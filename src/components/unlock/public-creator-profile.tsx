"use client";

import { getBadgeLabel, type ProfileSettings, type SocialLinks } from "@/lib/profile-settings";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type PublicCreatorLink = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  viewCount: number;
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
}) {
  const name = displayName || username;
  const style = profileSettings.style;
  const bgStyle = profileSettings.bgUrl
    ? {
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.45)), url(${profileSettings.bgUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : undefined;

  return (
    <div className="public-creator-page classic-shell unlock-v2 bg-retro-bg">
      <header className="border-b-[3px] border-[#0a0a0a] bg-retro-surface shrink-0">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-sm font-bold text-retro-text hover:text-retro-accent">
            Linklock
          </Link>
          <Link href="/sign-up" className="text-sm font-bold text-retro-accent hover:underline">
            Create your link
          </Link>
        </div>
      </header>

      <section
        className={cn("public-creator-hero", `public-creator-hero--${style}`, "relative")}
        style={bgStyle}
      >
        <div className="public-creator-hero-overlay" aria-hidden />
        <div className="public-creator-hero-content">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl mx-auto mb-4 object-cover border-[3px] border-white/90 shadow-lg"
              unoptimized
            />
          ) : (
            <div className="profile-preview-avatar-fallback mx-auto mb-4 h-24 w-24 text-2xl">{name.slice(0, 1).toUpperCase()}</div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{name}</h1>
          <p className="text-sm text-white/70 mt-1">@{username}</p>
          {bio ? <p className="mt-4 text-sm md:text-base text-white/85 leading-relaxed max-w-md mx-auto">{bio}</p> : null}
          {badgeIds.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {badgeIds.map((id) => {
                const badge = getBadgeLabel(id);
                if (!badge) return null;
                return (
                  <span key={id} className="profile-badge">
                    {badge.emoji} {badge.label}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <main className="public-creator-body">
        <h2 className="font-display text-[0.5rem] md:text-[0.5625rem] uppercase text-retro-text-muted mb-4">
          Unlock links
        </h2>
        {links.length === 0 ? (
          <p className="text-sm text-retro-text-dim">No published links yet.</p>
        ) : (
          <ul className="space-y-3">
            {links.map((link) => {
              const href = `${siteUrl}/u/${username}/${link.slug}`;
              return (
                <li key={link.id}>
                  <Link
                    href={href}
                    className="retro-panel p-4 flex items-center gap-4 hover:border-retro-accent transition-colors block"
                  >
                    <div className="h-10 w-10 rounded-lg bg-retro-accent/15 flex items-center justify-center shrink-0 border-2 border-[#0a0a0a]">
                      <Lock size={18} className="text-retro-accent" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="font-semibold text-retro-text truncate">{link.title}</p>
                      {link.description ? (
                        <p className="text-xs text-retro-text-muted mt-0.5 line-clamp-2">{link.description}</p>
                      ) : null}
                      <p className="text-xs text-retro-text-dim mt-1">{formatNumber(link.viewCount)} views</p>
                    </div>
                    <ExternalLink size={16} className="text-retro-text-muted shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
