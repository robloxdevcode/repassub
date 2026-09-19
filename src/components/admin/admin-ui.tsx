"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinkBase =
  "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors";

export function AdminNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Admin">
      {links.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              navLinkBase,
              active
                ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/25"
                : "border-stone-200 bg-white text-stone-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/dashboard"
        className={cn(
          navLinkBase,
          "border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200"
        )}
      >
        Exit to dashboard
      </Link>
    </nav>
  );
}

export function AdminStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border-2 border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-2xl font-extrabold tracking-tight text-stone-900 tabular-nums">{value}</p>
      <p className="mt-1 text-sm font-medium text-stone-500">{label}</p>
    </div>
  );
}

export function AdminPageTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-stone-900">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">{description}</p>
      ) : null}
    </div>
  );
}

export function AdminTableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border-2 border-stone-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export const adminTableClass =
  "w-full min-w-[640px] border-collapse text-sm text-stone-800";

export const adminThClass =
  "border-b-2 border-stone-200 bg-stone-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-stone-500";

export const adminTdClass = "border-b border-stone-100 px-4 py-3 align-middle";
