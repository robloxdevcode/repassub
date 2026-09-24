import { ADS_TXT_HEADERS, getAdsTxtBody } from "@/lib/ads-txt-content";

export const dynamic = "force-static";
export const revalidate = 300;

export function GET() {
  return new Response(getAdsTxtBody(), {
    status: 200,
    headers: ADS_TXT_HEADERS,
  });
}
