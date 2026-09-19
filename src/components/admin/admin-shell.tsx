import Link from "next/link";
import { cn } from "@/lib/utils";

export function AdminShell({
  children,
  showStaffTab,
  canModerate,
}: {
  children: React.ReactNode;
  showStaffTab: boolean;
  canModerate: boolean;
}) {
  const links = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "People" },
    { href: "/admin/links", label: "Links" },
    { href: "/admin/reports", label: "Reports" },
    ...(showStaffTab ? [{ href: "/admin/staff", label: "Staff roles" }] : []),
  ];

  return (
    <div className="admin-v2 min-h-screen">
      <header className="admin-v2-header">
        <div className="admin-v2-header-inner">
          <div>
            <p className="admin-v2-kicker">Linklock</p>
            <h1 className="admin-v2-title">Control center</h1>
          </div>
          <nav className="admin-v2-nav" aria-label="Admin">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="admin-v2-nav-link">
                {link.label}
              </Link>
            ))}
            <Link href="/dashboard" className="admin-v2-nav-link admin-v2-nav-link--muted">
              Exit
            </Link>
          </nav>
        </div>
        {!canModerate ? (
          <p className="admin-v2-banner">
            Read-only staff access (Tester) — contact Admin or Owner for moderation actions.
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
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("admin-v2-table-wrap", className)}>{children}</div>;
}
