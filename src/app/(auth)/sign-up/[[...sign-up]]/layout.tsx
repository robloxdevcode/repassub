import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign Up Free",
  description:
    "Create a free Linklock account. Build subscribe-to-download links for YouTube, Instagram, Discord, and 70+ platforms.",
  path: "/sign-up",
});

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
