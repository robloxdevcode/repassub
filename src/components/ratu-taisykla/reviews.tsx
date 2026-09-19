import { Star } from "lucide-react";

import { BUSINESS, REVIEW_THEMES } from "@/lib/ratu-taisykla/site-data";

export function RtReviews() {
  return (
    <section id="atsiliepimai" className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 rt-metallic-line" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="rt-section-label">Atsiliepimai</span>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-7 w-7 fill-red-500 text-red-500" />
              ))}
            </div>
          </div>
          <p className="rt-heading text-5xl font-bold text-white sm:text-6xl">{BUSINESS.rating} / 5</p>
          <p className="mt-2 text-lg text-zinc-400">{BUSINESS.reviewCount} atsiliepimas</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEW_THEMES.map((review) => (
            <article key={review.theme} className="rt-card p-6">
              <div className="mb-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-red-500/80 text-red-500/80" />
                ))}
              </div>
              <h3 className="rt-heading mb-2 font-semibold text-white">{review.theme}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{review.summary}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-zinc-500">
          Atsiliepimai pagal klientų patirtį Google platformoje — citatos nesukurtos.
        </p>
      </div>
    </section>
  );
}
