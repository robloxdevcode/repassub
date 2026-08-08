import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-retro-bg">
      <header className="border-b-2 border-retro-error/50 bg-retro-surface px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="font-display text-lg tracking-wider text-retro-error">
            ADMIN // CONTROL CENTER
          </h1>
          <nav className="flex gap-4">
            {[
              { href: "/admin", label: "OVERVIEW" },
              { href: "/admin/users", label: "USERS" },
              { href: "/admin/unlocks", label: "UNLOCKS" },
              { href: "/admin/reports", label: "REPORTS" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-xs tracking-widest text-retro-text-dim hover:text-retro-error"
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
