import Image from "next/image";
import { cn } from "@/lib/utils";

export const LOGO_WIDTH = 1024;
export const LOGO_HEIGHT = 682;
export const LOGO_ASPECT = LOGO_WIDTH / LOGO_HEIGHT;

type LinklockLogoProps = {
  /** Logo height in pixels; width scales from the asset aspect ratio. */
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
};

export function LinklockLogo({
  size = 40,
  className,
  showWordmark = false,
  wordmarkClassName,
}: LinklockLogoProps) {
  const height = size;
  const width = Math.round(size * LOGO_ASPECT);
  const wordmarkSize =
    size >= 44 ? "text-xl" : size >= 36 ? "text-lg" : "text-base";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/logo.png"
        alt="Linklock"
        width={width}
        height={height}
        className="shrink-0 object-contain"
        priority
      />
      {showWordmark ? (
        <span
          className={cn(
            "font-display font-bold tracking-tight text-retro-text",
            wordmarkSize,
            wordmarkClassName
          )}
        >
          Linklock
        </span>
      ) : null}
    </span>
  );
}
