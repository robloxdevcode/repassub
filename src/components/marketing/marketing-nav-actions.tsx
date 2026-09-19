"use client";

import Link from "next/link";
import { RetroLink } from "@/components/retro";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";
import { useMarketingSignedIn } from "@/components/marketing/marketing-auth-provider";

export function MarketingNavActions() {
  const isSignedIn = useMarketingSignedIn();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3 shrink-0">
        <RetroLink href="/dashboard" size="sm">
          Dashboard
        </RetroLink>
        <ClerkUserMenu />
      </div>
    );
  }

  return (
    <div className="flex items-center shrink-0">
      <RetroLink href="/sign-up" size="sm" className="shrink-0">
        Get started
      </RetroLink>
    </div>
  );
}
