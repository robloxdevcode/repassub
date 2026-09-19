"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { getLeaderboardOptIn, getWeeklyLeaderboard, setLeaderboardOptIn } from "@/lib/actions/leaderboard";
import { RetroButton } from "@/components/retro";
import { useToast } from "@/components/retro";
import { formatNumber } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

export function LeaderboardPageClient() {
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<Awaited<ReturnType<typeof getWeeklyLeaderboard>>>([]);
  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    Promise.all([getWeeklyLeaderboard(), isSignedIn ? getLeaderboardOptIn() : Promise.resolve(false)])
      .then(([board, joined]) => {
        setEntries(board);
        setOptIn(joined);
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  function toggleOptIn() {
    startTransition(async () => {
      try {
        const next = !optIn;
        await setLeaderboardOptIn(next);
        setOptIn(next);
        toast(next ? "You're on the weekly leaderboard!" : "Removed from leaderboard", "success");
        const board = await getWeeklyLeaderboard();
        setEntries(board);
      } catch {
        toast("Could not update leaderboard setting", "error");
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-retro-accent mb-2">Community</p>
      <h1 className="text-3xl font-bold text-retro-text mb-3">Weekly unlock leaderboard</h1>
      <p className="text-sm text-retro-text-dim leading-relaxed mb-8">
        Top creators by fan unlocks in the last 7 days. Opt in to appear — off by default.
      </p>

      {isSignedIn ? (
        <div className="retro-panel p-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-retro-text">
            {optIn ? "You're visible on the leaderboard." : "You're hidden from the leaderboard."}
          </p>
          <RetroButton type="button" variant={optIn ? "secondary" : "primary"} loading={pending} onClick={toggleOptIn}>
            {optIn ? "Opt out" : "Join leaderboard"}
          </RetroButton>
        </div>
      ) : (
        <p className="text-sm text-retro-text-dim mb-8">
          <Link href="/sign-in" className="text-retro-accent hover:underline">
            Sign in
          </Link>{" "}
          to join the leaderboard.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-retro-text-muted">Loading…</p>
      ) : entries.length === 0 ? (
        <div className="retro-panel p-8 text-center text-sm text-retro-text-dim">
          No ranked creators yet this week. Publish a link and opt in to compete.
        </div>
      ) : (
        <ol className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.username} className="retro-panel p-4 flex items-center gap-4">
              <span className="font-display text-lg font-bold text-retro-accent w-8 shrink-0">#{entry.rank}</span>
              {entry.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.avatarUrl} alt="" className="h-10 w-10 rounded-lg object-cover brutal-border shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded-lg brutal-border bg-retro-yellow flex items-center justify-center font-bold shrink-0">
                  {(entry.displayName || entry.username).slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <Link href={`/u/${entry.username}`} className="font-semibold text-retro-text hover:underline truncate block">
                  {entry.displayName || entry.username}
                </Link>
                <p className="text-xs text-retro-text-muted">@{entry.username}</p>
              </div>
              <p className="text-sm font-bold tabular-nums shrink-0">{formatNumber(entry.unlocks)} unlocks</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
