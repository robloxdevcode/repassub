import { cn } from "@/lib/utils";

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 22,
} as const;

type Props = {
  platform: string;
  size?: keyof typeof sizeMap;
  className?: string;
};

function Svg({ children, size, className }: { children: React.ReactNode; size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      {children}
    </svg>
  );
}

export function PlatformBrandIcon({ platform, size = "md", className }: Props) {
  const px = sizeMap[size];
  const key = platform.toLowerCase().replace(/\s+/g, "").replace("/", "");

  switch (key) {
    case "youtube":
      return (
        <Svg size={px} className={cn("text-[#ff0000]", className)}>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.75 15.5v-7l6.5 3.5-6.5 3.5Z" />
        </Svg>
      );
    case "discord":
      return (
        <Svg size={px} className={cn("text-[#5865f2]", className)}>
          <path d="M20.3 4.4A17.7 17.7 0 0 0 15.5 3l-.3.6a16.2 16.2 0 0 0-6.4 0L8.5 3A17.4 17.4 0 0 0 3.7 4.4 18.6 18.6 0 0 0 .1 15.2a17.8 17.8 0 0 0 5.4 2.7l1.1-1.7a12 12 0 0 1-1.9-.9l.4-.3a13.2 13.2 0 0 0 11.8 0l.4.3c-.7.3-1.3.6-1.9.9l1.1 1.7a17.8 17.8 0 0 0 5.4-2.7A18.5 18.5 0 0 0 20.3 4.4ZM8.3 13.1c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm7.4 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z" />
        </Svg>
      );
    case "spotify":
      return (
        <Svg size={px} className={cn("text-[#1db954]", className)}>
          <path d="M12 1.5A10.5 10.5 0 1 0 22.5 12 10.5 10.5 0 0 0 12 1.5Zm4.8 14.9a.8.8 0 0 1-1.1.3c-3-1.9-6.8-2.3-11.2-1.2a.8.8 0 0 1-.4-1.5c4.8-1.2 9-0.7 12.4 1.4a.8.8 0 0 1 .3 1Zm1.6-3.6a1 1 0 0 1-1.3.4c-3.5-2.1-8.8-2.7-13-1.5a1 1 0 0 1-.6-1.9c4.8-1.4 10.7-.7 14.8 1.7a1 1 0 0 1 .1 1.3Zm.1-3.7a1.2 1.2 0 0 1-1.6.5C13.2 7.8 7.4 7.5 4.4 8.4a1.2 1.2 0 0 1-.7-2.3c3.5-1 10-.7 14 1.8a1.2 1.2 0 0 1 .8 1.1Z" />
        </Svg>
      );
    case "instagram":
      return (
        <Svg size={px} className={cn("text-[#e1306c]", className)}>
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm6.5-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1Z" />
        </Svg>
      );
    case "tiktok":
      return (
        <Svg size={px} className={cn("text-retro-text", className)}>
          <path d="M16.6 3h3.1c.2 1.4.9 2.7 2 3.6 1.1.9 2.5 1.4 3.9 1.3v3.2a8.8 8.8 0 0 1-3.9-1v7.8a6.8 6.8 0 1 1-6.8-6.8c.3 0 .7 0 1 .1v3.3a3.5 3.5 0 1 0 2.5 3.3V3Z" />
        </Svg>
      );
    case "twitter":
    case "x":
    case "xtwitter":
      return (
        <Svg size={px} className={cn("text-retro-text", className)}>
          <path d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-5.2-6.8L5.5 22H2.4l7.3-8.4L1 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20Z" />
        </Svg>
      );
    case "twitch":
      return (
        <Svg size={px} className={cn("text-[#9146ff]", className)}>
          <path d="M4 2 2 6.8V20h5.5v3.5L11 20h4.5l7-7V2H4Zm14 10.5-3 3h-3L10 18.5V16H7V4h11v8.5Zm-3-6v5h2V6.5h-2Zm-4 0v5h2V6.5h-2Z" />
        </Svg>
      );
    case "telegram":
      return (
        <Svg size={px} className={cn("text-[#26a5e4]", className)}>
          <path d="M22.5 3.5 2.8 11.3c-1.2.5-1.2 1.2-.2 1.5l5 1.6 1.9 5.9c.3.8.6 1 1 .1l2.7-2.6 5.6 4.1c1 .6 1.7.3 1.9-1l3.6-17.3c.3-1.3-.5-1.9-1.6-1.5Z" />
        </Svg>
      );
    case "soundcloud":
      return (
        <Svg size={px} className={cn("text-[#ff5500]", className)}>
          <path d="M17.5 13.8c-.3 0-.5.2-.5.5v2.2c0 .3.2.5.5.5h.8c.3 0 .5-.2.5-.5v-2.2c0-.3-.2-.5-.5-.5h-.8Zm-2.2 1c-.3 0-.5.2-.5.5v1.2c0 .3.2.5.5.5h.8c.3 0 .5-.2.5-.5v-1.2c0-.3-.2-.5-.5-.5h-.8Zm-2.2.5c-.3 0-.5.2-.5.5v.7c0 .3.2.5.5.5h.8c.3 0 .5-.2.5-.5v-.7c0-.3-.2-.5-.5-.5h-.8Zm13.2 1.2a4.8 4.8 0 0 0-4.8-4.8c-.5 0-1 .1-1.4.2-1-2.5-3.5-4.2-6.4-4.2-2.2 0-4.1 1-5.4 2.6-.3 0-.6-.1-1-.1-2.2 0-4 1.8-4 4v6.8h21.5c2.5 0 4.5-2 4.5-4.5 0-2.1-1.5-3.9-3.5-4.3Z" />
        </Svg>
      );
    case "patreon":
      return (
        <Svg size={px} className={cn("text-[#ff424d]", className)}>
          <path d="M15.5 2H19v20h-3.5V2ZM9 7.5A4.5 4.5 0 1 1 4.5 12 4.5 4.5 0 0 1 9 7.5Z" />
        </Svg>
      );
    case "website":
      return (
        <Svg size={px} className={cn("text-retro-blue", className)}>
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm7.9 9h-3.3a15.8 15.8 0 0 0-1.2-5 8 8 0 0 1 4.5 5ZM12 4a13.8 13.8 0 0 1 1.4 6H10.6A13.8 13.8 0 0 1 12 4ZM8.6 4a15.8 15.8 0 0 0-1.2 5H4.1a8 8 0 0 1 4.5-5ZM4.1 13h3.3a15.8 15.8 0 0 0 1.2 5 8 8 0 0 1-4.5-5Zm3.5 7a13.8 13.8 0 0 1 7.4 0 13.8 13.8 0 0 1-1.4-6h2.8a13.8 13.8 0 0 1-1.4 6Zm5.8 0a15.8 15.8 0 0 0 1.2-5h3.3a8 8 0 0 1-4.5 5Z" />
        </Svg>
      );
    default:
      return (
        <Svg size={px} className={cn("text-retro-text-muted", className)}>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        </Svg>
      );
  }
}

/** Platforms shown on marketing — matches unlock builder presets + common extras */
export const MARKETING_PLATFORMS = [
  { id: "youtube", name: "YouTube" },
  { id: "discord", name: "Discord" },
  { id: "spotify", name: "Spotify" },
  { id: "instagram", name: "Instagram" },
  { id: "tiktok", name: "TikTok" },
  { id: "twitter", name: "X" },
  { id: "twitch", name: "Twitch" },
  { id: "telegram", name: "Telegram" },
  { id: "soundcloud", name: "SoundCloud" },
  { id: "patreon", name: "Patreon" },
  { id: "website", name: "Website" },
] as const;

export function PlatformMarqueeItem({ id, name }: { id: string; name: string }) {
  return (
    <span className="ll-marquee-item">
      <PlatformBrandIcon platform={id} size="sm" />
      {name}
    </span>
  );
}
