"use client";

import Link from "next/link";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";
import { useMarketingSignedIn } from "@/components/marketing/marketing-auth-provider";

export function MarketingNavActions() {
  const isSignedIn = useMarketingSignedIn();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/dashboard" className="pro-btn pro-btn--secondary pro-btn--sm">
          Dashboard
        </Link>
        <ClerkUserMenu />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link href="/sign-in" className="pro-nav-link pro-focus hidden sm:inline-flex">
        Sign in
      </Link>
      <Link href="/sign-up" className="pro-btn pro-btn--primary pro-btn--sm shrink-0">
        Get started
      </Link>
    </div>
  );
}
