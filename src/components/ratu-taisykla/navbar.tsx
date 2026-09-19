"use client";

import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";

import { BUSINESS, NAV_ITEMS } from "@/lib/ratu-taisykla/site-data";

export function RtNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-[#0d0d0f]/95 backdrop-blur-md border-b border-[#2a2a30]/60 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="rt-heading text-lg font-bold tracking-tight text-white sm:text-xl">
          {BUSINESS.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a href={BUSINESS.phoneHref} className="rt-btn-primary !px-4 !py-2.5 text-sm">
            <Phone className="h-4 w-4" />
            Skambinti
          </a>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <a
            href={BUSINESS.phoneHref}
            className="rt-btn-primary !px-3.5 !py-2 text-sm"
            aria-label="Skambinti"
          >
            <Phone className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Skambinti</span>
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2a30] text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            aria-label={menuOpen ? "Uždaryti meniu" : "Atidaryti meniu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[#2a2a30]/60 bg-[#0d0d0f]/98 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
