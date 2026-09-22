import { cn } from "@/lib/utils";
import type { ProfileStyle } from "@/lib/profile-settings";

export function ProfileHeroPanLayer({
  style,
  bgUrl,
  className,
}: {
  style: ProfileStyle;
  bgUrl?: string | null;
  className?: string;
}) {
  const hasCustom = Boolean(bgUrl?.trim());

  return (
    <div
      aria-hidden
      className={cn(
        "profile-hero-pan-layer ll-bg-pan",
        hasCustom
          ? "profile-hero-pan-layer--custom ll-bg-pan--photo"
          : `profile-hero-pan-layer--${style}`,
        className,
      )}
      style={
        hasCustom
          ? {
              backgroundImage: `url(${bgUrl})`,
            }
          : undefined
      }
    />
  );
}
