import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { trackEventSchema } from "@/lib/validations";

const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60000 });
    return true;
  }
  if (entry.count >= 100) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = trackEventSchema.parse(body);

    await trackEvent({
      campaignId: parsed.campaignId,
      type: parsed.type,
      source: parsed.source || req.headers.get("referer") || undefined,
      device: req.headers.get("user-agent")?.includes("Mobile") ? "mobile" : "desktop",
      browser: req.headers.get("user-agent")?.split(" ").pop(),
      metadata: parsed.metadata,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
