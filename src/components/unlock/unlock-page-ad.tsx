"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { RetroButton } from "@/components/retro";
import { ADSENSE_CLIENT, ADSENSE_UNLOCK_SLOT, isUnlockAdConfigured } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

function AdSenseUnit() {
  const pushed = useRef(false);

  useEffect(() => {
    if (!isUnlockAdConfigured() || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script may still be loading
    }
  }, []);

  return (
    <div className="mt-5 brutal-border bg-retro-surface-2 p-3 text-center overflow-hidden min-h-[100px]">
      <p className="font-display text-[7px] text-retro-text-muted mb-2">AD</p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_UNLOCK_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

function AdPlaceholder() {
  return (
    <div className="mt-5 brutal-border bg-retro-surface-2 p-3 text-center" data-ad-slot="unlock-page">
      <p className="font-display text-[7px] text-retro-text-muted mb-2">AD</p>
      <p className="font-body text-xs font-bold">Sponsored</p>
      <p className="text-[10px] text-retro-text-dim mt-1 mb-3 leading-relaxed">
        Free unlock pages include ads. Creators can upgrade to Pro to remove them.
      </p>
      <Link href="/pricing">
        <RetroButton variant="secondary" size="sm">
          Go ad-free with Pro
        </RetroButton>
      </Link>
    </div>
  );
}

export function UnlockPageAd() {
  if (isUnlockAdConfigured()) {
    return <AdSenseUnit />;
  }

  return <AdPlaceholder />;
}
