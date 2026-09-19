"use client";

import Link from "next/link";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";
import { useMarketingSignedIn } from "@/components/marketing/marketing-auth-provider";
import { cn } from "@/lib/utils";

export function MarketingNavActions({ onHome = false }: { onHome?: boolean }) {
  const isSignedIn = useMarketingSignedIn();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/dashboard"
          className={cn("lm-btn lm-btn--nav lm-focus-ring", onHome && "lm-btn--nav-home")}
        >
          Dashboard
        </Link>
        <ClerkUserMenu />
      </div>
    );
  }

  return (
    <Link
      href="/sign-up"
      className={cn("lm-btn lm-btn--nav lm-focus-ring shrink-0", onHome && "lm-btn--nav-home")}
    >
      Get started
    </Link>
  );
}
