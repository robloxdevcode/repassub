"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { CurrencyToggle } from "@/components/marketing/currency-toggle";
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
    <header className="ll-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 h-16">
          <Link href="/" prefetch className="flex items-center gap-2 shrink-0 min-w-0">
          <LinklockLogo size={44} showWordmark wordmarkClassName="hidden sm:inline text-retro-text" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={cn(
                "ll-nav-link",
                pathname === link.href && "ll-nav-link--active"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <CurrencyToggle />
            <ThemeToggle />
          </div>
          <MarketingNavActions />
        </div>
      </div>
    </header>
  );
}
