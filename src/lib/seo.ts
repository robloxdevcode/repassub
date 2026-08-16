import type { Metadata } from "next";
import type { MetadataRoute } from "next";

export const SITE_NAME = "Linklock";

export const DEFAULT_KEYWORDS = [
  "subscribe to download",
  "unlock link",
  "content locker",
  "link gate",
  "social unlock",
  "content gating",
  "creator unlock page",
  "70+ platforms supported",
  "multi platform unlock",
  "free unlock links",
  "link in bio tool",
  "preset pack download",
  "Rekonise alternative",
  "link monetization",
  "follow to unlock",
  "subscribe to unlock",
  "gated download link",
  "Linklock",
  "linklock.org",
  "social media unlock page",
  "fan gate download",
];

const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — subscribe-to-download links for creators`,
};

const DEFAULT_DESCRIPTION =
  "Gate downloads behind follows and subs. Unlimited free links, 4 fan steps, 70+ platforms — Pro adds 10 steps, branding, and analytics.";

export const HOME_FAQS = [
  {
    q: "Is Linklock free?",
    a: "Yes. Unlimited links, 4 steps per link, and starter stats — no credit card to sign up.",
  },
  {
    q: "What can I give away?",
    a: "Any link you host — or text after unlock. We don't host files; you keep your existing links.",
  },
  {
    q: "How many steps can I add?",
    a: "Free: 4 per link. Pro: 10. Over 70+ platforms supported.",
  },
  {
    q: "Do fans need an account?",
    a: "No. They open your link, finish your steps, and get the content.",
  },
  {
    q: "What does Pro include?",
    a: "10 steps per link, full page branding, deep analytics, and no Linklock ads.",
  },
];

export const SUPPORT_FAQS = [
  {
    q: "Is Linklock really free?",
    a: "Yes. Unlimited links and 4 steps per link on Free. No credit card to sign up.",
  },
  {
    q: "What can I give away?",
    a: "Any download link you host or text/code shown after unlock.",
  },
  {
    q: "Do fans need an account?",
    a: "No. They complete your steps and get the content — no Linklock sign-up for them.",
  },
  {
    q: "Something broken?",
    a: "Email us and we'll help.",
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
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [OG_IMAGE.url],
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
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: "Linklock — Free Subscribe-to-Download Links for Creators",
      description: DEFAULT_DESCRIPTION,
      images: [OG_IMAGE.url],
    },
    icons: {
      icon: [{ url: "/favicon.ico", sizes: "any" }],
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
      description: "Free tier — unlimited links, 4 steps per link",
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

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
}) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.datePublished,
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
    mainEntityOfPage: absoluteUrl(input.path),
    image: absoluteUrl(OG_IMAGE.url),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function pricingJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SITE_NAME} Pro`,
    description: "Unlimited links, 10 steps per link, on-brand pages, deep analytics, and no Linklock ads.",
    brand: { "@type": "Brand", name: SITE_NAME },
    url: absoluteUrl("/pricing"),
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "EUR",
        url: siteUrl,
        description: "Unlimited links free · 4 steps per link",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "6.99",
        priceCurrency: "EUR",
        url: absoluteUrl("/pricing"),
        description: "10 steps per link, branding, analytics, no ads",
      },
    ],
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
  { path: "/use-cases", priority: 0.75, changeFrequency: "monthly" },
  { path: "/support", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs", priority: 0.65, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.65, changeFrequency: "weekly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
];
