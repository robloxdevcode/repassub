"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MarketingNavActions } from "@/components/marketing/marketing-nav-actions";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { cn } from "@/lib/utils";

const links = [{ href: "/pricing", label: "Pricing" }];

export function RetroNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <header className={cn("ll-nav", onHome && "lm-nav--home")}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 h-16">
        <Link href="/" prefetch className="flex items-center gap-2 shrink-0 min-w-0 lm-focus-ring rounded-md">
          <LinklockLogo
            size={36}
            showWordmark
            wordmarkClassName={cn("hidden sm:inline", onHome ? "text-white" : "text-retro-text")}
          />
        </Link>

        <nav className="hidden sm:flex items-center gap-1" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={cn(
                "ll-nav-link lm-focus-ring",
                onHome && "lm-nav-link--home",
                pathname === link.href && "ll-nav-link--active"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MarketingNavActions onHome={onHome} />
      </div>
    </header>
  );
}
