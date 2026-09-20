import { ClassicMarketingChrome } from "@/components/marketing/classic-marketing-chrome";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user?.banned) redirect("/suspended");

  return <ClassicMarketingChrome>{children}</ClassicMarketingChrome>;
}
