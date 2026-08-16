import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { RetroToastProvider } from "@/components/retro";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1007476096338167";

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full`}>
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
              colorPrimary: "#4f46e5",
              colorBackground: "#ffffff",
              borderRadius: "0.75rem",
              fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
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
