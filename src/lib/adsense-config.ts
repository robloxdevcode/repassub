import "server-only";

/** IAB ads.txt certification authority ID for Google AdSense direct lines. */
const GOOGLE_CERT_ID = "f08c47fec0942fa0";

const DEFAULT_CLIENT = "ca-pub-9505278121058134";
const DEFAULT_PUBLISHER_ID = "pub-9505278121058134";

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
  const client = readClientEnv();
  if (client.startsWith("pub-")) return client;
  return client.replace(/^ca-pub-/i, "pub-") || DEFAULT_PUBLISHER_ID;
}

export function getAdsTxtBody() {
  const pubId = getAdSensePublisherId();
  return `google.com, ${pubId}, DIRECT, ${GOOGLE_CERT_ID}\n`;
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
