"use client";

import Link from "next/link";
import { useMarketingSignedIn } from "@/components/marketing/marketing-auth-provider";

export function MarketingAuthLink({
  href,
  signedInHref = "/dashboard",
  className,
  children,
}: {
  href: string;
  signedInHref?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const isSignedIn = useMarketingSignedIn();

  return (
    <Link href={isSignedIn ? signedInHref : href} className={className}>
      {children}
    </Link>
  );
}
