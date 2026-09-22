import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-ui";
import { AdminCommandMenu } from "@/components/admin/admin-command-menu";

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
          <AdminNav links={links} />
          <div className="admin-v2-toolbar w-full sm:w-auto sm:ml-auto">
            <AdminCommandMenu navLinks={links} />
            <Link href="/dashboard" className="admin-v2-toolbar-btn">
              Dashboard
            </Link>
          </div>
        </div>
        {!canModerate ? (
          <p className="admin-v2-banner">
            Read-only staff (Tester) — contact Admin or Owner for moderation actions.
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
  return <div className={`admin-v2-table-wrap ${className ?? ""}`.trim()}>{children}</div>;
}
