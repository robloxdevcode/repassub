export const LOADING_TIPS = [
  "Did you know? Fans never need an account to complete your unlock steps.",
  "Did you know? Paste a YouTube link and we auto-name the subscribe button.",
  "Did you know? Pro unlocks up to 5 steps per link — Free includes 1 step per link.",
  "Did you know? Your unlock page works on mobile without an app install.",
  "Did you know? Text unlocks are perfect for game keys and coupon codes.",
  "Did you know? Discord invite links become a one-tap Join button.",
  "Did you know? You can share one link on TikTok, YouTube, and Discord.",
  "Did you know? Linklock links load fast — no bloated unlock page builder.",
] as const;

export function pickLoadingTip(seed?: number) {
  const index =
    seed !== undefined
      ? Math.abs(seed) % LOADING_TIPS.length
      : Math.floor(Math.random() * LOADING_TIPS.length);
  return LOADING_TIPS[index];
}
