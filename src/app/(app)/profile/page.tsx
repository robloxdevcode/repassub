"use client";

import { useState, useEffect } from "react";
import { RetroButton, RetroInput, RetroTextarea, RetroLoading } from "@/components/retro";
import { useToast } from "@/components/retro";
import { updateProfile } from "@/lib/actions/campaigns";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { ProfileAvatarField } from "@/components/dashboard/profile-avatar-field";
import { ProfileCustomization } from "@/components/dashboard/profile-customization";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { loadProfileSettings, saveProfileSettings } from "@/lib/profile-settings-storage";
import type { ProfileSettings } from "@/lib/profile-settings";
import { isProPlanName } from "@/components/dashboard/plan-badge";

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [customSaving, setCustomSaving] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: Date;
  } | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileSettings, setProfileSettings] = useState<ProfileSettings | null>(null);
  const [milestoneStats, setMilestoneStats] = useState({
    publishedLinks: 0,
    totalUnlocks: 0,
    isPro: false,
  });
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then((s) => {
        setUser(s.user);
        setDisplayName(s.user.displayName || "");
        setBio(s.user.bio || "");
        setUsername(s.user.username);
        setAvatarUrl(s.user.avatarUrl);
        setProfileSettings(loadProfileSettings(s.user.username));
        setMilestoneStats({
          publishedLinks: s.campaignCount,
          totalUnlocks: s.analytics.unlocked,
          isPro: isProPlanName(s.plan),
        });
      })
      .catch((e) => {
        setLoadError(e instanceof Error ? e.message : "Could not load profile");
      });
  }, []);

  async function handleSave() {
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

  async function handleSaveCustomization(settings: ProfileSettings) {
    setCustomSaving(true);
    try {
      saveProfileSettings(username, settings);
      setProfileSettings(settings);
      toast("Profile look saved on this device", "success");
    } finally {
      setCustomSaving(false);
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl">
        <AppPageHeader title="Profile" subtitle="Customize how you show up to your fans." />
        <AppCard className="p-6 text-sm text-retro-error">{loadError}</AppCard>
      </div>
    );
  }

  if (!user || !profileSettings) {
    return (
      <div className="mx-auto max-w-2xl">
        <AppPageHeader title="Profile" subtitle="Customize how you show up to your fans." />
        <AppCard className="p-6">
          <RetroLoading message="Loading profile..." />
        </AppCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <AppPageHeader
        title="Profile"
        subtitle="Customize your profile however you want — photo, banner, socials, and badges."
      />

      <AppCard className="p-6 mb-6" accent="blue">
        <ProfileAvatarField
          avatarUrl={avatarUrl}
          displayName={displayName || user.displayName}
          username={username}
          onUpdated={setAvatarUrl}
        />
      </AppCard>

      <AppCard className="p-6 flex flex-col gap-4 mb-8">
        <RetroInput label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <RetroInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <RetroTextarea
          label="Bio — add socials & links in your description"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Producer · Discord below · New pack every Friday"
        />
        <RetroButton onClick={handleSave} loading={loading} className="w-full sm:w-auto self-start">
          Save profile
        </RetroButton>
      </AppCard>

      <ProfileCustomization
        displayName={displayName}
        username={username}
        bio={bio}
        avatarUrl={avatarUrl}
        settings={profileSettings}
        milestoneStats={milestoneStats}
        onSave={handleSaveCustomization}
        saving={customSaving}
      />
    </div>
  );
}
