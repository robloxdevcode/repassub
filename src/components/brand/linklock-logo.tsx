import Image from "next/image";
import { cn } from "@/lib/utils";

/** Full lockup asset (304×168). */
export const LOGO_WIDTH = 304;
export const LOGO_HEIGHT = 168;
export const LOGO_ASPECT = LOGO_WIDTH / LOGO_HEIGHT;

export type LinklockLogoVariant = "responsive" | "lockup" | "mark";

type LinklockLogoProps = {
  /** Logo height in pixels; width scales from the asset aspect ratio (lockup) or square (mark). */
  size?: number;
  className?: string;
  variant?: LinklockLogoVariant;
};

function LockupImage({ size, className }: { size: number; className?: string }) {
  const height = size;
  const width = Math.round(size * LOGO_ASPECT);

  return (
    <Image
      src="/logo.png"
      alt="Linklock"
      width={width}
      height={height}
      className={cn("shrink-0 object-contain", className)}
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
      className={cn("shrink-0 object-contain", className)}
      priority
    />
  );
}

export function LinklockLogo({
  size = 40,
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

  return (
    <span className={cn("inline-flex items-center", className)}>
      <MarkImage size={size} className="sm:hidden" />
      <LockupImage size={size} className="hidden sm:block" />
    </span>
  );
}
