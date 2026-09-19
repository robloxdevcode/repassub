import type { SimpleIcon } from "simple-icons";
import {
  siYoutube,
  siDiscord,
  siSpotify,
  siInstagram,
  siTiktok,
  siX,
  siTwitch,
  siTelegram,
  siSoundcloud,
  siPatreon,
  siLinktree,
  siBrave,
  siGlobus,
} from "simple-icons";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

type Props = {
  platform: string;
  size?: keyof typeof sizeMap;
  className?: string;
};

const PLATFORM_ICONS: Record<string, SimpleIcon> = {
  youtube: siYoutube,
  discord: siDiscord,
  spotify: siSpotify,
  instagram: siInstagram,
  tiktok: siTiktok,
  twitter: siX,
  x: siX,
  xtwiter: siX,
  twitch: siTwitch,
  telegram: siTelegram,
  soundcloud: siSoundcloud,
  patreon: siPatreon,
  linktree: siLinktree,
  brave: siBrave,
  website: siGlobus,
};

function normalizePlatformKey(platform: string) {
  return platform.toLowerCase().replace(/\s+/g, "").replace("/", "");
}

function BrandSvg({ icon, size, className }: { icon: SimpleIcon; size: number; className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-label={icon.title}
      className={cn("shrink-0", className)}
    >
      <title>{icon.title}</title>
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  );
}

export function PlatformBrandIcon({ platform, size = "md", className }: Props) {
  const px = sizeMap[size];
  const icon = PLATFORM_ICONS[normalizePlatformKey(platform)];

  if (!icon) {
    return (
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        aria-hidden
        className={cn("shrink-0 text-retro-text-muted", className)}
      >
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return <BrandSvg icon={icon} size={px} className={className} />;
}

/** Platforms shown on marketing — official brand icons via Simple Icons */
export const MARKETING_PLATFORMS = [
  { id: "twitch", name: "Twitch" },
  { id: "telegram", name: "Telegram" },
  { id: "brave", name: "Brave" },
  { id: "linktree", name: "Linktree" },
  { id: "youtube", name: "YouTube" },
  { id: "discord", name: "Discord" },
  { id: "spotify", name: "Spotify" },
  { id: "instagram", name: "Instagram" },
  { id: "tiktok", name: "TikTok" },
  { id: "twitter", name: "X" },
  { id: "soundcloud", name: "SoundCloud" },
  { id: "patreon", name: "Patreon" },
] as const;

function PlatformMarqueeGroup({ iconSize = "lg" }: { iconSize?: keyof typeof sizeMap }) {
  return (
    <div className="ll-trust-marquee-group">
      {MARKETING_PLATFORMS.map((p) => (
        <span key={p.id} className="ll-trust-marquee-item lt-platform-pill">
          <PlatformBrandIcon platform={p.id} size={iconSize} />
        </span>
      ))}
    </div>
  );
}

export function PlatformMarqueeTrack({ iconSize = "lg" }: { iconSize?: keyof typeof sizeMap }) {
  return (
    <div className="ll-trust-marquee-track">
      <PlatformMarqueeGroup iconSize={iconSize} />
      <PlatformMarqueeGroup iconSize={iconSize} />
    </div>
  );
}

export function PlatformMarqueeItem({ id, name }: { id: string; name: string }) {
  return (
    <span className="ll-marquee-item">
      <PlatformBrandIcon platform={id} size="sm" />
      {name}
    </span>
  );
}
