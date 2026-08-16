import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-retro-bg">
      <header className="border-b border-retro-border bg-retro-surface px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="font-body text-lg font-semibold text-retro-error">
            Admin
          </h1>
          <nav className="flex gap-2">
            {[
              { href: "/admin", label: "Overview" },
              { href: "/admin/users", label: "Users" },
              { href: "/admin/unlocks", label: "Unlocks" },
              { href: "/admin/reports", label: "Reports" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-8">{children}</main>
    </div>
  );
}
