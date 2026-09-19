import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

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
        allow: ["/", "/ads.txt"],
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
          "/forgot-password",
          "/u/",
          "/api",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl(),
  };
}
