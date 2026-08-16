"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { RetroButton, RetroInput, RetroTextarea } from "@/components/retro";
import { AppCard } from "@/components/dashboard/app-page-header";
import {
  DEFAULT_PROFILE_SETTINGS,
  getBadgeLabel,
  getEarnedBadges,
  OWNER_BADGES,
  PROFILE_STYLES,
  type MilestoneStats,
  type ProfileSettings,
  type SocialLinks,
} from "@/lib/profile-settings";
import { cn } from "@/lib/utils";

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@you" },
  { key: "discord", label: "Discord", placeholder: "https://discord.gg/..." },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/you" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@you" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/you" },
  { key: "twitch", label: "Twitch", placeholder: "https://twitch.tv/you" },
];

export function ProfileCustomization({
  displayName,
  username,
  bio,
  avatarUrl,
  settings,
  milestoneStats,
  onSave,
  saving,
}: {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string | null;
  settings: ProfileSettings;
  milestoneStats: MilestoneStats;
  onSave: (settings: ProfileSettings) => Promise<void>;
  saving: boolean;
}) {
  const [local, setLocal] = useState<ProfileSettings>(settings);

  const earned = useMemo(() => getEarnedBadges(milestoneStats), [milestoneStats]);
  const allBadges = useMemo(
    () => [...new Set([...earned, ...local.awardedBadges])],
    [earned, local.awardedBadges]
  );

  function toggleOwnerBadge(id: string) {
    setLocal((prev) => {
      const has = prev.awardedBadges.includes(id);
      return {
        ...prev,
        awardedBadges: has
          ? prev.awardedBadges.filter((b) => b !== id)
          : [...prev.awardedBadges, id],
      };
    });
  }

  async function handleSaveCustomization() {
    await onSave(local);
  }

  return (
    <div className="space-y-6">
      <AppCard className="overflow-hidden p-0">
        <div
          className={cn("profile-preview", `profile-preview--${local.style}`)}
          style={
            local.bgUrl
              ? { backgroundImage: `linear-gradient(rgba(7,7,13,0.72), rgba(7,7,13,0.88)), url(${local.bgUrl})` }
              : undefined
          }
        >
          <div className="profile-preview-inner">
            <div className="profile-preview-avatar">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-full object-cover" unoptimized />
              ) : (
                <span className="profile-preview-avatar-fallback">
                  {(displayName || username).charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-lg text-white truncate">{displayName || username}</p>
              <p className="text-sm text-white/60">@{username}</p>
              {bio ? <p className="mt-3 text-sm text-white/75 leading-relaxed line-clamp-3">{bio}</p> : null}
              {allBadges.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {allBadges.map((id) => {
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
          </div>
        </div>
      </AppCard>

      <AppCard className="p-6">
        <h2 className="text-base font-semibold text-retro-text mb-1">Profile style</h2>
        <p className="text-sm text-retro-text-dim mb-4">Pick a look for your public creator profile.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {PROFILE_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setLocal((p) => ({ ...p, style: style.id }))}
              className={cn(
                "profile-style-option",
                local.style === style.id && "profile-style-option--active"
              )}
            >
              <span className="font-medium text-retro-text">{style.label}</span>
              <span className="text-xs text-retro-text-muted mt-1 block">{style.desc}</span>
            </button>
          ))}
        </div>
      </AppCard>

      <AppCard className="p-6 flex flex-col gap-4">
        <RetroInput
          label="Profile background image URL"
          value={local.bgUrl || ""}
          onChange={(e) => setLocal((p) => ({ ...p, bgUrl: e.target.value || null }))}
          placeholder="https://... (any image link)"
        />
        <p className="text-xs text-retro-text-muted -mt-2">Paste a banner or game screenshot — shows behind your profile card.</p>
      </AppCard>

      <AppCard className="p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-retro-text">Social links</h2>
        <p className="text-sm text-retro-text-dim -mt-2 mb-1">Shown on your profile description area.</p>
        {SOCIAL_FIELDS.map((field) => (
          <RetroInput
            key={field.key}
            label={field.label}
            value={local.socials[field.key] || ""}
            onChange={(e) =>
              setLocal((p) => ({
                ...p,
                socials: { ...p.socials, [field.key]: e.target.value || undefined },
              }))
            }
            placeholder={field.placeholder}
          />
        ))}
      </AppCard>

      <AppCard className="p-6">
        <h2 className="text-base font-semibold text-retro-text mb-1">Badges</h2>
        <p className="text-sm text-retro-text-dim mb-4">
          Milestone badges unlock automatically. You can award custom badges on your own profile.
        </p>

        <p className="text-xs font-medium uppercase tracking-wide text-retro-text-muted mb-2">Earned from milestones</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {earned.length === 0 ? (
            <span className="text-sm text-retro-text-muted">Publish a link to earn your first badge.</span>
          ) : (
            earned.map((id) => {
              const badge = getBadgeLabel(id);
              if (!badge) return null;
              return (
                <span key={id} className="profile-badge profile-badge--earned">
                  {badge.emoji} {badge.label}
                </span>
              );
            })
          )}
        </div>

        <p className="text-xs font-medium uppercase tracking-wide text-retro-text-muted mb-2">Award on your profile</p>
        <div className="flex flex-wrap gap-2">
          {OWNER_BADGES.map((badge) => {
            const active = local.awardedBadges.includes(badge.id);
            return (
              <button
                key={badge.id}
                type="button"
                onClick={() => toggleOwnerBadge(badge.id)}
                className={cn("profile-badge profile-badge--toggle", active && "profile-badge--toggle-on")}
              >
                {badge.emoji} {badge.label}
              </button>
            );
          })}
        </div>
      </AppCard>

      <RetroButton onClick={handleSaveCustomization} loading={saving} className="w-full sm:w-auto">
        Save customization
      </RetroButton>
    </div>
  );
}

export { DEFAULT_PROFILE_SETTINGS };
