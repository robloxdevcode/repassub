import Link from "next/link";
import { Suspense } from "react";
import { getAdminLinks } from "@/lib/actions/dashboard";
import { AdminSearchBar } from "@/components/admin/admin-search";
import { AdminTable } from "@/components/admin/admin-shell";
import {
  adminTableClass,
  adminTdClass,
  adminThClass,
  AdminPageTitle,
} from "@/components/admin/admin-ui";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminLinksPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const campaigns = await getAdminLinks(q);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageTitle
          title="Links"
          description="Every unlock page on the platform — open live URLs or filter by creator."
        />
        <Suspense fallback={null}>
          <AdminSearchBar placeholder="Search title, slug, username…" />
        </Suspense>
      </div>

      <AdminTable>
        <table className={adminTableClass}>
          <thead>
            <tr>
              {["Title", "Creator", "Status", "Views", "Live link", "Created"].map((col) => (
                <th key={col} className={adminThClass}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-stone-500">
                  No links found.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => {
                const path = `/u/${c.user.username}/${c.slug}`;
                return (
                  <tr key={c.id}>
                    <td className={`${adminTdClass} font-bold text-stone-900`}>{c.title}</td>
                    <td className={adminTdClass}>@{c.user.username}</td>
                    <td className={adminTdClass}>
                      <span className="inline-flex rounded-full bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-700">
                        {c.status}
                      </span>
                    </td>
                    <td className={adminTdClass}>{c._count.analyticsEvents}</td>
                    <td className={adminTdClass}>
                      {c.status === "PUBLISHED" ? (
                        <Link
                          href={path}
                          target="_blank"
                          className="font-bold text-orange-600 underline underline-offset-2 hover:text-orange-700"
                        >
                          Open
                        </Link>
                      ) : (
                        <span className="text-stone-400">Draft</span>
                      )}
                    </td>
                    <td className={`${adminTdClass} text-stone-500`}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}
