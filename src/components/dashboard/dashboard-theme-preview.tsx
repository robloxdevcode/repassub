import type { AppTheme } from "@/lib/profile-settings";
import { cn } from "@/lib/utils";

export function DashboardThemePreview({
  theme,
  className,
}: {
  theme: AppTheme;
  className?: string;
}) {
  return (
    <div
      className={cn("dashboard-theme-preview", className)}
      data-app-theme={theme}
      aria-label={`Dashboard theme preview: ${theme}`}
    >
      <div className="dashboard-theme-preview-chrome">
        <div className="dashboard-theme-preview-sidebar">
          <span className="dashboard-theme-preview-sidebar-label">Sidebar</span>
          <span className="dashboard-theme-preview-nav-line" />
          <span className="dashboard-theme-preview-nav-line dashboard-theme-preview-nav-line--short" />
          <span className="dashboard-theme-preview-nav-line dashboard-theme-preview-nav-line--active" />
        </div>
        <div className="dashboard-theme-preview-stage">
          <span className="dashboard-theme-preview-stage-label">Workspace</span>
          <div className="dashboard-theme-preview-card" />
          <div className="dashboard-theme-preview-card dashboard-theme-preview-card--sm" />
        </div>
      </div>
    </div>
  );
}
