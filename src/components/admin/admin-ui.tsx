"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function AdminNavLink({
  href,
  label,
  muted,
  prefetch = true,
}: {
  href: string;
  label: string;
  muted?: boolean;
  prefetch?: boolean;
}) {
  const pathname = usePathname();
  const active = !muted && (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(
        "admin-v2-nav-link",
        active && "admin-v2-nav-link--active",
        muted && "admin-v2-nav-link--muted",
      )}
    >
      {label}
    </Link>
  );
}

export function AdminNav({ links }: { links: { href: string; label: string }[] }) {
  return (
    <nav className="admin-v2-nav" aria-label="Admin">
      {links.map((link) => (
        <AdminNavLink key={link.href} href={link.href} label={link.label} />
      ))}
      <AdminNavLink href="/dashboard" label="Exit" muted prefetch={false} />
    </nav>
  );
}
