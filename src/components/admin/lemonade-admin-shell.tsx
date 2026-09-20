import Link from "next/link";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-ui";
import { AdminCommandMenu } from "@/components/admin/admin-command-menu";

type NavLink = { href: string; label: string };

export function LemonadeAdminShell({
  children,
  showStaffTab,
  canModerate,
}: {
  children: ReactNode;
  showStaffTab: boolean;
  canModerate: boolean;
}) {
  const links: NavLink[] = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "People" },
    { href: "/admin/links", label: "Links" },
    { href: "/admin/reports", label: "Reports" },
    ...(showStaffTab ? [{ href: "/admin/staff", label: "Staff" }] : []),
  ];

  return (
    <div className="classic-shell admin-v2 min-h-screen bg-retro-bg">
      <header className="admin-v2-header sticky top-0 z-40 bg-retro-surface border-b-[3px] border-[#0a0a0a]">
        <div className="admin-v2-header-inner">
          <div className="flex flex-col gap-1">
            <p className="admin-v2-kicker font-display text-[0.5rem] uppercase">Linklock admin</p>
            <h1 className="admin-v2-title text-lg font-bold tracking-tight font-display text-[0.5625rem] uppercase leading-relaxed">
              Control center
            </h1>
          </div>
          <AdminNav links={links} />
          <div className="admin-v2-toolbar w-full sm:w-auto sm:ml-auto">
            <AdminCommandMenu navLinks={links} />
            <Link href="/dashboard" className="admin-v2-toolbar-btn">
              ← Dashboard
            </Link>
          </div>
        </div>
        {!canModerate ? (
          <p className="admin-v2-banner px-6 pb-3 text-amber-800 bg-amber-50 border-b border-amber-100">
            Read-only staff — moderation requires Admin or Owner role.
          </p>
        ) : null}
      </header>
      <main className="admin-v2-main">{children}</main>
    </div>
  );
}

export function AdminTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`admin-v2-table-wrap ${className ?? ""}`.trim()}>{children}</div>;
}
