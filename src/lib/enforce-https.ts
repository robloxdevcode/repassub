import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function hostname(req: NextRequest): string {
  const host = req.headers.get("host") || "";
  return host.split(":")[0]?.toLowerCase() || "";
}

/** Redirect plain HTTP to HTTPS in production (Vercel sets x-forwarded-proto). */
export function enforceHttpsRedirect(req: NextRequest): NextResponse | null {
  const name = hostname(req);
  if (!name || LOCAL_HOSTS.has(name)) return null;

  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  if (proto !== "http") return null;

  const url = req.nextUrl.clone();
  url.protocol = "https:";
  return NextResponse.redirect(url, 308);
}

export function isProductionHost(req: NextRequest): boolean {
  const name = hostname(req);
  return Boolean(name && !LOCAL_HOSTS.has(name));
}
