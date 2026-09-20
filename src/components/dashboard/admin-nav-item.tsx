"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminPanelAccessForSession } from "@/lib/actions/session-access";

export function AdminNavItem({
  initialShow,
  active,
  onNavigate,
}: {
  initialShow: boolean;
  active: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const { user: clerkUser, isLoaded } = useUser();
  const [show, setShow] = useState(initialShow);

  useEffect(() => {
    setShow(initialShow);
  }, [initialShow]);

  useEffect(() => {
    let cancelled = false;

    async function refreshAccess() {
      try {
        const fromDb = await getAdminPanelAccessForSession();
        if (!cancelled && fromDb) setShow(true);
      } catch {
        /* ignore */
      }
    }

    void refreshAccess();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    if (!isLoaded || !clerkUser) return;
    const meta = clerkUser.publicMetadata as Record<string, unknown> | undefined;
    if (meta?.linklockAdminPanel === true) setShow(true);
  }, [isLoaded, clerkUser]);

  if (!show) return null;

  return (
    <Link
      href="/admin"
      prefetch
      onClick={onNavigate}
      className={cn("sidebar-nav-item", active && "sidebar-nav-active")}
    >
      <Shield size={17} strokeWidth={2} aria-hidden />
      Admin
    </Link>
  );
}
