"use client";

import { useState, useEffect } from "react";
import { useI18n, type Locale } from "@/lib/i18n";
import { useGuest } from "@/lib/guest";
import { Menu, X, Volume2, VolumeX } from "lucide-react";

const navItems = [
  { key: "nav.story", href: "#story" },
  { key: "nav.info", href: "#info" },
  { key: "nav.party", href: "#party" },
  { key: "nav.gallery", href: "#gallery" },
  { key: "nav.rsvp", href: "#rsvp" },
  { key: "nav.contact", href: "#contact" },
];

export function Navigation() {
  const { locale, setLocale, t } = useI18n();
  const { guestName } = useGuest();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Names / Logo */}
        <a
          href="#hero"
          className={`font-serif text-lg tracking-wide transition-colors duration-300 ${
            isScrolled ? "text-foreground" : "text-white/90"
          }`}
        >
          {"A & E"}
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                className={`text-sm tracking-wide transition-colors duration-300 hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-white/75"
                }`}
              >
                {t(item.key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Guest badge */}
          {guestName && (
            <span
              className={`hidden rounded-full border px-3 py-1 text-xs md:inline-block ${
                isScrolled
                  ? "border-border text-muted-foreground"
                  : "border-white/25 text-white/70"
              }`}
            >
              {t("guest.badge")}: {guestName}
            </span>
          )}

          {/* Language toggle */}
          <button
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              isScrolled
                ? "border-border text-foreground hover:bg-muted"
                : "border-white/25 text-white/75 hover:bg-white/10"
            }`}
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`rounded-full p-2 md:hidden ${
              isScrolled ? "text-foreground" : "text-white/75"
            }`}
            aria-label="Menu"
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="border-t border-border bg-background/98 backdrop-blur-md md:hidden">
          <ul className="flex flex-col items-center gap-1 px-4 py-4">
            {guestName && (
              <li className="mb-2 w-full text-center">
                <span className="text-xs text-muted-foreground">
                  {t("guest.badge")}: {guestName}
                </span>
              </li>
            )}
            {navItems.map((item) => (
              <li key={item.key} className="w-full">
                <a
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-center text-sm text-foreground transition-colors hover:bg-muted"
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
