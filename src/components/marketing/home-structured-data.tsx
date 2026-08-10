import {
  faqJsonLd,
  HOME_FAQS,
  organizationJsonLd,
  softwareApplicationJsonLd,
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
        faqJsonLd(HOME_FAQS),
      ]}
    />
  );
}
