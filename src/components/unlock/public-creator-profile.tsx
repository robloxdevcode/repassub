"use client";

import { getBadgeLabel } from "@/lib/profile-settings";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink, Lock } from "lucide-react";

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
  isPro,
}: {
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  badgeIds: string[];
  links: PublicCreatorLink[];
  siteUrl: string;
  isPro: boolean;
}) {
  const name = displayName || username;

  return (
    <div className="classic-shell unlock-v2 min-h-screen bg-retro-bg">
      <header className="border-b-[3px] border-[#0a0a0a] bg-retro-surface">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="text-sm font-semibold text-retro-text hover:text-retro-accent">
            Linklock
          </Link>
          <Link href="/sign-up" className="text-sm font-semibold text-retro-accent hover:underline">
            Create your link
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="retro-panel p-6 md:p-8 mb-8 text-center">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-20 w-20 rounded-2xl mx-auto mb-4 object-cover brutal-border" />
          ) : (
            <div className="h-20 w-20 rounded-2xl mx-auto mb-4 brutal-border bg-retro-yellow flex items-center justify-center font-display text-2xl">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-bold text-retro-text">{name}</h1>
          <p className="text-sm text-retro-text-muted mt-1">@{username}</p>
          {isPro ? (
            <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-retro-accent/15 text-retro-accent">
              Pro creator
            </span>
          ) : null}
          {bio ? <p className="mt-4 text-sm text-retro-text-dim leading-relaxed">{bio}</p> : null}

          {badgeIds.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {badgeIds.map((id) => {
                const badge = getBadgeLabel(id);
                if (!badge) return null;
                return (
                  <span key={id} className="profile-badge profile-badge--earned">
                    {badge.emoji} {badge.label}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>

        <h2 className="text-sm font-semibold uppercase tracking-wide text-retro-text-muted mb-4">
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
                    <div className="h-10 w-10 rounded-lg bg-retro-accent/15 flex items-center justify-center shrink-0">
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
