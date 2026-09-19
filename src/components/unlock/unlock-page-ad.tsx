"use client";

import { useEffect, useRef } from "react";
import { isUnlockAdConfigured, type UnlockAdSide } from "@/lib/adsense";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

function pushAdUnit() {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
}

function AdSenseUnit({
  side,
  adClient,
  adSlot,
}: {
  side: UnlockAdSide;
  adClient: string;
  adSlot: string;
}) {
  const pushed = useRef(false);
  const isSide = side === "left" || side === "right";

  useEffect(() => {
    if (!adClient || pushed.current) return;

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
  }, [adClient, adSlot]);

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
        data-ad-client={adClient}
        {...(adSlot ? { "data-ad-slot": adSlot } : {})}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export type UnlockPageAdProps = {
  side?: UnlockAdSide;
  adClient: string;
  adSlots: { left: string; right: string; bottom: string };
};

export function UnlockPageAd({ side = "bottom", adClient, adSlots }: UnlockPageAdProps) {
  const slot =
    side === "left" ? adSlots.left : side === "right" ? adSlots.right : adSlots.bottom;

  if (!isUnlockAdConfigured(adClient, slot, side)) {
    return null;
  }

  return <AdSenseUnit side={side} adClient={adClient} adSlot={slot} />;
}
