"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Lock, Plus, Settings, User, CreditCard, Menu, X, Shield, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { AppNavProgress } from "@/components/dashboard/app-nav-progress";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";

const mainNavItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/unlocks", label: "My links", icon: Lock },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ isAdmin = false, plan = "FREE" }: { isAdmin?: boolean; plan?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onCreate = pathname.startsWith("/create");

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 md:hidden ll-app-card p-2 touch-manipulation active:scale-95 transition-transform duration-75"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={cn(
          "app-sidebar fixed inset-y-0 left-0 z-40 w-60 text-retro-text border-r border-retro-border transition-transform duration-150 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <Link href="/dashboard" prefetch className="mb-6 px-2 block" onClick={() => setOpen(false)}>
            <LinklockLogo size={36} showWordmark wordmarkClassName="text-retro-text" />
          </Link>

          <Link
            href="/create"
            prefetch
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
                  prefetch
                  onClick={() => setOpen(false)}
                  className={cn(
                    "sidebar-nav-item rounded-lg",
                    active ? "sidebar-nav-active" : "text-retro-text-dim hover:text-retro-text"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                prefetch
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

          <div className="border-t border-retro-border pt-4 mt-2">
            <ClerkUserMenu plan={plan} />
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}

export function AppShell({
  children,
  isAdmin = false,
  plan = "FREE",
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
  plan?: string;
}) {
  return (
    <>
      <AppNavProgress />
      <AppSidebar isAdmin={isAdmin} plan={plan} />
      <div className="app-stage md:ml-60 min-h-screen">
        <main className="p-4 pt-16 md:p-8 md:pt-10">{children}</main>
      </div>
    </>
  );
}
