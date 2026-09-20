import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { NotFoundSnakeGame } from "@/components/marketing/not-found-snake";

export const metadata: Metadata = buildPageMetadata({
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return <NotFoundSnakeGame />;
}
