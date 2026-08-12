"use client";

import { useState, useEffect } from "react";
import { RetroButton, RetroInput, RetroTextarea, RetroLoading } from "@/components/retro";
import { useToast } from "@/components/retro";
import { updateProfile } from "@/lib/actions/campaigns";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { ProfileAvatarField } from "@/components/dashboard/profile-avatar-field";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then((s) => {
        setUser(s.user);
        setDisplayName(s.user.displayName || "");
        setBio(s.user.bio || "");
        setUsername(s.user.username);
        setAvatarUrl(s.user.avatarUrl);
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

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl">
        <AppPageHeader title="Profile" subtitle="Your name and photo show on unlock pages." />
        <AppCard className="p-6 text-sm text-retro-error">{loadError}</AppCard>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl">
        <AppPageHeader title="Profile" subtitle="Your name and photo show on unlock pages." />
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
        subtitle="Your name and photo show on unlock pages."
      />

      <AppCard className="p-6 mb-6" accent="yellow">
        <ProfileAvatarField
          avatarUrl={avatarUrl}
          displayName={displayName || user.displayName}
          username={username}
          onUpdated={setAvatarUrl}
        />
      </AppCard>

      <AppCard className="p-6 flex flex-col gap-4">
        <RetroInput label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <RetroInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <RetroTextarea label="Bio (optional)" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        <RetroButton onClick={handleSave} loading={loading} className="w-full sm:w-auto self-start">
          Save profile
        </RetroButton>
      </AppCard>
    </div>
  );
}
