import {
  Car,
  Disc3,
  Gauge,
  MessageCircle,
  RefreshCw,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";

import { SERVICES } from "@/lib/ratu-taisykla/site-data";

const ICONS = {
  disc: Disc3,
  wrench: Wrench,
  gauge: Gauge,
  refresh: RefreshCw,
  sparkles: Sparkles,
  car: Car,
  search: Search,
  message: MessageCircle,
} as const;

export function RtServices() {
  return (
    <section id="paslaugos" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="rt-section-label">Paslaugos</span>
          <h2 className="rt-heading mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ratų ir automobilių aptarnavimas
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-400">
            Visapusiškos ratų, padangų ir automobilio priežiūros paslaugos Vilniuje — profesionaliai
            ir patikimai.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <article key={service.title} className="rt-card group p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500 transition-colors group-hover:bg-red-600/20">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="rt-heading mb-2 text-lg font-semibold text-white">{service.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
