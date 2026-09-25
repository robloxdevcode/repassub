import { getPlatform } from "@/lib/unlock-platforms";

export function getStepHint(platformId: string, label: string): string {
  const platform = getPlatform(platformId);
  const id = platform?.id ?? platformId;
  const l = label.toLowerCase();

  if (id === "youtube" || l.includes("subscribe")) {
    return "Subscribe on YouTube, then come back here.";
  }
  if (id === "instagram" || l.includes("instagram") || l.includes("follow")) {
    return "Follow on Instagram, then come back here.";
  }
  if (id === "tiktok" || l.includes("tiktok")) {
    return "Follow on TikTok, then come back here.";
  }
  if (id === "discord" || l.includes("discord") || l.includes("join")) {
    return "Join the server, then come back here.";
  }
  if (id === "spotify") {
    return "Follow on Spotify, then come back here.";
  }
  if (id === "twitch") {
    return "Follow on Twitch, then come back here.";
  }
  if (id === "twitter" || l.includes("twitter") || l.includes(" x ")) {
    return "Follow on X, then come back here.";
  }
  return "Complete the action on that site, then come back here.";
}

export function externalAckStorageKey(campaignId: string) {
  return `linklock_external_ack_${campaignId}`;
}

export function hasExternalAck(campaignId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(externalAckStorageKey(campaignId)) === "1";
  } catch {
    return false;
  }
}

export function setExternalAck(campaignId: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(externalAckStorageKey(campaignId), "1");
  } catch {
    /* ignore */
  }
}
