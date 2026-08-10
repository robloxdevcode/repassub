export const UNLOCK_THEMES = [
  { id: "default", label: "Classic", swatch: "bg-retro-surface border-retro-ink" },
  { id: "red", label: "Red", swatch: "bg-pop-red border-retro-ink" },
  { id: "blue", label: "Blue", swatch: "bg-pop-blue border-retro-ink" },
  { id: "yellow", label: "Yellow", swatch: "bg-pop-yellow border-retro-ink" },
  { id: "dark", label: "Dark", swatch: "bg-retro-ink border-retro-yellow" },
] as const;

export type UnlockThemeId = (typeof UNLOCK_THEMES)[number]["id"];

export function unlockThemeClass(theme?: string | null) {
  const id = UNLOCK_THEMES.some((t) => t.id === theme) ? theme : "default";
  return `unlock-theme-${id}`;
}
