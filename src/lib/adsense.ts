/** Public AdSense publisher ID — visible in page source by design. */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "ca-pub-1007476096338167";

/** Legacy single-slot env (used as fallback for both sides). */
export const ADSENSE_UNLOCK_SLOT = process.env.NEXT_PUBLIC_ADSENSE_UNLOCK_SLOT?.trim() || "";

export const ADSENSE_UNLOCK_SLOT_LEFT =
  process.env.NEXT_PUBLIC_ADSENSE_UNLOCK_SLOT_LEFT?.trim() || ADSENSE_UNLOCK_SLOT;

export const ADSENSE_UNLOCK_SLOT_RIGHT =
  process.env.NEXT_PUBLIC_ADSENSE_UNLOCK_SLOT_RIGHT?.trim() || ADSENSE_UNLOCK_SLOT;

export type UnlockAdSide = "left" | "right" | "bottom";

export function isAdSenseConfigured() {
  return Boolean(ADSENSE_CLIENT);
}

export function getUnlockAdSlot(side: UnlockAdSide) {
  if (side === "left") return ADSENSE_UNLOCK_SLOT_LEFT;
  if (side === "right") return ADSENSE_UNLOCK_SLOT_RIGHT;
  return ADSENSE_UNLOCK_SLOT || ADSENSE_UNLOCK_SLOT_LEFT || ADSENSE_UNLOCK_SLOT_RIGHT;
}

export function isUnlockAdConfigured(side: UnlockAdSide = "bottom") {
  return Boolean(ADSENSE_CLIENT && getUnlockAdSlot(side));
}

export function isUnlockPageAdsConfigured() {
  return Boolean(
    ADSENSE_CLIENT &&
      (ADSENSE_UNLOCK_SLOT_LEFT || ADSENSE_UNLOCK_SLOT_RIGHT || ADSENSE_UNLOCK_SLOT)
  );
}
