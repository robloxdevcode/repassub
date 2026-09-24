import "server-only";

import {
  getAdSensePublisherIdFromEnv,
  getAdsTxtBody as buildAdsTxtBody,
} from "@/lib/ads-txt-content";

const DEFAULT_CLIENT = "ca-pub-9505278121058134";

function readClientEnv() {
  return (
    process.env.ADSENSE_CLIENT?.trim() ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
    DEFAULT_CLIENT
  );
}

export function getAdSenseClient() {
  return readClientEnv();
}

export function getAdSensePublisherId() {
  return getAdSensePublisherIdFromEnv();
}

export function getAdsTxtBody() {
  return buildAdsTxtBody();
}

export function getUnlockAdSlot(side: "left" | "right" | "bottom") {
  const fallback = process.env.ADSENSE_UNLOCK_SLOT?.trim() || "";
  const left =
    process.env.ADSENSE_UNLOCK_SLOT_LEFT?.trim() ||
    process.env.NEXT_PUBLIC_ADSENSE_UNLOCK_SLOT_LEFT?.trim() ||
    fallback;
  const right =
    process.env.ADSENSE_UNLOCK_SLOT_RIGHT?.trim() ||
    process.env.NEXT_PUBLIC_ADSENSE_UNLOCK_SLOT_RIGHT?.trim() ||
    fallback;
  const legacy =
    process.env.NEXT_PUBLIC_ADSENSE_UNLOCK_SLOT?.trim() || fallback;

  if (side === "left") return left;
  if (side === "right") return right;
  return legacy || left || right;
}

export function getUnlockPageAdConfig() {
  const client = getAdSenseClient();
  return {
    client,
    slots: {
      left: getUnlockAdSlot("left"),
      right: getUnlockAdSlot("right"),
      bottom: getUnlockAdSlot("bottom"),
    },
  };
}
