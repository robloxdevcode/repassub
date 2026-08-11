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

function AdSenseUnit({ side }: { side: UnlockAdSide }) {
  const pushed = useRef(false);
  const slot = getUnlockAdSlot(side);
  const isSide = side === "left" || side === "right";

  useEffect(() => {
    if (!slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script may still be loading
    }
  }, [slot]);

  return (
    <div
      className={cn(
        "overflow-hidden",
        isSide ? "w-[160px] min-h-[600px]" : "w-full min-h-[100px]"
      )}
    >
      <ins
        className="adsbygoogle block"
        style={isSide ? { display: "inline-block", width: 160, height: 600 } : { display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={isSide ? undefined : "auto"}
        data-full-width-responsive={isSide ? undefined : "true"}
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
