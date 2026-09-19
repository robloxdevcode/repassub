import { BUSINESS } from "@/lib/ratu-taisykla/site-data";

export function RtStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: BUSINESS.name,
    description:
      "Profesionalus ratų servisas Vilniuje — padangų montavimas, remontas, balansavimas ir automobilių priežiūra.",
    telephone: BUSINESS.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      postalCode: BUSINESS.address.postal,
      addressCountry: "LT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 54.6694,
      longitude: 25.2797,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.rating,
      reviewCount: BUSINESS.reviewCount,
      bestRating: 5,
    },
    areaServed: {
      "@type": "City",
      name: "Vilnius",
    },
    knowsLanguage: ["lt", "ru"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
