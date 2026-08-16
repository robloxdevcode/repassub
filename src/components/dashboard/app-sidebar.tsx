"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Lock, Plus, Settings, Menu, X, Shield, BarChart3, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { AppNavProgress } from "@/components/dashboard/app-nav-progress";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";
import { isProPlanName } from "@/components/dashboard/plan-badge";

const mainNavItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/unlocks", label: "My links", icon: Lock },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ isAdmin = false, plan = "FREE" }: { isAdmin?: boolean; plan?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onCreate = pathname.startsWith("/create");
  const onBilling = pathname.startsWith("/billing");
  const isPro = isProPlanName(plan);

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 md:hidden rounded-[var(--ui-radius)] border border-retro-border bg-retro-surface p-2 touch-manipulation"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={cn(
          "app-sidebar fixed inset-y-0 left-0 z-40 w-64 text-retro-text border-r border-retro-border transition-transform duration-150 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-5">
          <Link href="/dashboard" prefetch className="mb-2 px-1 block" onClick={() => setOpen(false)}>
            <LinklockLogo size={44} showWordmark wordmarkClassName="text-retro-text" />
          </Link>
          <p className="px-1 mb-6 text-xs text-retro-text-muted leading-relaxed">
            Gate files behind subscribe, follow & join steps.
          </p>

          <Link
            href="/create"
            prefetch
            onClick={() => setOpen(false)}
            className={cn("sidebar-primary-cta", onCreate && "sidebar-primary-cta--active")}
          >
            <Plus size={18} strokeWidth={2.5} />
            Create link
          </Link>

          <nav className="mt-5 flex flex-1 flex-col gap-0.5">
            {mainNavItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  onClick={() => setOpen(false)}
                  className={cn("sidebar-nav-item", active && "sidebar-nav-active")}
                >
                  <item.icon size={17} strokeWidth={2} />
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
                  "sidebar-nav-item mt-4 text-retro-error",
                  pathname.startsWith("/admin") && "sidebar-nav-active"
                )}
              >
                <Shield size={17} strokeWidth={2} />
                Admin
              </Link>
            )}
          </nav>

          <div className="mt-auto space-y-3 pt-4 border-t border-retro-border">
            <Link
              href="/billing"
              prefetch
              onClick={() => setOpen(false)}
              className={cn("sidebar-billing-row", onBilling && "sidebar-billing-row--active")}
            >
              <CreditCard size={16} className="shrink-0 text-retro-text-muted" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-retro-text">
                  {isPro ? "Pro plan" : "Free plan"}
                </span>
                <span className="block text-xs text-retro-text-muted truncate">
                  {isPro ? "Manage or cancel" : "Upgrade for branding & stats"}
                </span>
              </span>
            </Link>
            <ClerkUserMenu plan={plan} />
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
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
      <div className="app-stage md:ml-64 min-h-screen">
        <main className="p-4 pt-16 md:px-10 md:py-12 md:pt-12">{children}</main>
      </div>
    </>
  );
}
