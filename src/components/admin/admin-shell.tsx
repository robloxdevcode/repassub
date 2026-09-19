import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-ui";
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
    <div className="min-h-screen bg-[#fffaf5] text-stone-900">
      <header className="border-b-2 border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Linklock</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">Control center</h1>
          </div>
          <AdminNav links={links} />
        </div>
        {!canModerate ? (
          <p className="mx-4 mb-4 max-w-6xl rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 md:mx-8">
            Read-only staff (Tester) — contact Admin or Owner to ban users or resolve reports.
          </p>
        ) : null}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">{children}</main>
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
  return (
    <div className={cn("overflow-x-auto rounded-xl border-2 border-stone-200 bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}
