import Image from "next/image";
import { MapPin, Phone, Star } from "lucide-react";

import { BUSINESS, MAPS_DIRECTIONS_URL } from "@/lib/ratu-taisykla/site-data";

export function RtHero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80"
          alt="Automobilių remonto ir ratų serviso dirbtuvės"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0f]/80 via-[#0d0d0f]/70 to-[#0d0d0f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0f]/60 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
        <div className="max-w-2xl rt-animate-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2a2a30] bg-[#1a1a1e]/80 px-4 py-2 text-sm backdrop-blur-sm">
            <Star className="h-4 w-4 fill-red-500 text-red-500" />
            <span className="font-medium text-zinc-200">
              {BUSINESS.rating} / 5 · {BUSINESS.reviewCount} klientų atsiliepimas
            </span>
          </div>

          <h1 className="rt-heading mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Patikimas ratų servisas Vilniuje
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
            Profesionalus ratų ir automobilių aptarnavimas. Daugiau nei {BUSINESS.experienceYears}{" "}
            metų patirtis ir {BUSINESS.rating}★ klientų įvertinimas.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href={BUSINESS.phoneHref} className="rt-btn-primary text-base">
              <Phone className="h-5 w-5" />
              Skambinti dabar
            </a>
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rt-btn-secondary text-base"
            >
              <MapPin className="h-5 w-5" />
              Kaip mus rasti
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0d0d0f] to-transparent" />
    </section>
  );
}
