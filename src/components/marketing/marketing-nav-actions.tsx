"use client";

import Link from "next/link";
import { RetroLink } from "@/components/retro";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";
import { useMarketingSignedIn } from "@/components/marketing/marketing-auth-provider";

export function MarketingNavActions() {
  const isSignedIn = useMarketingSignedIn();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <RetroLink href="/dashboard" size="sm">
          Dashboard
        </RetroLink>
        <ClerkUserMenu />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/sign-in"
        prefetch
        className="hidden sm:inline text-sm font-medium text-retro-text-dim hover:text-retro-text transition-colors"
      >
        Log in
      </Link>
      <RetroLink href="/sign-up" size="sm" className="ll-landing-pill ll-landing-pill--nav !min-h-0 !py-2 !px-4 !text-sm">
        Get started
      </RetroLink>
    </div>
  );
}
