"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RetroButton } from "@/components/retro";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export function RetroNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-retro-surface border-b-[3px] border-retro-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center bg-retro-accent border-2 border-retro-ink brutal-shadow-sm group-hover:bg-retro-yellow transition-colors">
            <span className="font-display text-[10px] text-white group-hover:text-retro-ink">R</span>
          </div>
          <span className="font-display text-[10px] hidden sm:block">REPASSUB</span>
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
          <ThemeToggle />
          <Link href="/sign-in" className="font-body text-sm font-semibold px-3 py-2 hidden sm:block hover:underline">
            Log in
          </Link>
          <Link href="/sign-up">
            <RetroButton size="sm" variant="primary">Start free</RetroButton>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function TrustMarquee() {
  const items = [
    "500+ CREATORS",
    "NO CARD NEEDED",
    "FREE TO START",
    "UNLIMITED FREE LINKS",
    "SETUP IN 2 MINUTES",
  ];
  const row = [...items, ...items];

  return (
    <div className="bg-ink border-b-[3px] border-retro-ink py-3 marquee-wrap">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i} className="font-display text-[8px] text-retro-yellow whitespace-nowrap">
            ★ {t} ★
          </span>
        ))}
      </div>
    </div>
  );
}
