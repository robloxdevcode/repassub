"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StaffRole, UserRole } from "@prisma/client";
import { RetroButton, RetroInput, RetroTextarea } from "@/components/retro";
import { getBadgeLabel, PROFILE_STYLES, type ProfileSettings, type SocialLinks } from "@/lib/profile-settings";
import { getStaffProfileBadgeIds } from "@/lib/admin-access";
import { cn } from "@/lib/utils";
import { ProfileAvatarField } from "@/components/dashboard/profile-avatar-field";
import { AppPageHeader } from "@/components/dashboard/app-page-header";
import {
  getProfileCustomization,
  updateProfile,
  updateProfileCustomization,
} from "@/lib/actions/campaigns";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { useToast } from "@/components/retro";
import { RetroLoading } from "@/components/retro";

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@you" },
  { key: "discord", label: "Discord", placeholder: "https://discord.gg/..." },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/you" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@you" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/you" },
  { key: "twitch", label: "Twitch", placeholder: "https://twitch.tv/you" },
];

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [customSaving, setCustomSaving] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
  } | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [local, setLocal] = useState<ProfileSettings | null>(null);
  const [access, setAccess] = useState<{ role: UserRole; staffRole: StaffRole } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getDashboardStats(), getProfileCustomization()])
      .then(([s, customization]) => {
        setUser(s.user);
        setDisplayName(s.user.displayName || "");
        setBio(s.user.bio || "");
        setUsername(s.user.username);
        setAvatarUrl(s.user.avatarUrl);
        setLocal(customization.settings);
        setAccess({ role: customization.role, staffRole: customization.staffRole });
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Could not load profile"));
  }, []);

  const previewBadges = useMemo(
    () => (access ? getStaffProfileBadgeIds(access) : []),
    [access],
  );

  const previewBg = local?.bgUrl
    ? {
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.4)), url(${local.bgUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : undefined;

  async function handleSaveProfile() {
    setLoading(true);
    try {
      await updateProfile({ displayName, bio, username, avatarUrl });
      toast("Profile saved", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save profile", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveLook() {
    if (!local) return;
    setCustomSaving(true);
    try {
      await updateProfileCustomization(local);
      toast("Look saved — live on your public page", "success");
    } catch {
      toast("Could not save look", "error");
    } finally {
      setCustomSaving(false);
    }
  }

  if (loadError) {
    return (
      <div className="profile-page-layout p-4">
        <AppPageHeader title="Profile" subtitle="Customize how fans see you." />
        <p className="text-sm text-retro-error">{loadError}</p>
      </div>
    );
  }

  if (!user || !local) {
    return (
      <div className="profile-page-layout p-4">
        <AppPageHeader title="Profile" subtitle="Customize how fans see you." />
        <RetroLoading message="Loading" />
      </div>
    );
  }

  return (
    <div className="profile-page-layout pb-12">
      <div className="px-4 md:px-0 mb-6">
        <AppPageHeader
          title="Profile"
          subtitle="Your public page updates live when you save."
          action={{ href: `/u/${username}`, label: "View public page" }}
        />
      </div>

      <div className="profile-page-preview-bleed mb-8">
        <div className={cn("profile-preview", `profile-preview--${local.style}`)} style={previewBg}>
          <div className="profile-preview-inner">
            <div className="profile-preview-avatar">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  width={88}
                  height={88}
                  className="h-[88px] w-[88px] rounded-2xl object-cover border-[3px] border-white/90"
                  unoptimized
                />
              ) : (
                <span className="profile-preview-avatar-fallback">
                  {(displayName || username).charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1 text-left pb-1">
              <p className="font-bold text-xl md:text-2xl text-white truncate">{displayName || username}</p>
              <p className="text-sm text-white/65">@{username}</p>
              {bio ? <p className="mt-2 text-sm text-white/80 leading-relaxed line-clamp-3">{bio}</p> : null}
              {previewBadges.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {previewBadges.map((id) => {
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
      </div>

      <div className="px-4 md:px-0 space-y-5">
        <div className="profile-custom-panel">
          <h2 className="font-bold text-retro-text mb-1">Profile style</h2>
          <p className="text-sm text-retro-text-dim mb-4">Tap a theme — preview updates instantly above.</p>
          <div className="profile-style-grid">
            {PROFILE_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setLocal((p) => (p ? { ...p, style: style.id } : p))}
                className={cn(
                  "profile-style-option",
                  local.style === style.id && "profile-style-option--active",
                )}
              >
                <span className={cn("profile-style-swatch", `profile-style-swatch--${style.id}`)} aria-hidden />
                <span className="font-bold text-sm text-retro-text">{style.label}</span>
                <span className="text-xs text-retro-text-muted leading-snug">{style.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="profile-custom-panel">
          <RetroInput
            label="Background image URL"
            value={local.bgUrl || ""}
            onChange={(e) => setLocal((p) => (p ? { ...p, bgUrl: e.target.value.trim() || null } : p))}
            placeholder="https://... (cover photo behind your profile)"
          />
          <p className="text-xs text-retro-text-muted mt-2">
            Paste any image link — it fills the hero on{" "}
            <Link href={`/u/${username}`} className="text-retro-accent underline" target="_blank">
              /u/{username}
            </Link>
            .
          </p>
        </div>

        <div className="profile-custom-panel flex flex-col gap-4">
          <ProfileAvatarField
            avatarUrl={avatarUrl}
            displayName={displayName || user.displayName}
            username={username}
            onUpdated={setAvatarUrl}
          />
          <RetroInput label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <RetroInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <RetroTextarea
            label="Bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Producer · Discord in bio · New pack every Friday"
          />
          <RetroButton onClick={handleSaveProfile} loading={loading} className="w-full sm:w-auto self-start">
            Save name &amp; bio
          </RetroButton>
        </div>

        <div className="profile-custom-panel">
          <h2 className="font-bold text-retro-text mb-3">Social links</h2>
          <div className="flex flex-col gap-3">
            {SOCIAL_FIELDS.map((field) => (
              <RetroInput
                key={field.key}
                label={field.label}
                value={local.socials[field.key] || ""}
                onChange={(e) =>
                  setLocal((p) =>
                    p
                      ? {
                          ...p,
                          socials: { ...p.socials, [field.key]: e.target.value || undefined },
                        }
                      : p,
                  )
                }
                placeholder={field.placeholder}
              />
            ))}
          </div>
        </div>

        {previewBadges.length > 0 ? (
          <div className="profile-custom-panel">
            <h2 className="font-bold text-retro-text mb-2">Staff badge</h2>
            <p className="text-sm text-retro-text-muted mb-3">
              Shown on your public profile automatically from your team role.
            </p>
            <div className="flex flex-wrap gap-2">
              {previewBadges.map((id) => {
                const badge = getBadgeLabel(id);
                if (!badge) return null;
                return (
                  <span key={id} className="profile-badge profile-badge--earned">
                    {badge.emoji} {badge.label}
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}

        <RetroButton onClick={handleSaveLook} loading={customSaving} size="lg" className="w-full sm:w-auto">
          Save look to public page
        </RetroButton>
      </div>
    </div>
  );
}
