"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Lock, Plus, Settings, User, CreditCard, Menu, X, Shield, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";

const mainNavItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/unlocks", label: "My links", icon: Lock },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const onCreate = pathname.startsWith("/create");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 md:hidden bg-retro-yellow border-2 border-retro-ink p-2 brutal-shadow-sm"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={cn(
          "app-sidebar fixed inset-y-0 left-0 z-40 w-60 text-white border-r-[3px] border-retro-accent transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <Link href="/dashboard" className="mb-6 px-2 block" onClick={() => setOpen(false)}>
            <LinklockLogo size={36} showWordmark wordmarkClassName="text-retro-yellow" />
          </Link>

          <Link
            href="/create"
            onClick={() => setOpen(false)}
            className={cn(
              "sidebar-nav-item sidebar-nav-create mb-4 font-bold",
              onCreate && "ring-2 ring-white/30"
            )}
          >
            <Plus size={16} />
            Create link
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {mainNavItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "sidebar-nav-item",
                    active ? "sidebar-nav-active text-white" : "text-white/70"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}

            {mounted && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={cn(
                  "sidebar-nav-item mt-3 border border-retro-error/40 text-retro-error hover:bg-retro-error/10",
                  pathname.startsWith("/admin") && "sidebar-nav-active bg-retro-error border-retro-error text-white"
                )}
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
          </nav>

          <div className="border-t border-white/10 pt-4 mt-2">
            <ClerkUserMenu />
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}

export function AppShell({ children, isAdmin = false }: { children: React.ReactNode; isAdmin?: boolean }) {
  return (
    <>
      <AppSidebar isAdmin={isAdmin} />
      <div className="app-stage md:ml-60 min-h-screen">
        <main className="p-4 pt-16 md:p-8 md:pt-10">{children}</main>
      </div>
    </>
  );
}
