"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminNav({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="admin-v2-nav" aria-label="Admin">
      {links.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn("admin-v2-nav-link", active && "admin-v2-nav-link--active")}
          >
            {link.label}
          </Link>
        );
      })}
      <Link href="/dashboard" className="admin-v2-nav-link admin-v2-nav-link--muted">
        Exit
      </Link>
    </nav>
  );
}
