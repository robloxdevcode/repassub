import { headers } from "next/headers";

export function normalizeSiteUrl(url: string) {
  return url.replace(/\/$/, "");
}

/** Env-based site URL (may be stale until redeploy for NEXT_PUBLIC_*). */
export function getConfiguredSiteUrl() {
  const configured =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  return configured ? normalizeSiteUrl(configured) : null;
}

/** Prefer the domain the user is actually on (linklock.org, not a wrong .vercel.app). */
export async function getRequestSiteUrl() {
  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    headerList.get("host")?.trim();

  if (host && !host.startsWith("localhost")) {
    const proto = headerList.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
    return normalizeSiteUrl(`${proto}://${host}`);
  }

  return getConfiguredSiteUrl() || "http://localhost:3000";
}

export async function getUnlockUrlForRequest(username: string, slug: string) {
  const base = await getRequestSiteUrl();
  return `${base}/u/${username}/${slug}`;
}

export function getUnlockUrl(username: string, slug: string, base?: string) {
  const site = base || getConfiguredSiteUrl() || "http://localhost:3000";
  return `${normalizeSiteUrl(site)}/u/${username}/${slug}`;
}
