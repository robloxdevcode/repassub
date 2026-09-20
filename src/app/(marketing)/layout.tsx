import { ClassicMarketingChrome } from "@/components/marketing/classic-marketing-chrome";
import { isMaintenanceMode } from "@/lib/site-mode";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  if (isMaintenanceMode()) {
    return <>{children}</>;
  }
  return <ClassicMarketingChrome>{children}</ClassicMarketingChrome>;
}
