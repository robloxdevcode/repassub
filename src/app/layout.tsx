import type { Metadata } from "next";

import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { RetroToastProvider } from "@/components/retro";

import { CurrencyProvider } from "@/components/providers/currency-provider";

import { buildRootMetadata } from "@/lib/seo";
import { getAdSenseClient } from "@/lib/adsense-config";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { getClerkProviderProps } from "@/lib/clerk-config";

import "./globals.css";
import "./linklock-v2.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clerk = getClerkProviderProps();
  const adsenseClient = getAdSenseClient();
  const adsenseSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <script async src={adsenseSrc} crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-body antialiased bg-retro-bg text-retro-text">
        <ClerkProvider
          {...clerk}
          appearance={{
            ...clerkAuthAppearance,
            variables: {
              ...clerkAuthAppearance.variables,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            },
          }}
        >
          <CurrencyProvider>
            <RetroToastProvider>{children}</RetroToastProvider>
          </CurrencyProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
