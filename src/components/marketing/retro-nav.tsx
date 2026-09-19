"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MarketingNavActions } from "@/components/marketing/marketing-nav-actions";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export function RetroNav() {
  const pathname = usePathname();

  return (
    <header className="ll-nav pro-nav">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 h-16">
        <Link href="/" prefetch className="flex items-center gap-2 shrink-0 pro-focus">
          <LinklockLogo size={36} showWordmark wordmarkClassName="hidden sm:inline text-retro-text" />
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Site">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={cn("pro-nav-link pro-focus", pathname === link.href && "pro-nav-link--active")}
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
