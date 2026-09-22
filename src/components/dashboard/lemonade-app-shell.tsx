"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Lock,
  Plus,
  Settings,
  Menu,
  X,
  BarChart3,
  CreditCard,
  User,
  Gift,
  Shield,
} from "lucide-react";
import { ClassicAnimatedBackdrop } from "@/components/marketing/classic-animated-backdrop";
import { cn } from "@/lib/utils";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { AppNavProgress } from "@/components/dashboard/app-nav-progress";
import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";
import { isProPlanName } from "@/components/dashboard/plan-badge";
import type { AppTheme } from "@/lib/profile-settings";

const mainNavItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/unlocks", label: "My links", icon: Lock },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
  { href: "/redeem", label: "Redeem a code", icon: Gift },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onNavigate}
      className={cn("sidebar-nav-item", active && "sidebar-nav-active")}
    >
      <Icon size={17} strokeWidth={2} aria-hidden />
      {label}
    </Link>
  );
}

export function LemonadeAppSidebar({
  showAdminPanel = false,
  plan = "FREE",
  appTheme = "classic",
}: {
  showAdminPanel?: boolean;
  plan?: string;
  appTheme?: AppTheme;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const isPro = isProPlanName(plan);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 md:hidden rounded-[var(--ui-radius-lg)] border border-retro-border bg-white p-3 shadow-sm"
        style={{ top: "max(1rem, env(safe-area-inset-top))", left: "max(1rem, env(safe-area-inset-left))" }}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        data-app-theme={appTheme}
        className={cn(
          "app-sidebar dash-pro-sidebar fixed inset-y-0 left-0 z-40 w-[17.5rem] border-r border-retro-border bg-white transition-transform duration-200 md:translate-x-0 overscroll-contain",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-full flex-col p-5">
          <Link href="/dashboard" prefetch className="mb-6 block px-1" onClick={close}>
            <LinklockLogo size={40} showWordmark wordmarkClassName="text-retro-text font-bold" />
          </Link>

          <Link
            href="/create"
            prefetch
            onClick={close}
            className={cn(
              "sidebar-primary-cta flex items-center justify-center gap-2",
              pathname.startsWith("/create") && "sidebar-primary-cta--active",
            )}
          >
            <Plus size={18} strokeWidth={2} aria-hidden />
            Create link
          </Link>

          <nav className="mt-6 flex flex-1 flex-col gap-0.5">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                active={pathname.startsWith(item.href)}
                onNavigate={close}
              />
            ))}
            {showAdminPanel ? (
              <NavItem
                href="/admin"
                label="Staff tools"
                icon={Shield}
                active={pathname.startsWith("/admin")}
                onNavigate={close}
              />
            ) : null}
          </nav>

          <div className="sidebar-footer mt-auto border-t border-retro-border pt-4">
            {!isPro ? (
              <Link
                href="/billing"
                prefetch
                onClick={close}
                className="sidebar-primary-cta mb-3 flex w-full items-center justify-center py-2.5 text-sm"
              >
                Upgrade to Pro
              </Link>
            ) : null}
            <Link
              href="/billing"
              prefetch
              onClick={close}
              className={cn(
                "sidebar-billing-row mb-3",
                pathname.startsWith("/billing") && "sidebar-billing-row--active",
              )}
            >
              <CreditCard size={18} className="text-retro-text-muted" aria-hidden />
              <span>
                <span className="block text-sm font-semibold text-retro-text">
                  {isPro ? "Pro" : "Free plan"}
                </span>
                <span className="block text-xs text-retro-text-muted mt-0.5">
                  {isPro ? "Manage subscription" : "More steps & branding"}
                </span>
              </span>
            </Link>
            <ClerkUserMenu />
          </div>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          aria-label="Close menu"
          onClick={close}
        />
      ) : null}
    </>
  );
}

export function LemonadeAppShell({
  children,
  showAdminPanel = false,
  plan = "FREE",
  appTheme = "classic",
}: {
  children: ReactNode;
  showAdminPanel?: boolean;
  plan?: string;
  appTheme?: AppTheme;
}) {
  return (
    <>
      <AppNavProgress />
      <LemonadeAppSidebar showAdminPanel={showAdminPanel} plan={plan} appTheme={appTheme} />
      <div
        data-app-theme={appTheme}
        className="classic-shell app-stage dash-pro-stage relative min-h-screen bg-retro-bg md:ml-[17.5rem]"
      >
        <ClassicAnimatedBackdrop />
        <main className="dash-pro-main relative z-10 mx-auto w-full max-w-6xl px-4 md:px-8 pb-12">{children}</main>
      </div>
    </>
  );
}
