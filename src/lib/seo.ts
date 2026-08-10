import type { Metadata } from "next";
import type { MetadataRoute } from "next";

export const SITE_NAME = "Linklock";

export const DEFAULT_KEYWORDS = [
  "subscribe to download",
  "unlock link",
  "content gating",
  "creator unlock page",
  "youtube subscribe download",
  "discord join download",
  "free unlock links",
  "link in bio tool",
  "preset pack download",
  "Rekonise alternative",
];

const DEFAULT_DESCRIPTION =
  "Make them follow, then unlock. Free subscribe-to-download links for creators — gate files behind YouTube, Discord, Spotify, and more.";

export const HOME_FAQS = [
  {
    q: "Is Linklock free?",
    a: "Yes. 5 unlock links per week, 2 steps each, basic stats. No credit card to sign up.",
  },
  {
    q: "What can I give away?",
    a: "Any link — Drive, Dropbox, your site — or text after unlock. We don't host files.",
  },
  {
    q: "How many steps can I add?",
    a: "Free: 2 per link. Pro: 4. YouTube, Discord, Spotify, and more.",
  },
  {
    q: "Do fans need an account?",
    a: "No. They open your link, finish your steps, and get the content.",
  },
  {
    q: "What does Pro include?",
    a: "No ads, unlimited links, custom branding, and conversion stats.",
  },
];

export function getSiteUrl() {
  const configured =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  const url = configured || "https://linklock.org";
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path = "") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  openGraphType?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  keywords = DEFAULT_KEYWORDS,
  noIndex = false,
  openGraphType = "website",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: openGraphType,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [{ url: "/logo.png", width: 194, height: 133, alt: `${SITE_NAME} logo` }],
    },
    twitter: {
      card: "summary",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: ["/logo.png"],
    },
  };
}

export function buildRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Linklock — Free Subscribe-to-Download Links for Creators",
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: siteUrl }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "technology",
    robots: { index: true, follow: true },
    alternates: { canonical: siteUrl },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: SITE_NAME,
      title: "Linklock — Free Subscribe-to-Download Links for Creators",
      description: DEFAULT_DESCRIPTION,
      images: [{ url: "/logo.png", width: 194, height: 133, alt: `${SITE_NAME} logo` }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Linklock — Free Subscribe-to-Download Links for Creators",
      description: DEFAULT_DESCRIPTION,
      images: ["/logo.png"],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/logo.png", type: "image/png", sizes: "194x133" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "194x133" }],
      shortcut: ["/favicon.ico"],
    },
  };
}

export function organizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: absoluteUrl("/logo.png"),
    description: DEFAULT_DESCRIPTION,
  };
}

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: DEFAULT_DESCRIPTION,
  };
}

export function softwareApplicationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description: DEFAULT_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Free tier with 5 links per week",
    },
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export const SITEMAP_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/how-it-works", priority: 0.85, changeFrequency: "monthly" },
  { path: "/features", priority: 0.85, changeFrequency: "monthly" },
  { path: "/creators", priority: 0.8, changeFrequency: "monthly" },
  { path: "/examples", priority: 0.75, changeFrequency: "monthly" },
  { path: "/use-cases", priority: 0.75, changeFrequency: "monthly" },
  { path: "/support", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs", priority: 0.65, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.65, changeFrequency: "weekly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];
