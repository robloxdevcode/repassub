"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import { useState } from "react";

import { LayoutDashboard, Lock, Plus, Settings, Menu, X, Shield, BarChart3, CreditCard, User } from "lucide-react";

import { cn } from "@/lib/utils";

import { LinklockLogo } from "@/components/brand/linklock-logo";

import { AppNavProgress } from "@/components/dashboard/app-nav-progress";

import { ClerkUserMenu } from "@/components/dashboard/clerk-user-menu";

import { isProPlanName } from "@/components/dashboard/plan-badge";

import { EasterEggNavLink } from "@/components/easter-egg/easter-egg-nav-link";

import { useEasterEggTrigger } from "@/components/easter-egg/use-easter-egg-trigger";



const mainNavItems = [

  { href: "/dashboard", label: "Home", icon: LayoutDashboard },

  { href: "/unlocks", label: "My links", icon: Lock, eggId: "vault-shelf" as const, clicks: 3 },

  { href: "/analytics", label: "Stats", icon: BarChart3 },

  { href: "/profile", label: "Profile", icon: User, eggId: "mirror-touch" as const, clicks: 5 },

  { href: "/settings", label: "Settings", icon: Settings },

];



export function AppSidebar({ showAdminPanel = false, plan = "FREE" }: { showAdminPanel?: boolean; plan?: string }) {

  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const onCreate = pathname.startsWith("/create");

  const onBilling = pathname.startsWith("/billing");

  const isPro = isProPlanName(plan);

  const grapeTrigger = useEasterEggTrigger("grape-key", 7);

  const boltTrigger = useEasterEggTrigger("bolt-chaser", 5);



  return (

    <>

      <button

        className="fixed left-4 top-4 z-50 md:hidden rounded-[var(--ui-radius-lg)] border border-retro-border bg-retro-surface p-2.5 shadow-sm touch-manipulation"

        onClick={() => setOpen(!open)}

        aria-label={open ? "Close menu" : "Open menu"}

      >

        {open ? <X size={18} /> : <Menu size={18} />}

      </button>



      <aside
        className={cn(
          "app-sidebar dash-pro-sidebar fixed inset-y-0 left-0 z-40 w-[17.5rem] border-r border-retro-border bg-retro-surface transition-transform duration-200 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >

        <div className="flex h-full flex-col p-5">

          <Link

            href="/dashboard"

            prefetch

            className="mb-6 px-1 block"

            onClick={(event) => {

              void grapeTrigger(event);

              if (!event.defaultPrevented) setOpen(false);

            }}

          >

            <LinklockLogo size={40} showWordmark wordmarkClassName="text-retro-text" />

          </Link>



          <Link

            href="/create"

            prefetch

            onClick={(event) => {

              void boltTrigger(event);

              if (!event.defaultPrevented) setOpen(false);

            }}

            className={cn("sidebar-primary-cta", onCreate && "sidebar-primary-cta--active")}

          >

            <Plus size={18} strokeWidth={2} />

            Create link

          </Link>



          <nav className="mt-6 flex flex-1 flex-col gap-0.5">

            {mainNavItems.map((item) => {

              const active = pathname.startsWith(item.href);

              if (item.eggId) {

                return (

                  <EasterEggNavLink

                    key={item.href}

                    href={item.href}

                    eggId={item.eggId}

                    clicks={item.clicks ?? 3}

                    icon={item.icon}

                    label={item.label}

                    active={active}

                    onNavigate={() => setOpen(false)}

                  />

                );

              }

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



            {showAdminPanel && (

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



          <div className="sidebar-footer mt-auto pt-4 border-t border-retro-border w-full">

            <Link

              href="/billing"

              prefetch

              onClick={() => setOpen(false)}

              className={cn("sidebar-billing-row", onBilling && "sidebar-billing-row--active")}

            >

              <CreditCard size={18} className="text-retro-text-muted" />

              <span>

                <span className="block text-sm font-medium text-retro-text">

                  {isPro ? "Pro" : "Free plan"}

                </span>

                <span className="block text-xs text-retro-text-muted mt-0.5">

                  {isPro ? "Manage subscription" : "Upgrade for more steps"}

                </span>

              </span>

            </Link>

            <ClerkUserMenu />

          </div>

        </div>

      </aside>



      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

    </>

  );

}



export function AppShell({

  children,

  showAdminPanel = false,

  plan = "FREE",

}: {

  children: React.ReactNode;

  showAdminPanel?: boolean;

  plan?: string;

}) {

  return (

    <>

      <AppNavProgress />

      <AppSidebar showAdminPanel={showAdminPanel} plan={plan} />

      <div className="app-stage dash-pro-stage md:ml-[17.5rem] min-h-screen">
        <main className="dash-pro-main">{children}</main>
      </div>

    </>

  );

}


