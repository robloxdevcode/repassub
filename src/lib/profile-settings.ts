export type ProfileStyle = "neon" | "midnight" | "vapor" | "arcade";

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
  bgUrl: string | null;
  socials: SocialLinks;
  awardedBadges: string[];
};

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  style: "neon",
  bgUrl: null,
  socials: {},
  awardedBadges: [],
};

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

  const awardedBadges = Array.isArray(data.awardedBadges)
    ? data.awardedBadges.filter((b): b is string => typeof b === "string")
    : [];

  return {
    style: validStyle,
    bgUrl: typeof data.bgUrl === "string" ? data.bgUrl : null,
    socials,
    awardedBadges,
  };
}

export function getEarnedBadges(stats: MilestoneStats): string[] {
  return MILESTONE_BADGES.filter((b) => b.check(stats)).map((b) => b.id);
}

export function getBadgeLabel(id: string): { label: string; emoji: string } | null {
  const milestone = MILESTONE_BADGES.find((b) => b.id === id);
  if (milestone) return { label: milestone.label, emoji: milestone.emoji };
  const owner = OWNER_BADGES.find((b) => b.id === id);
  if (owner) return { label: owner.label, emoji: owner.emoji };
  return null;
}
