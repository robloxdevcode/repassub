export const BUSINESS = {
  name: "Ratų taisykla",
  phone: "+370 677 99978",
  phoneHref: "tel:+37067799978",
  address: {
    street: "Gerosios Vilties g. 32-1",
    city: "Vilnius",
    postal: "03144",
    country: "Lithuania",
    full: "Gerosios Vilties g. 32-1, Vilnius, 03144, Lithuania",
  },
  rating: 4.9,
  reviewCount: 431,
  experienceYears: 35,
  languages: ["Lithuanian", "Russian"] as const,
} as const;

export const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Gerosios+Vilties+g.+32-1,+Vilnius,+03144,+Lithuania";

export const MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=Gerosios+Vilties+g.+32-1,+Vilnius,+03144,+Lithuania&z=16&output=embed";

export const SEO = {
  title: "Ratų taisykla Vilnius — Patikimas ratų servisas | Padangų montavimas",
  description:
    "Ratų taisykla Vilniuje — profesionalus ratų servisas, padangų montavimas ir remontas. Daugiau nei 35 metų patirtis, 4.9★ įvertinimas. Skambinkite +370 677 99978.",
  keywords: [
    "Ratų taisykla Vilnius",
    "ratų servisas Vilnius",
    "padangų montavimas Vilnius",
    "padangų remontas Vilnius",
    "automobilių servisas Vilnius",
    "ratų remontas Vilnius",
  ],
} as const;

export const NAV_ITEMS = [
  { label: "Paslaugos", href: "#paslaugos" },
  { label: "Apie mus", href: "#apie-mus" },
  { label: "Atsiliepimai", href: "#atsiliepimai" },
  { label: "Kontaktai", href: "#kontaktai" },
] as const;

export const SERVICES = [
  {
    title: "Padangų montavimas",
    description: "Profesionalus padangų montavimas ir demontavimas visų tipų automobiliams.",
    icon: "disc" as const,
  },
  {
    title: "Padangų remontas",
    description: "Patikimas padangų remontas — saugus ir ilgaamžis sprendimas.",
    icon: "wrench" as const,
  },
  {
    title: "Ratų balansavimas",
    description: "Tikslus ratų balansavimas sklandžiam ir saugiam važiavimui.",
    icon: "gauge" as const,
  },
  {
    title: "Ratų keitimas",
    description: "Sezoninis ratų keitimas — greitai ir kruopščiai atliekamas darbas.",
    icon: "refresh" as const,
  },
  {
    title: "Ratlankių priežiūra / valymas",
    description: "Ratlankių valymas ir priežiūra — estetiška ir tvarkinga išvaizda.",
    icon: "sparkles" as const,
  },
  {
    title: "Automobilio techninė priežiūra",
    description: "Automobilio techninė priežiūra ir patikra pagal individualius poreikius.",
    icon: "car" as const,
  },
  {
    title: "Ratų ir padangų patikra",
    description: "Išsami ratų ir padangų būklės patikra saugumui užtikrinti.",
    icon: "search" as const,
  },
  {
    title: "Konsultacijos dėl padangų ir automobilių priežiūros",
    description: "Individualios konsultacijos — praktiški patarimai jūsų automobiliui.",
    icon: "message" as const,
  },
] as const;

export const WHY_US = [
  {
    title: "35+ metų patirtis",
    description: "Daugiau nei tris dešimtmečiai profesionalaus darbo su automobiliais ir ratais.",
  },
  {
    title: "4.9★ įvertinimas",
    description: "Aukštas klientų įvertinimas Google platformoje — 4.9 iš 5 žvaigždučių.",
  },
  {
    title: "431 klientų atsiliepimas",
    description: "Daugiau nei 400 tikrų klientų atsiliepimų — patikimumo ir kokybės įrodymas.",
  },
  {
    title: "Profesionalus aptarnavimas",
    description: "Klientai dažnai pabrėžia profesionalumą ir tvarkingą darbo atlikimą.",
  },
  {
    title: "Individualios konsultacijos",
    description: "Praktiški patarimai dėl padangų ir automobilio priežiūros kiekvienam klientui.",
  },
  {
    title: "Patikimas ir kruopštus darbas",
    description: "Kruopštumas ir patikimumas — pagrindiniai klientų vertinami bruožai.",
  },
] as const;

/** Thematic summaries derived from review themes — not fabricated quotes. */
export const REVIEW_THEMES = [
  {
    theme: "Profesionalus aptarnavimas",
    summary:
      "Klientai dažnai mini profesionalų ir mandagų aptarnavimą — darbas atliekamas tvarkingai ir atsakingai.",
  },
  {
    theme: "Kokybiškas darbas",
    summary:
      "Atsiliepimuose pabrėžiama aukšta darbo kokybė ir patikimas rezultatas po kiekvieno apsilankymo.",
  },
  {
    theme: "Ilgaamžė patirtis",
    summary:
      "Daugiau nei 35 metų patirtis suteikia pasitikėjimo — klientai vertina meistrų kompetenciją ir patirtį.",
  },
  {
    theme: "Naudingi patarimai",
    summary:
      "Klientai giria praktinius patarimus dėl automobilio ir padangų priežiūros — ne tik darbą, bet ir konsultacijas.",
  },
  {
    theme: "Draugiška komunikacija",
    summary:
      "Atsiliepimuose dažnai minimas draugiškas bendravimas ir aiškus paaiškinimas atliekamų darbų metu.",
  },
] as const;
