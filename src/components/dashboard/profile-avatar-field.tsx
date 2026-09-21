"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { RetroButton } from "@/components/retro";
import { useToast } from "@/components/retro";
import { updateProfile } from "@/lib/actions/campaigns";

export function ProfileAvatarField({
  avatarUrl,
  displayName,
  username,
  onUpdated,
}: {
  avatarUrl: string | null;
  displayName: string | null;
  username: string;
  onUpdated: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(avatarUrl);

  useEffect(() => {
    setPreview(avatarUrl);
  }, [avatarUrl]);

  const initials = (displayName || username).slice(0, 1).toUpperCase();

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast("Image must be under 5MB", "error");
      return;
    }

    setUploading(true);
    try {
      if (!user) throw new Error("Sign in to change your photo");

      const result = await user.setProfileImage({ file });
      await user.reload();
      const publicUrl = result.publicUrl ?? user.imageUrl ?? preview;

      if (!publicUrl) throw new Error("Could not save photo");

      const save = await updateProfile({ avatarUrl: publicUrl });
      if (!save.ok) {
        toast(save.message, "error");
        return;
      }
      setPreview(publicUrl);
      onUpdated(publicUrl);
      toast("Profile photo updated", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not update photo", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        <div className="h-20 w-20 brutal-border bg-retro-surface-2 overflow-hidden flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-xl text-retro-accent">{initials}</span>
          )}
        </div>
        {uploading ? (
          <div className="absolute inset-0 bg-retro-ink/60 flex items-center justify-center text-xs font-bold text-white">
            Uploading…
          </div>
        ) : null}
      </div>

      <div>
        <p className="font-body text-sm font-bold">Profile photo</p>
        <p className="text-xs text-retro-text-dim mt-1 mb-3">JPG or PNG, max 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <RetroButton
          type="button"
          variant="secondary"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          Change photo
        </RetroButton>
      </div>
    </div>
  );
}
