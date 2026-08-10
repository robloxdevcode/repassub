"use client";

import dynamic from "next/dynamic";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  {
    ssr: false,
    loading: () => <div className="h-8 w-8 border-2 border-white/20 bg-white/10" aria-hidden />,
  }
);

export function ClerkUserMenu() {
  return <UserButton />;
}
