"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Lock, Plus, BarChart3, Users, Settings, User, CreditCard, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/unlocks", label: "Unlocks", icon: Lock },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/audience", label: "Audience", icon: Users },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 md:hidden bg-retro-yellow border-2 border-retro-ink p-2 brutal-shadow-sm"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 bg-retro-ink text-white border-r-[3px] border-retro-accent transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <Link href="/dashboard" className="mb-8 px-2">
            <span className="font-display text-[10px] text-retro-yellow">REPASSUB</span>
          </Link>

          <nav className="flex flex-1 flex-col gap-0.5">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-body font-medium transition-colors",
                    active ? "bg-retro-accent text-white" : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 pt-4">
            <UserButton />
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <div className="md:ml-60 min-h-screen bg-retro-bg">
        <main className="p-4 pt-16 md:p-8">{children}</main>
      </div>
    </>
  );
}
