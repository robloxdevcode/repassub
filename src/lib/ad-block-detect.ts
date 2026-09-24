"use client";

/** Detect common ad blockers (uBlock, AdBlock, etc.) via bait elements. */
export function detectAdBlock(): boolean {
  if (typeof document === "undefined") return false;

  const bait = document.createElement("div");
  bait.setAttribute("aria-hidden", "true");
  bait.className =
    "adsbox adsbygoogle ad-banner advertisement pub_300x250 textads banner-ads ad-container";
  bait.style.cssText =
    "position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;pointer-events:none;visibility:visible;display:block;";

  document.body.appendChild(bait);
  const style = window.getComputedStyle(bait);
  const blocked =
    bait.offsetHeight === 0 ||
    bait.offsetWidth === 0 ||
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0";
  bait.remove();

  return blocked;
}

export async function detectAdBlockAsync(): Promise<boolean> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
  return detectAdBlock();
}
