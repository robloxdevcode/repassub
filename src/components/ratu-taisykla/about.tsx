import Image from "next/image";

import { BUSINESS } from "@/lib/ratu-taisykla/site-data";

export function RtAbout() {
  return (
    <section id="apie-mus" className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 rt-metallic-line" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#2a2a30]">
            <Image
              src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=900&q=80"
              alt="Profesionalus automobilių ir ratų aptarnavimas"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f]/40 to-transparent" />
          </div>

          <div>
            <span className="rt-section-label">Apie mus</span>
            <h2 className="rt-heading mb-6 text-3xl font-bold text-white sm:text-4xl">
              Daugiau nei {BUSINESS.experienceYears} metų patirties
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>
                <strong className="font-semibold text-zinc-200">Ratų taisykla</strong> — patyręs
                vietinis automobilių ir ratų servisas Vilniuje, orientuotas į profesionalų darbą,
                kokybišką aptarnavimą ir praktinius patarimus automobilių savininkams.
              </p>
              <p>
                Daugiau nei {BUSINESS.experienceYears} metų patirtis leidžia užtikrinti patikimą
                ratų, padangų ir automobilio priežiūros aptarnavimą — nuo sezoninio ratų keitimo iki
                techninės priežiūros konsultacijų.
              </p>
              <p>
                Klientai dažnai vertina mūsų kruopštumą, profesionalumą ir individualų požiūrį į
                kiekvieną automobilį. Esame pasiruošę padėti ir patarti — ne tik atlikti darbą.
              </p>
              <p>
                Aptarnaujame lietuvių ir rusų kalbomis —{" "}
                <span className="text-zinc-300">kalbame lietuviškai ir rusiškai</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
