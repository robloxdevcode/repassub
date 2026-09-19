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
    <header className="ll-nav llv2-nav">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 h-16">
        <Link href="/" prefetch className="flex items-center gap-2 shrink-0 min-w-0">
          <LinklockLogo size={36} showWordmark wordmarkClassName="hidden sm:inline text-retro-text" />
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={cn("ll-nav-link", pathname === link.href && "ll-nav-link--active")}
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
