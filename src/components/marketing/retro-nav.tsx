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
  { href: "/how-it-works", label: "How it works" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function RetroNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-retro-surface border-b-[3px] border-retro-ink overflow-x-clip">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-4 min-w-0">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <LinklockLogo size={48} showWordmark wordmarkClassName="hidden sm:inline text-retro-ink truncate" />
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

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
    "70+ PLATFORMS",
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
