import { buildOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Linklock — Free subscribe-to-download links for creators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return buildOgImage();
}
