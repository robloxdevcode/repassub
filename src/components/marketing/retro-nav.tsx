"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { CurrencyToggle } from "@/components/marketing/currency-toggle";
import { MarketingNavActions } from "@/components/marketing/marketing-nav-actions";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function RetroNav() {
  const pathname = usePathname();

  return (
    <header className="simple-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 min-w-0">
        <Link href="/" prefetch className="flex items-center gap-2 shrink-0 min-w-0">
          <LinklockLogo size={40} showWordmark wordmarkClassName="hidden sm:inline text-retro-text truncate" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-retro-accent"
                  : "text-retro-text-dim hover:text-retro-text"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
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
