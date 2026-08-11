import type { ActionType } from "@prisma/client";

export type PlatformPreset = {
  id: string;
  type: ActionType;
  label: string;
  shortName: string;
  placeholder: string;
  accent: string;
};

export const UNLOCK_PLATFORMS: PlatformPreset[] = [
  {
    id: "youtube",
    type: "SUBSCRIBE",
    label: "Subscribe on YouTube",
    shortName: "YouTube",
    placeholder: "https://youtube.com/@yourchannel",
    accent: "border-[#ff0000] bg-[#ff0000]/10 hover:bg-[#ff0000]/20",
  },
  {
    id: "instagram",
    type: "FOLLOW",
    label: "Follow on Instagram",
    shortName: "Instagram",
    placeholder: "https://instagram.com/you",
    accent: "border-[#e1306c] bg-[#e1306c]/10 hover:bg-[#e1306c]/20",
  },
  {
    id: "tiktok",
    type: "FOLLOW",
    label: "Follow on TikTok",
    shortName: "TikTok",
    placeholder: "https://tiktok.com/@you",
    accent: "border-retro-ink bg-retro-surface-2 hover:bg-retro-yellow/30",
  },
  {
    id: "spotify",
    type: "FOLLOW",
    label: "Follow on Spotify",
    shortName: "Spotify",
    placeholder: "https://open.spotify.com/artist/...",
    accent: "border-[#1db954] bg-[#1db954]/10 hover:bg-[#1db954]/20",
  },
  {
    id: "discord",
    type: "JOIN",
    label: "Join Discord",
    shortName: "Discord",
    placeholder: "https://discord.gg/yourserver",
    accent: "border-[#5865f2] bg-[#5865f2]/10 hover:bg-[#5865f2]/20",
  },
  {
    id: "twitch",
    type: "FOLLOW",
    label: "Follow on Twitch",
    shortName: "Twitch",
    placeholder: "https://twitch.tv/you",
    accent: "border-[#9146ff] bg-[#9146ff]/10 hover:bg-[#9146ff]/20",
  },
  {
    id: "twitter",
    type: "FOLLOW",
    label: "Follow on X",
    shortName: "X / Twitter",
    placeholder: "https://x.com/you",
    accent: "border-retro-ink bg-retro-surface-2 hover:bg-retro-yellow/30",
  },
  {
    id: "website",
    type: "VISIT",
    label: "Visit my website",
    shortName: "Website",
    placeholder: "https://yoursite.com",
    accent: "border-retro-blue bg-retro-blue/10 hover:bg-retro-blue/20",
  },
];

export function getPlatform(id: string) {
  return UNLOCK_PLATFORMS.find((p) => p.id === id);
}

/** Guess platform from a pasted link (YouTube, Discord, etc.). */
export function detectPlatformFromUrl(url: string): PlatformPreset | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const host = new URL(trimmed).hostname.toLowerCase();
    if (host.includes("youtube.com") || host.includes("youtu.be")) return getPlatform("youtube") ?? null;
    if (host.includes("instagram.com")) return getPlatform("instagram") ?? null;
    if (host.includes("tiktok.com")) return getPlatform("tiktok") ?? null;
    if (host.includes("spotify.com")) return getPlatform("spotify") ?? null;
    if (host.includes("discord.gg") || host.includes("discord.com")) return getPlatform("discord") ?? null;
    if (host.includes("twitch.tv")) return getPlatform("twitch") ?? null;
    if (host.includes("twitter.com") || host.includes("x.com")) return getPlatform("twitter") ?? null;
    return getPlatform("website") ?? null;
  } catch {
    return null;
  }
}

export function guessPlatform(type: ActionType, label: string): PlatformPreset {
  const l = label.toLowerCase();
  if (type === "SUBSCRIBE" || l.includes("youtube")) return UNLOCK_PLATFORMS[0];
  if (l.includes("instagram")) return UNLOCK_PLATFORMS[1];
  if (l.includes("tiktok")) return UNLOCK_PLATFORMS[2];
  if (l.includes("spotify")) return UNLOCK_PLATFORMS[3];
  if (type === "JOIN" || l.includes("discord")) return UNLOCK_PLATFORMS[4];
  if (l.includes("twitch")) return UNLOCK_PLATFORMS[5];
  if (l.includes("twitter") || l.includes(" on x")) return UNLOCK_PLATFORMS[6];
  if (type === "VISIT") return UNLOCK_PLATFORMS[7];
  return UNLOCK_PLATFORMS.find((p) => p.type === type) || UNLOCK_PLATFORMS[0];
}
