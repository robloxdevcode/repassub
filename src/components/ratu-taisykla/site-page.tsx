import { RtAbout } from "./about";
import { RtContact } from "./contact";
import { RtFinalCta } from "./final-cta";
import { RtFooter } from "./footer";
import { RtHero } from "./hero";
import { RtNavbar } from "./navbar";
import { RtReviews } from "./reviews";
import { RtServices } from "./services";
import { RtStructuredData } from "./structured-data";
import { RtWhyUs } from "./why-us";

export function RatuTaisyklaPage() {
  return (
    <>
      <RtStructuredData />
      <RtNavbar />
      <main>
        <RtHero />
        <RtServices />
        <RtWhyUs />
        <RtReviews />
        <RtAbout />
        <RtContact />
        <RtFinalCta />
      </main>
      <RtFooter />
    </>
  );
}
