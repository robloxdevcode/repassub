import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
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
          "/sign-in",
          "/sign-up",
          "/forgot-password",
          "/u/",
          "/api",
        ],      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl(),
  };
}
