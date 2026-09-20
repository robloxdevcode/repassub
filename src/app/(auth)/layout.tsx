import type { Metadata } from "next";

import { ClassicAuthChrome } from "@/components/marketing/classic-auth-chrome";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user?.banned) redirect("/suspended");

  return <ClassicAuthChrome>{children}</ClassicAuthChrome>;
}
