"use client";

import { RetroLink } from "@/components/retro";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";
import { useMarketingSignedIn } from "@/components/marketing/marketing-auth-provider";

export function MarketingNavActions() {
  const isSignedIn = useMarketingSignedIn();

  if (isSignedIn) {
    return (
      <>
        <RetroLink href="/dashboard" size="sm">
          Dashboard
        </RetroLink>
        <ClerkUserMenu />
      </>
    );
  }

  return (
    <RetroLink href="/sign-up" size="sm">
      Start free
    </RetroLink>
  );
}
