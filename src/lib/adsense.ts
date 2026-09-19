/**
 * Client-safe AdSense helpers (no env access — pass values from the server).
 */
export type UnlockAdSide = "left" | "right" | "bottom";

export function isUnlockAdConfigured(
  client: string,
  slot: string | undefined,
  side: UnlockAdSide = "bottom"
) {
  if (!client.trim()) return false;
  if (side === "left" || side === "right") return Boolean(slot?.trim());
  return Boolean(client.trim());
}

export function isUnlockPageAdsConfigured(client: string) {
  return Boolean(client.trim());
}
