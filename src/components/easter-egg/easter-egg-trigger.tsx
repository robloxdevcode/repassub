"use client";

import type { ReactNode } from "react";
import { useEasterEggTrigger } from "@/components/easter-egg/use-easter-egg-trigger";
import type { EasterEggId } from "@/lib/easter-eggs";
import { cn } from "@/lib/utils";

export function EasterEggTrigger({
  eggId,
  clicks,
  children,
  className,
  as = "span",
}: {
  eggId: EasterEggId;
  clicks: number;
  children: ReactNode;
  className?: string;
  as?: "span" | "button";
}) {
  const onTrigger = useEasterEggTrigger(eggId, clicks);
  const Tag = as;

  return (
    <Tag
      type={as === "button" ? "button" : undefined}
      role={as === "span" ? "presentation" : undefined}
      onClick={(e) => void onTrigger(e)}
      className={cn(className, as === "button" && "cursor-pointer")}
    >
      {children}
    </Tag>
  );
}
