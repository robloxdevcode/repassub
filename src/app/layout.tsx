import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { RetroToastProvider } from "@/components/retro";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1007476096338167";

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} h-full`}>
      <head>
        <script async src={ADSENSE_SRC} crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-body antialiased bg-retro-bg text-retro-text">
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#8b5cf6",
              colorBackground: "#fffdf8",
              borderRadius: "0.625rem",
              fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
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
