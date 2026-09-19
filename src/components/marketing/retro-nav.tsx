"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MarketingNavActions } from "@/components/marketing/marketing-nav-actions";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
];

export function RetroNav() {
  const pathname = usePathname();

  return (
    <header className="ll-nav rk-nav sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 h-16">
        <Link href="/" prefetch className="flex items-center gap-2 shrink-0">
          <LinklockLogo size={36} showWordmark wordmarkClassName="hidden sm:inline text-retro-text font-bold" />
        </Link>

        <nav className="hidden md:flex items-center gap-0.5" aria-label="Site">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={cn("rk-nav-link", pathname === link.href && "rk-nav-link--active")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MarketingNavActions />
      </div>
    </header>
  );
}
