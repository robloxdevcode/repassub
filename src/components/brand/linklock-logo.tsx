import Image from "next/image";
import { cn } from "@/lib/utils";

/** Full lockup asset — updated by `npm run icons:generate`. */
export const LOGO_WIDTH = 249;
export const LOGO_HEIGHT = 201;
export const LOGO_ASPECT = LOGO_WIDTH / LOGO_HEIGHT;

/** Lockup reads larger than the square mark at the same `size` value. */
const LOCKUP_SIZE_MULTIPLIER = 1.55;

export type LinklockLogoVariant = "responsive" | "lockup" | "mark";

type LinklockLogoProps = {
  /** Base size (mark = square side; lockup height ≈ size × 1.45). */
  size?: number;
  className?: string;
  variant?: LinklockLogoVariant;
};

function LockupImage({ size, className }: { size: number; className?: string }) {
  const height = Math.round(size * LOCKUP_SIZE_MULTIPLIER);
  const width = Math.round(height * LOGO_ASPECT);

  return (
    <Image
      src="/logo.png"
      alt="Linklock"
      width={width}
      height={height}
      className={cn("linklock-logo-lockup shrink-0 object-contain object-left", className)}
      priority
    />
  );
}

function MarkImage({ size, className }: { size: number; className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt="Linklock"
      width={size}
      height={size}
      className={cn("linklock-logo-mark shrink-0 object-contain", className)}
      priority
    />
  );
}

export function LinklockLogo({
  size = 52,
  className,
  variant = "responsive",
}: LinklockLogoProps) {
  if (variant === "mark") {
    return (
      <span className={cn("inline-flex items-center", className)}>
        <MarkImage size={size} />
      </span>
    );
  }

  if (variant === "lockup") {
    return (
      <span className={cn("inline-flex items-center", className)}>
        <LockupImage size={size} />
      </span>
    );
  }

  const mobileMark = Math.max(36, Math.round(size * 0.92));
  const desktopLockup = Math.round(size * 1.15);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <MarkImage size={mobileMark} className="sm:hidden" />
      <LockupImage size={desktopLockup} className="hidden sm:block" />
    </span>
  );
}
