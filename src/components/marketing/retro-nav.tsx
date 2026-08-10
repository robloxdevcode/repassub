"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { CurrencyToggle } from "@/components/marketing/currency-toggle";
import { MarketingNavActions } from "@/components/marketing/marketing-nav-actions";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function RetroNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-retro-surface border-b-[3px] border-retro-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <LinklockLogo size={40} showWordmark wordmarkClassName="hidden sm:inline text-retro-ink" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-body text-sm font-semibold px-4 py-2 border-2 border-transparent transition-all",
                pathname === link.href
                  ? "bg-retro-yellow border-retro-ink brutal-shadow-sm"
                  : "hover:border-retro-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CurrencyToggle />
          <ThemeToggle />
          <MarketingNavActions />
        </div>
      </div>
    </header>
  );
}

export function TrustMarquee() {
  const items = [
    "FREE TO START",
    "NO CARD",
    "2 MIN SETUP",
    "YOUTUBE · DISCORD · DRIVE",
    "5 LINKS / WEEK",
  ];
  const row = [...items, ...items];

  return (
    <div className="bg-pop-red text-white border-b-[3px] border-retro-ink py-2.5 marquee-wrap relative overflow-hidden">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i} className="font-display text-[7px] md:text-[8px] tracking-[0.12em] whitespace-nowrap">
            ★ {t} ★
          </span>
        ))}
      </div>
    </div>
  );
}
