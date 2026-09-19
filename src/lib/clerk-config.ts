/** Clerk provider settings — production domain only in production builds. */

export function isClerkProductionKey(key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "") {
  return key.startsWith("pk_live_");
}

function shouldUseClerkProductionDomain() {
  if (process.env.NODE_ENV !== "production") return false;
  const domain = process.env.NEXT_PUBLIC_CLERK_DOMAIN?.trim();
  if (!domain) return false;
  return isClerkProductionKey();
}

export function getClerkProviderProps() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (process.env.NODE_ENV === "development" && isClerkProductionKey(publishableKey)) {
    console.warn(
      "\n[Clerk] pk_live_ keys only work on linklock.org, not localhost.\n" +
        "Create `.env.development.local` with pk_test_ / sk_test_ from Clerk → Development instance.\n" +
        "See `.env.development.local.example`\n"
    );
  }

  const clerkDomain = process.env.NEXT_PUBLIC_CLERK_DOMAIN?.trim();

  return {
    publishableKey,
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in",
    signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up",
    signInFallbackRedirectUrl:
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? "/dashboard",
    signUpFallbackRedirectUrl:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ?? "/dashboard",
    ...(shouldUseClerkProductionDomain() && clerkDomain
      ? { domain: clerkDomain, isSatellite: false as const }
      : {}),
  };
}
