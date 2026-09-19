import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign In",
  description: "Sign in to your Linklock dashboard to manage unlock links, analytics, and subscribers.",
  path: "/sign-in",
});

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
