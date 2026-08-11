"use client";

import { useEffect, useRef } from "react";
import {
  ADSENSE_CLIENT,
  getUnlockAdSlot,
  isUnlockAdConfigured,
  type UnlockAdSide,
} from "@/lib/adsense";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

function pushAdUnit() {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
}

function AdSenseUnit({ side }: { side: UnlockAdSide }) {
  const pushed = useRef(false);
  const slot = getUnlockAdSlot(side);
  const isSide = side === "left" || side === "right";

  useEffect(() => {
    if (!slot || pushed.current) return;

    const tryPush = () => {
      try {
        pushAdUnit();
        pushed.current = true;
        return true;
      } catch {
        return false;
      }
    };

    if (tryPush()) return;

    const interval = window.setInterval(() => {
      if (tryPush()) window.clearInterval(interval);
    }, 250);

    return () => window.clearInterval(interval);
  }, [slot]);

  return (
    <div
      className={cn(
        "overflow-hidden",
        isSide ? "w-[300px] min-h-[250px]" : "w-full min-h-[100px]"
      )}
    >
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function UnlockPageAd({ side = "bottom" }: { side?: UnlockAdSide }) {
  if (!isUnlockAdConfigured(side)) {
    return null;
  }

  return <AdSenseUnit side={side} />;
}
