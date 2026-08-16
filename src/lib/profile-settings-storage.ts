"use client";

import {
  DEFAULT_PROFILE_SETTINGS,
  parseProfileSettings,
  type ProfileSettings,
} from "@/lib/profile-settings";

const STORAGE_PREFIX = "linklock-profile-settings:";

export function loadProfileSettings(username: string): ProfileSettings {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE_SETTINGS };
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${username}`);
    return raw ? parseProfileSettings(JSON.parse(raw)) : { ...DEFAULT_PROFILE_SETTINGS };
  } catch {
    return { ...DEFAULT_PROFILE_SETTINGS };
  }
}

export function saveProfileSettings(username: string, settings: ProfileSettings) {
  localStorage.setItem(`${STORAGE_PREFIX}${username}`, JSON.stringify(settings));
}
