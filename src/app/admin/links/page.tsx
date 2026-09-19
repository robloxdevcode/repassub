import Link from "next/link";
import { Suspense } from "react";
import { getAdminLinks } from "@/lib/actions/dashboard";
import { AdminSearchBar } from "@/components/admin/admin-search";
import { AdminTable } from "@/components/admin/admin-shell";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminLinksPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const campaigns = await getAdminLinks(q);

  return (
    <div className="admin-v2-section">
      <div className="admin-v2-section-head">
        <div>
          <h2 className="admin-v2-h2">Links</h2>
          <p className="admin-v2-muted">Every unlock page on the platform — open live URLs or filter by creator.</p>
        </div>
        <Suspense fallback={null}>
          <AdminSearchBar placeholder="Search title, slug, username…" />
        </Suspense>
      </div>

      <AdminTable>
        <table className="admin-v2-table">
          <thead>
            <tr>
              {["Title", "Creator", "Status", "Views", "Live link", "Created"].map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-v2-empty">
                  No links found.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => {
                const path = `/u/${c.user.username}/${c.slug}`;
                return (
                  <tr key={c.id}>
                    <td className="admin-v2-strong">{c.title}</td>
                    <td>@{c.user.username}</td>
                    <td>
                      <span className="admin-v2-badge">{c.status}</span>
                    </td>
                    <td>{c._count.analyticsEvents}</td>
                    <td>
                      {c.status === "PUBLISHED" ? (
                        <Link href={path} target="_blank" className="admin-v2-link">
                          Open
                        </Link>
                      ) : (
                        <span className="admin-v2-muted">Draft</span>
                      )}
                    </td>
                    <td className="admin-v2-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
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
