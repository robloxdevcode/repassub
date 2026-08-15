import { headers } from "next/headers";

function parseDevice(userAgent: string): string {
  if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) return "mobile";
  return "desktop";
}

function parseBrowser(userAgent: string): string {
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/chrome/i.test(userAgent) && !/edg\//i.test(userAgent)) return "Chrome";
  if (/firefox/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  return "Other";
}

function parseSource(referer: string | null): string {
  if (!referer) return "Direct";
  try {
    return new URL(referer).hostname.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
}

export async function getAnalyticsContext() {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "";
  const referer = headerList.get("referer");
  const country =
    headerList.get("x-vercel-ip-country") ||
    headerList.get("cf-ipcountry") ||
    undefined;

  return {
    source: parseSource(referer),
    device: parseDevice(userAgent),
    browser: parseBrowser(userAgent),
    country,
  };
}
