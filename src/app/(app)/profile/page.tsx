"use client";

import { useState, useEffect } from "react";
import { RetroButton, RetroInput, RetroTextarea } from "@/components/retro";
import { useToast } from "@/components/retro";
import { updateProfile } from "@/lib/actions/campaigns";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { formatNumber } from "@/lib/utils";

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    _count?: { campaigns: number };
  } | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    getDashboardStats().then((s) => {
      setUser(s.user);
      setDisplayName(s.user.displayName || "");
      setBio(s.user.bio || "");
      setUsername(s.user.username);
    });
  }, []);

  async function handleSave() {
    setLoading(true);
    try {
      await updateProfile({ displayName, bio, username });
      toast("Profile updated!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Error updating profile", "error");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl tracking-wider mb-8">PLAYER PROFILE</h1>

      <div className="retro-panel p-6 mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-retro-glow bg-retro-accent font-display text-2xl overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              "★"
            )}
          </div>
          <div>
            <p className="font-display text-xl">{user.displayName || user.username}</p>
            <p className="text-sm text-retro-text-dim">@{user.username}</p>
            <p className="text-xs text-retro-text-dim mt-1">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="retro-panel-inner p-3 text-center">
            <p className="font-display text-2xl text-retro-glow">—</p>
            <p className="text-xs text-retro-text-dim mt-1">TOTAL UNLOCKS</p>
          </div>
          <div className="retro-panel-inner p-3 text-center">
            <p className="font-display text-2xl text-retro-glow">—</p>
            <p className="text-xs text-retro-text-dim mt-1">FOLLOWERS</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <RetroInput label="DISPLAY NAME" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <RetroInput label="USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} />
        <RetroTextarea label="BIO" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        <RetroButton onClick={handleSave} loading={loading}>EDIT PROFILE</RetroButton>
      </div>
    </div>
  );
}
