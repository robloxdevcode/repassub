"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { getLeaderboardOptIn, setLeaderboardOptIn } from "@/lib/actions/leaderboard";
import { RetroButton } from "@/components/retro";
import { useToast } from "@/components/retro";

export function LeaderboardOptIn() {
  const { toast } = useToast();
  const [optIn, setOptIn] = useState<boolean | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    getLeaderboardOptIn()
      .then(setOptIn)
      .catch(() => setOptIn(false));
  }, []);

  function toggle() {
    startTransition(async () => {
      try {
        const next = !optIn;
        await setLeaderboardOptIn(next);
        setOptIn(next);
        toast(next ? "You're on the weekly leaderboard" : "Removed from leaderboard", "success");
      } catch {
        toast("Could not update leaderboard setting", "error");
      }
    });
  }

  if (optIn === null) return null;

  return (
    <div className="mt-6 pt-6 border-t border-retro-border">
      <p className="font-body text-sm font-semibold mb-1">Weekly leaderboard</p>
      <p className="text-sm text-retro-text-dim mb-3">
        Opt in to show your unlock count on the public{" "}
        <Link href="/leaderboard" className="text-retro-accent hover:underline">
          leaderboard
        </Link>
        . Off by default.
      </p>
      <RetroButton type="button" variant={optIn ? "secondary" : "primary"} size="sm" loading={pending} onClick={toggle}>
        {optIn ? "Leave leaderboard" : "Join leaderboard"}
      </RetroButton>
    </div>
  );
}
