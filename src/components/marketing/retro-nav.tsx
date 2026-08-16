"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MarketingNavActions } from "@/components/marketing/marketing-nav-actions";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export function RetroNav() {
  const pathname = usePathname();

  return (
    <header className="ll-calm-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 h-14">
        <Link href="/" prefetch className="flex items-center shrink-0 min-w-0">
          <LinklockLogo size={36} showWordmark wordmarkClassName="hidden sm:inline text-retro-text" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={cn(
                "text-sm text-retro-text-muted hover:text-retro-text transition-colors",
                pathname === link.href && "text-retro-text font-medium"
              )}
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
