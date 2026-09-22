import type { Metadata } from "next";

import { Inter, Pixelify_Sans, Press_Start_2P } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { RetroToastProvider } from "@/components/retro";

import { CurrencyProvider } from "@/components/providers/currency-provider";
import { MotionPreferenceInit } from "@/components/providers/motion-preference-init";

import { buildRootMetadata } from "@/lib/seo";
import { getAdSenseClient } from "@/lib/adsense-config";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { getClerkProviderProps } from "@/lib/clerk-config";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-press-start",
  weight: "400",
  display: "swap",
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clerk = getClerkProviderProps();
  const adsenseClient = getAdSenseClient();
  const adsenseSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${pressStart.variable} ${pixelify.variable} h-full`}
    >
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
              fontFamily: "var(--font-pixelify), var(--font-inter), system-ui, sans-serif",
              fontFamilyButtons: "var(--font-pixelify), var(--font-inter), system-ui, sans-serif",
            },
          }}
        >
          <CurrencyProvider>
            <MotionPreferenceInit />
            <RetroToastProvider>{children}</RetroToastProvider>
          </CurrencyProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
