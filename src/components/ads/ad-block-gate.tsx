"use client";

import { useCallback, useEffect, useState } from "react";
import { detectAdBlockAsync } from "@/lib/ad-block-detect";
import { RetroButton } from "@/components/retro";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { ShieldOff } from "lucide-react";

type AdBlockGateProps = {
  /** When false, detection is skipped (e.g. Pro pages with no ads). */
  enabled?: boolean;
};

export function AdBlockGate({ enabled = true }: AdBlockGateProps) {
  const [blocked, setBlocked] = useState(false);
  const [checking, setChecking] = useState(enabled);

  const runCheck = useCallback(async () => {
    if (!enabled) {
      setBlocked(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    const isBlocked = await detectAdBlockAsync();
    setBlocked(isBlocked);
    setChecking(false);
  }, [enabled]);

  useEffect(() => {
    void runCheck();
    if (!enabled) return;

    const interval = window.setInterval(() => {
      void runCheck();
    }, 2500);

    const onFocus = () => {
      void runCheck();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [enabled, runCheck]);

  useEffect(() => {
    if (!enabled || !blocked) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [blocked, enabled]);

  if (!enabled || checking || !blocked) {
    return null;
  }

  return (
    <div
      className="ad-block-gate fixed inset-0 z-[100000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-block-gate-title"
    >
      <div className="ad-block-gate-panel mx-auto w-full max-w-md text-center">
        <LinklockLogo size={44} variant="lockup" className="mx-auto mb-4 justify-center" />
        <div className="ad-block-gate-icon mx-auto mb-4" aria-hidden>
          <ShieldOff size={28} />
        </div>
        <h1 id="ad-block-gate-title" className="font-body text-xl font-bold text-retro-text mb-3">
          Please turn off your ad blocker
        </h1>
        <p className="text-sm text-retro-text-dim leading-relaxed mb-2">
          Linklock stays free for creators because of ads on unlock pages and our site. Keeping an ad
          blocker on doesn&apos;t help us — it blocks the support that keeps the platform running.
        </p>
        <p className="text-sm font-semibold text-retro-text mb-6">
          Disable your ad blocker for <strong className="text-retro-accent">linklock.org</strong>, then
          continue.
        </p>
        <RetroButton type="button" className="w-full sm:w-auto" onClick={() => window.location.reload()}>
          I turned it off — refresh
        </RetroButton>
        <p className="mt-4 text-xs text-retro-text-muted">
          Works with uBlock Origin, AdBlock, AdGuard, Brave Shields, and similar extensions.
        </p>
      </div>
    </div>
  );
}
