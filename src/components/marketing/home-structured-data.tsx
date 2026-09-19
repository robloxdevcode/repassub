import {
  faqJsonLd,
  HOME_FAQS,
  HOME_META_DESCRIPTION,
  organizationJsonLd,
  softwareApplicationJsonLd,
  webPageJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/marketing/json-ld";

export function HomeStructuredData() {
  return (
    <JsonLd
      data={[
        organizationJsonLd(),
        websiteJsonLd(),
        softwareApplicationJsonLd(),
        webPageJsonLd({
          name: "Linklock — Free Subscribe-to-Download Links",
          description: HOME_META_DESCRIPTION,
          path: "/",
        }),
        faqJsonLd(HOME_FAQS),
      ]}
    />
  );
}
