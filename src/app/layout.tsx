import type { Metadata } from "next";
import { Press_Start_2P, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { RetroToastProvider } from "@/components/retro";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import { buildRootMetadata } from "@/lib/seo";
import { AdSenseScript } from "@/components/ads/adsense-script";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        variables: {
          colorPrimary: "#ff2b2b",
          colorBackground: "#ffffff",
        },
      }}
    >
      <html lang="en" className={`${pressStart.variable} ${spaceGrotesk.variable} h-full`}>
        <body className="min-h-full flex flex-col font-body antialiased bg-retro-bg text-retro-text">
          <AdSenseScript />
          <PostHogProvider>
            <CurrencyProvider>
              <RetroToastProvider>{children}</RetroToastProvider>
            </CurrencyProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
