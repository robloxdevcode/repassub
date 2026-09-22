const STORAGE_KEY = "linklock-reduce-motion";

export function getReduceMotionPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setReduceMotionPreference(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    /* ignore quota / private mode */
  }
  applyReduceMotionClass(enabled);
}

export function applyReduceMotionClass(enabled?: boolean): void {
  if (typeof document === "undefined") return;
  const on = enabled ?? getReduceMotionPreference();
  document.documentElement.classList.toggle("linklock-reduce-motion", on);
}

export function prefersOsReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldDisableHeavyMotion(): boolean {
  return getReduceMotionPreference() || prefersOsReducedMotion();
}
