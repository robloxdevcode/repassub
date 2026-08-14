"use client";

import Link from "next/link";
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
    <>
      <Link
        href="/sign-in"
        prefetch
        className="hidden sm:inline text-sm font-medium text-retro-text-dim hover:text-retro-text transition-colors"
      >
        Log in
      </Link>
      <RetroLink href="/sign-up" size="sm">
        Get started
      </RetroLink>
    </>
  );
}
