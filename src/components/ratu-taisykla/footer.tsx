import { BUSINESS, NAV_ITEMS } from "@/lib/ratu-taisykla/site-data";

export function RtFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#2a2a30]/60 bg-[#0a0a0c] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          <div>
            <p className="rt-heading text-lg font-bold text-white">{BUSINESS.name}</p>
            <p className="mt-1 text-sm text-zinc-500">
              Ratų servisas · Padangų montavimas · Vilnius
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 rt-metallic-line" />

        <p className="mt-6 text-center text-sm text-zinc-600">
          © {year} {BUSINESS.name}. Visos teisės saugomos.
        </p>
      </div>
    </footer>
  );
}
