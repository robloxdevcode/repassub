import { stripCaptchaFromTheme } from "@/lib/easter-eggs";

export function stripStrictFromTheme(theme: string) {
  return theme.replace(/__strict/g, "").replace(/__$/, "") || "default";
}

export function themeUsesStrictVerification(theme: string) {
  return theme.includes("__strict");
}

export function applyStrictVerification(theme: string, enabled: boolean) {
  const base = stripStrictFromTheme(stripCaptchaFromTheme(theme));
  return enabled ? `${base}__strict` : base;
}

export function displayUnlockTheme(theme: string) {
  return stripStrictFromTheme(stripCaptchaFromTheme(theme));
}
