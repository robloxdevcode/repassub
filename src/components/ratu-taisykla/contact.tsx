import { Clock, MapPin, Phone } from "lucide-react";

import { BUSINESS, MAPS_DIRECTIONS_URL, MAPS_EMBED_URL } from "@/lib/ratu-taisykla/site-data";

export function RtContact() {
  return (
    <section id="kontaktai" className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 rt-metallic-line" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="rt-section-label">Kontaktai</span>
          <h2 className="rt-heading text-3xl font-bold text-white sm:text-4xl">Susisiekite su mumis</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rt-card p-8">
            <h3 className="rt-heading mb-6 text-2xl font-bold text-white">{BUSINESS.name}</h3>

            <address className="not-italic space-y-5">
              <div className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div className="text-zinc-300">
                  <p>{BUSINESS.address.street}</p>
                  <p>
                    {BUSINESS.address.city}, {BUSINESS.address.postal}
                  </p>
                  <p>{BUSINESS.address.country}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <a
                  href={BUSINESS.phoneHref}
                  className="text-lg font-semibold text-white transition-colors hover:text-red-400"
                >
                  {BUSINESS.phone}
                </a>
              </div>

              <div className="flex gap-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <p className="text-zinc-400">
                  Darbo laiką rekomenduojame pasitikslinti telefonu.
                </p>
              </div>
            </address>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={BUSINESS.phoneHref} className="rt-btn-primary flex-1">
                <Phone className="h-5 w-5" />
                Skambinti
              </a>
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rt-btn-secondary flex-1"
              >
                <MapPin className="h-5 w-5" />
                Gauti nuorodas
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#2a2a30]">
            <iframe
              title="Ratų taisykla vieta žemėlapyje"
              src={MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[400px] w-full grayscale-[20%] contrast-[1.1]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
