export type UseCasePage = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  keywords: string[];
  steps: string[];
  exampleSteps: string[];
  cta: string;
};

export const USE_CASE_PAGES: UseCasePage[] = [
  {
    slug: "preset-packs",
    title: "Preset Pack Download Links",
    headline: "Gate preset packs behind a follow or sub",
    description:
      "Photo and video editors share LUTs, overlays, and preset packs every week. Linklock turns each drop into a growth moment — fans complete your steps, you get follows, they get the pack.",
    keywords: ["preset pack download link", "lut gate download", "instagram follow unlock", "overlay pack link"],
    steps: [
      "Upload your pack to Google Drive, Dropbox, or your shop",
      "Add Instagram follow + YouTube subscribe steps",
      "Share one link in your bio and pinned comment",
    ],
    exampleSteps: ["Follow on Instagram", "Subscribe on YouTube", "Join Discord (optional)"],
    cta: "Create your preset pack link",
  },
  {
    slug: "beat-packs",
    title: "Beat Pack & Sample Download Gates",
    headline: "Trade a subscribe for your latest kit",
    description:
      "Producers drop free kits to grow YouTube and beat stars. Stop sending raw Drive links that leak everywhere — one unlock page with stats on every download.",
    keywords: ["beat pack download gate", "sample pack unlock link", "producer subscribe to download"],
    steps: [
      "Paste your kit download URL as the reward",
      "Add YouTube subscribe and Spotify follow",
      "Copy the bio line from Share kit into TikTok / IG",
    ],
    exampleSteps: ["Subscribe on YouTube", "Follow on Spotify", "Like latest video"],
    cta: "Create your beat pack link",
  },
  {
    slug: "minecraft-mods",
    title: "Minecraft Mod & Pack Download Links",
    headline: "Discord join before the ZIP drops",
    description:
      "Mod and resource pack creators need server members and subs. Linklock handles the gate — fans join Discord, follow your channel, then get the file instantly.",
    keywords: ["minecraft mod download gate", "discord join mod pack", "resource pack unlock link"],
    steps: [
      "Host your mod ZIP on Drive or CurseForge link",
      "Require Discord join + YouTube subscribe",
      "Post in server announcements with one clean URL",
    ],
    exampleSteps: ["Join Discord server", "Subscribe on YouTube", "Visit project page"],
    cta: "Create your mod download link",
  },
  {
    slug: "youtube-tutorials",
    title: "YouTube Tutorial File Unlock Links",
    headline: "Convert tutorial viewers into subscribers",
    description:
      "Free project files in every video description — but raw links don't grow your channel. Gate assets behind subscribe + notification bell for real sub growth.",
    keywords: ["youtube subscribe to download", "tutorial project file gate", "youtube description unlock link"],
    steps: [
      "Add the project file or template link as reward content",
      "Set subscribe + visit channel as steps",
      "Put the unlock URL in description and pinned comment",
    ],
    exampleSteps: ["Subscribe on YouTube", "Turn on notifications", "Visit channel page"],
    cta: "Create your tutorial unlock link",
  },
  {
    slug: "discord-community",
    title: "Discord Community Download Gates",
    headline: "Grow your server with every file drop",
    description:
      "Community builders gate exclusive files, roles, or invite links. Linklock makes the flow feel fair — complete steps, get access, no sketchy locker vibes.",
    keywords: ["discord join to download", "community file gate", "server growth unlock link"],
    steps: [
      "Use join Discord as step one every time",
      "Add follow on X or Instagram for cross-platform growth",
      "Share in partner servers with your bio line + QR",
    ],
    exampleSteps: ["Join Discord", "Follow on X", "Visit website"],
    cta: "Create your community unlock link",
  },
];

export function getUseCasePage(slug: string) {
  return USE_CASE_PAGES.find((p) => p.slug === slug);
}
