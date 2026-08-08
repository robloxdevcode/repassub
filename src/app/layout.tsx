import type { Metadata } from "next";
import { Press_Start_2P, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { RetroToastProvider } from "@/components/retro";
import { PostHogProvider } from "@/components/providers/posthog-provider";
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

export const metadata: Metadata = {
  title: {
    default: "Repassub — Unlock Links for Creators",
    template: "%s | Repassub",
  },
  description:
    "Create unlock links that grow your audience. Gate content behind subscribe, follow, and join actions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#ff2b2b",
          colorBackground: "#ffffff",
        },
      }}
    >
      <html lang="en" className={`${pressStart.variable} ${spaceGrotesk.variable} h-full`}>
        <body className="min-h-full flex flex-col font-body antialiased bg-retro-bg text-retro-text">
          <PostHogProvider>
            <RetroToastProvider>{children}</RetroToastProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
