"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { RetroButton } from "@/components/retro";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";

export function MarketingNavActions() {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-[88px] border-2 border-retro-ink/20 bg-retro-surface-2" aria-hidden />;
  }

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
