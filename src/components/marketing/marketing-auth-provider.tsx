"use client";

import { createContext, useContext } from "react";
import { useAuth } from "@clerk/nextjs";

const MarketingAuthContext = createContext(false);

export function MarketingAuthProvider({
  initialSignedIn,
  children,
}: {
  initialSignedIn: boolean;
  children: React.ReactNode;
}) {
  return (
    <MarketingAuthContext.Provider value={initialSignedIn}>{children}</MarketingAuthContext.Provider>
  );
}

/** Signed-in state from the server until Clerk hydrates, then Clerk wins. */
export function useMarketingSignedIn() {
  const initialSignedIn = useContext(MarketingAuthContext);
  const { isSignedIn, isLoaded } = useAuth();
  return isLoaded ? !!isSignedIn : initialSignedIn;
}
