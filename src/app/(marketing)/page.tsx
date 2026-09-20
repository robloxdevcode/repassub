import type { Metadata } from "next";
import { LinklockDownPage } from "@/components/marketing/linklock-down-page";

export const metadata: Metadata = {
  title: "Linklock — down for maintenance",
  description: "Linklock is temporarily offline while we make things better. Please try again later.",
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return <LinklockDownPage />;
}
