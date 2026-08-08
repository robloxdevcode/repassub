import { AppShell } from "@/components/dashboard/app-sidebar";
import { syncClerkUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await syncClerkUser();
  return <AppShell>{children}</AppShell>;
}
