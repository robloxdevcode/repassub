import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Allow search engines and AI crawlers on public marketing content. */
const PUBLIC_ALLOW = ["/", "/llms.txt", "/llms-full.txt", "/ads.txt", "/sitemap.xml", "/feed.xml"];

const APP_DISALLOW = [
  "/dashboard",
  "/admin",
  "/create",
  "/unlocks",
  "/analytics",
  "/audience",
  "/settings",
  "/profile",
  "/billing",
  "/payments",
  "/forgot-password",
  "/u/",
  "/api",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Google-adstxt",
        allow: "/ads.txt",
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/ads.txt",
      },
      {
        userAgent: "*",
        allow: PUBLIC_ALLOW,
        disallow: APP_DISALLOW,
      },
      {
        userAgent: "GPTBot",
        allow: PUBLIC_ALLOW,
        disallow: APP_DISALLOW,
      },
      {
        userAgent: "ChatGPT-User",
        allow: PUBLIC_ALLOW,
        disallow: APP_DISALLOW,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: PUBLIC_ALLOW,
        disallow: APP_DISALLOW,
      },
      {
        userAgent: "ClaudeBot",
        allow: PUBLIC_ALLOW,
        disallow: APP_DISALLOW,
      },
      {
        userAgent: "anthropic-ai",
        allow: PUBLIC_ALLOW,
        disallow: APP_DISALLOW,
      },
      {
        userAgent: "PerplexityBot",
        allow: PUBLIC_ALLOW,
        disallow: APP_DISALLOW,
      },
      {
        userAgent: "Google-Extended",
        allow: PUBLIC_ALLOW,
        disallow: APP_DISALLOW,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl(),
  };
}
