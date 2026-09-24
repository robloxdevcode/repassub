/** Edge + Node safe — ads.txt line for Google AdSense (IAB). */

export const GOOGLE_ADS_TXT_CERT_ID = "f08c47fec0942fa0";

const DEFAULT_CLIENT = "ca-pub-9505278121058134";
const DEFAULT_PUBLISHER_ID = "pub-9505278121058134";

function readAdsClientEnv(): string {
  return (
    process.env.ADSENSE_CLIENT?.trim() ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
    DEFAULT_CLIENT
  );
}

export function getAdSensePublisherIdFromEnv(): string {
  const client = readAdsClientEnv();
  if (client.startsWith("pub-")) return client;
  return client.replace(/^ca-pub-/i, "pub-") || DEFAULT_PUBLISHER_ID;
}

export function getAdsTxtBody(): string {
  const pubId = getAdSensePublisherIdFromEnv();
  return `google.com, ${pubId}, DIRECT, ${GOOGLE_ADS_TXT_CERT_ID}\n`;
}

export const ADS_TXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=300, must-revalidate",
  "X-Content-Type-Options": "nosniff",
} as const;
