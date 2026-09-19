import { Phone } from "lucide-react";

import { BUSINESS } from "@/lib/ratu-taisykla/site-data";

export function RtFinalCta() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 rt-metallic-line" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-[#2a2a30] bg-gradient-to-br from-[#1a1a1e] to-[#0d0d0f] p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-red-600/5 blur-3xl" />

          <h2 className="rt-heading relative mb-4 text-3xl font-bold text-white sm:text-4xl">
            Reikia ratų ar automobilio priežiūros?
          </h2>
          <p className="relative mb-8 text-lg text-zinc-400">
            Susisiekite su Ratų taisykla Vilniuje.
          </p>
          <a href={BUSINESS.phoneHref} className="rt-btn-primary relative text-base">
            <Phone className="h-5 w-5" />
            Skambinti {BUSINESS.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
