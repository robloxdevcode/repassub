export type EasterEggId =
  | "grape-key"
  | "midnight-knock"
  | "fine-print-trapdoor"
  | "vault-shelf"
  | "stat-stalker"
  | "mirror-touch"
  | "bolt-chaser"
  | "ghost-tab"
  | "deep-dive"
  | "publish-wink";

export type EasterEggDefinition = {
  id: EasterEggId;
  name: string;
  badgeId: string;
  badgeLabel: string;
  badgeEmoji: string;
  rewardMessage: string;
  grantsProDays?: number;
};

export const EASTER_EGGS: Record<EasterEggId, EasterEggDefinition> = {
  "grape-key": {
    id: "grape-key",
    name: "The Grape Key",
    badgeId: "grape_key",
    badgeLabel: "Grape Key",
    badgeEmoji: "🍇",
    rewardMessage: "You found The Grape Key! Rare badge unlocked.",
  },
  "midnight-knock": {
    id: "midnight-knock",
    name: "The Midnight Knock",
    badgeId: "midnight_knock",
    badgeLabel: "Midnight Knocker",
    badgeEmoji: "🌙",
    rewardMessage: "The Midnight Knock echoes back — enjoy 7 days of Pro.",
    grantsProDays: 7,
  },
  "fine-print-trapdoor": {
    id: "fine-print-trapdoor",
    name: "The Fine Print Trapdoor",
    badgeId: "trapdoor",
    badgeLabel: "Trapdoor Finder",
    badgeEmoji: "🚪",
    rewardMessage: "You fell through The Fine Print Trapdoor. Secret badge unlocked!",
  },
  "vault-shelf": {
    id: "vault-shelf",
    name: "The Vault Shelf",
    badgeId: "vault_shelf",
    badgeLabel: "Vault Raider",
    badgeEmoji: "🔐",
    rewardMessage: "You cracked The Vault Shelf. Your links salute you.",
  },
  "stat-stalker": {
    id: "stat-stalker",
    name: "The Stat Stalker",
    badgeId: "stat_stalker",
    badgeLabel: "Stat Stalker",
    badgeEmoji: "👀",
    rewardMessage: "The Stat Stalker sees everything. Badge earned.",
  },
  "mirror-touch": {
    id: "mirror-touch",
    name: "The Mirror Touch",
    badgeId: "mirror_touch",
    badgeLabel: "Mirror Touch",
    badgeEmoji: "🪞",
    rewardMessage: "The Mirror Touch reflects your legend. Badge unlocked.",
  },
  "bolt-chaser": {
    id: "bolt-chaser",
    name: "The Bolt Chaser",
    badgeId: "bolt_chaser",
    badgeLabel: "Bolt Chaser",
    badgeEmoji: "⚡",
    rewardMessage: "The Bolt Chaser caught lightning. Zap badge unlocked!",
  },
  "ghost-tab": {
    id: "ghost-tab",
    name: "The Ghost Tab",
    badgeId: "ghost_tab",
    badgeLabel: "Ghost Tab",
    badgeEmoji: "👻",
    rewardMessage: "A Ghost Tab flickered open. Spooky badge earned.",
  },
  "deep-dive": {
    id: "deep-dive",
    name: "The Deep Dive",
    badgeId: "deep_dive",
    badgeLabel: "Deep Diver",
    badgeEmoji: "📊",
    rewardMessage: "You took The Deep Dive — 3 days of Pro on us.",
    grantsProDays: 3,
  },
  "publish-wink": {
    id: "publish-wink",
    name: "The Publish Wink",
    badgeId: "publish_wink",
    badgeLabel: "Publish Wink",
    badgeEmoji: "😉",
    rewardMessage: "The Publish Wink says go live. Badge unlocked.",
  },
};

export const EASTER_EGG_BADGES = Object.values(EASTER_EGGS).map((egg) => ({
  id: egg.badgeId,
  label: egg.badgeLabel,
  emoji: egg.badgeEmoji,
}));

export function isEasterEggId(value: string): value is EasterEggId {
  return value in EASTER_EGGS;
}

export function themeUsesCaptcha(theme: string) {
  return theme.includes("__captcha");
}

export function stripCaptchaFromTheme(theme: string) {
  return theme.replace("__captcha", "").replace(/__$/, "") || "default";
}

export function applyCaptchaToTheme(theme: string, enabled: boolean) {
  const base = stripCaptchaFromTheme(theme);
  return enabled ? `${base}__captcha` : base;
}
