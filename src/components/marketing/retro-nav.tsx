"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MarketingNavActions } from "@/components/marketing/marketing-nav-actions";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/support", label: "Support" },
];

export function RetroNav() {
  const pathname = usePathname();

  return (
    <header className="ll-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-[var(--ll-content,72rem)] items-center justify-between gap-8 px-[var(--ll-page-x,1.25rem)] min-h-[5rem]">
        <Link href="/" prefetch className="flex items-center gap-2 shrink-0 min-w-0">
          <LinklockLogo size={60} />
        </Link>

        <nav className="hidden md:flex items-center gap-1 shrink-0">
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
