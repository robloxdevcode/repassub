"use client";

import Link from "next/link";
import { RetroButton } from "@/components/retro";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";
import { useMarketingSignedIn } from "@/components/marketing/marketing-auth-provider";

export function MarketingNavActions() {
  const isSignedIn = useMarketingSignedIn();

  if (isSignedIn) {
    return (
      <>
        <Link href="/dashboard">
          <RetroButton size="sm" variant="primary">Dashboard</RetroButton>
        </Link>
        <ClerkUserMenu />
      </>
    );
  }

  return (
    <Link href="/sign-up">
      <RetroButton size="sm" variant="primary">Start free</RetroButton>
    </Link>
  );
}
