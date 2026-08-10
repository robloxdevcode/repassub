"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

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
  const { isSignedIn } = useAuth();

  return (
    <Link href={isSignedIn ? signedInHref : href} className={className}>
      {children}
    </Link>
  );
}
