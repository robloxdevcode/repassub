import Image from "next/image";
import { cn } from "@/lib/utils";

/** Full lockup asset — updated by `npm run icons:generate`. */
export const LOGO_WIDTH = 269;
export const LOGO_HEIGHT = 58;
export const LOGO_ASPECT = LOGO_WIDTH / LOGO_HEIGHT;

const LOCKUP_SIZE_MULTIPLIER = 1.55;

/** @deprecated Use `"lockup"` — site always shows the full wordmark. */
export type LinklockLogoVariant = "responsive" | "lockup" | "mark";

type LinklockLogoProps = {
  /** Visual height baseline; rendered lockup height ≈ size × 1.55. */
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

export function LinklockLogo({
  size = 52,
  className,
  variant = "lockup",
}: LinklockLogoProps) {
  const lockupSize =
    variant === "responsive" ? Math.round(size * 1.08) : variant === "mark" ? Math.round(size * 0.85) : size;

  return (
    <span className={cn("inline-flex items-center min-w-0", className)}>
      <LockupImage size={lockupSize} />
    </span>
  );
}
