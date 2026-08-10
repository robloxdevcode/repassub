import Image from "next/image";
import { cn } from "@/lib/utils";

type LinklockLogoProps = {
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
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/logo.png"
        alt="Linklock"
        width={size}
        height={size}
        className="shrink-0 rounded-sm border-2 border-retro-ink brutal-shadow-sm object-cover"
        priority
      />
      {showWordmark ? (
        <span className={cn("font-display text-[10px] tracking-wide", wordmarkClassName)}>LINKLOCK</span>
      ) : null}
    </span>
  );
}
