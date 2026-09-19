import { Award, MessageSquare, Shield, Star, Users, Wrench } from "lucide-react";

import { WHY_US } from "@/lib/ratu-taisykla/site-data";

const ICONS = [Award, Star, Users, Shield, MessageSquare, Wrench];

export function RtWhyUs() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 rt-metallic-line" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="rt-section-label">Kodėl mes</span>
          <h2 className="rt-heading text-3xl font-bold text-white sm:text-4xl">
            Kodėl klientai renkasi Ratų taisyklą?
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((item, index) => {
            const Icon = ICONS[index];
            return (
              <article
                key={item.title}
                className="rt-card flex gap-5 p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2a2a30] bg-[#161618] text-red-500">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="rt-heading mb-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
