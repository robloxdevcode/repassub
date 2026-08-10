export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "";
export const ADSENSE_UNLOCK_SLOT = process.env.NEXT_PUBLIC_ADSENSE_UNLOCK_SLOT?.trim() || "";

export function isAdSenseConfigured() {
  return Boolean(ADSENSE_CLIENT);
}

export function isUnlockAdConfigured() {
  return Boolean(ADSENSE_CLIENT && ADSENSE_UNLOCK_SLOT);
}
