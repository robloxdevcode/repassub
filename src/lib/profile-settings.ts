import { getStaffBadgeLabel } from "@/lib/admin-access";

export type ProfileStyle = "neon" | "midnight" | "vapor" | "arcade";

export type AppTheme = "classic" | "cream" | "slate";

export type SocialLinks = {
  youtube?: string;
  discord?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  twitch?: string;
};

export type ProfileSettings = {
  style: ProfileStyle;
  appTheme: AppTheme;
  bgUrl: string | null;
  socials: SocialLinks;
  awardedBadges: string[];
};

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  style: "neon",
  appTheme: "classic",
  bgUrl: null,
  socials: {},
  awardedBadges: [],
};

export const APP_THEMES: { id: AppTheme; label: string; desc: string; proOnly?: boolean }[] = [
  { id: "classic", label: "Classic", desc: "Default grid and yellow accents" },
  { id: "cream", label: "Cream", desc: "Warm paper tones", proOnly: true },
  { id: "slate", label: "Slate", desc: "Cool gray workspace", proOnly: true },
];

export const PRO_PROFILE_STYLES: ProfileStyle[] = ["midnight", "vapor", "arcade"];

export const PROFILE_STYLES: { id: ProfileStyle; label: string; desc: string }[] = [
  { id: "neon", label: "Neon", desc: "Indigo glow on dark — default creator look" },
  { id: "midnight", label: "Midnight", desc: "Deep blue panels, soft edges" },
  { id: "vapor", label: "Vapor", desc: "Pink/cyan gradient accents" },
  { id: "arcade", label: "Arcade", desc: "Green highlights, high contrast" },
];

export const OWNER_BADGES = [
  { id: "verified", label: "Verified", emoji: "✓" },
  { id: "vip", label: "VIP", emoji: "★" },
  { id: "partner", label: "Partner", emoji: "◆" },
  { id: "og", label: "OG", emoji: "⚡" },
] as const;

export const MILESTONE_BADGES = [
  { id: "first_link", label: "First link", emoji: "🔗", check: (s: MilestoneStats) => s.publishedLinks >= 1 },
  { id: "ten_unlocks", label: "10 unlocks", emoji: "🔓", check: (s: MilestoneStats) => s.totalUnlocks >= 10 },
  { id: "hundred_unlocks", label: "100 unlocks", emoji: "🏆", check: (s: MilestoneStats) => s.totalUnlocks >= 100 },
  { id: "pro", label: "Pro", emoji: "💎", check: (s: MilestoneStats) => s.isPro },
] as const;

export type MilestoneStats = {
  publishedLinks: number;
  totalUnlocks: number;
  isPro: boolean;
};

export function parseProfileSettings(raw: unknown): ProfileSettings {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_PROFILE_SETTINGS };

  const data = raw as Record<string, unknown>;
  const socialsRaw = data.socials;
  const socials: SocialLinks =
    socialsRaw && typeof socialsRaw === "object" ? (socialsRaw as SocialLinks) : {};

  const style = data.style;
  const validStyle =
    style === "neon" || style === "midnight" || style === "vapor" || style === "arcade"
      ? style
      : "neon";

  const appThemeRaw = data.appTheme;
  const appTheme: AppTheme =
    appThemeRaw === "cream" || appThemeRaw === "slate" || appThemeRaw === "classic" ? appThemeRaw : "classic";

  const awardedBadges = Array.isArray(data.awardedBadges)
    ? data.awardedBadges.filter((b): b is string => typeof b === "string")
    : [];

  return {
    style: validStyle,
    appTheme,
    bgUrl: typeof data.bgUrl === "string" ? data.bgUrl : null,
    socials,
    awardedBadges,
  };
}

export function getBadgeLabel(id: string): { label: string } | null {
  return getStaffBadgeLabel(id);
}
