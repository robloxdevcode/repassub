"use client";

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { useEasterEggTrigger } from "@/components/easter-egg/use-easter-egg-trigger";
import type { EasterEggId } from "@/lib/easter-eggs";
import { cn } from "@/lib/utils";

export function EasterEggNavLink({
  href,
  eggId,
  clicks,
  icon: Icon,
  label,
  active,
  className,
  onNavigate,
}: {
  href: string;
  eggId: EasterEggId;
  clicks: number;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  label: ReactNode;
  active?: boolean;
  className?: string;
  onNavigate?: () => void;
}) {
  const onTrigger = useEasterEggTrigger(eggId, clicks);

  return (
    <Link
      href={href}
      prefetch
      onClick={(event) => {
        void onTrigger(event);
        if (!event.defaultPrevented) onNavigate?.();
      }}
      className={cn("sidebar-nav-item", active && "sidebar-nav-active", className)}
    >
      <Icon size={17} strokeWidth={2} />
      {label}
    </Link>
  );
}
