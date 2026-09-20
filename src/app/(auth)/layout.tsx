import type { Metadata } from "next";

import { ClassicAuthChrome } from "@/components/marketing/classic-auth-chrome";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <ClassicAuthChrome>{children}</ClassicAuthChrome>;
}
