"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useGuest } from "@/lib/guest";
import { Countdown } from "./countdown";
import Image from "next/image";

export function Hero() {
  const { t } = useI18n();
  const { guestName } = useGuest();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      <div
        className={`absolute inset-0 bg-secondary/5 backdrop-blur-sm transition-opacity ${
          hasScrolled ? "opacity-50" : "opacity-0"
        }`}
        style={{ transitionDuration: "800ms" }}
        aria-hidden
      />
      {/* Fixed background wrapper so the image stays behind content; inner layer translates for slower follow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/images/wedding/IMG_6867.jpg"
          alt="Amanda et Etienne"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Decorative top accent */}
        <div className="mb-8 h-px w-16 bg-white/30 animate-fade-in opacity-0" />

        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/70 animate-fade-in-up opacity-0 animate-delay-200">
          {"Nous nous marions"}
        </p>
        {guestName && (
          <p className="mb-6 text-sm text-white/80 animate-fade-in-up opacity-0 animate-delay-300">
            {`Bienvenue, ${guestName}`}
          </p>
        )}

        <h1 className="mb-3 font-serif text-5xl font-light leading-tight text-white animate-fade-in-up opacity-0 animate-delay-400 md:text-7xl lg:text-8xl">
          Amanda
        </h1>
        <p className="mb-3 font-serif text-2xl font-light italic text-white/50 animate-fade-in-up opacity-0 animate-delay-500 md:text-3xl">
          {"&"}
        </p>
        <h1 className="mb-8 font-serif text-5xl font-light leading-tight text-white animate-fade-in-up opacity-0 animate-delay-500 md:text-7xl lg:text-8xl">
          {"Etienne"}
        </h1>

        {/* Decorative divider */}
        <div className="mb-8 flex items-center gap-3 animate-fade-in opacity-0 animate-delay-600">
          <div className="h-px w-12 bg-white/30" />
          <svg
            className="h-4 w-4 text-white/50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 3C7.5 3 4 7 4 11c0 5 8 10 8 10s8-5 8-10c0-4-3.5-8-8-8z" />
          </svg>
          <div className="h-px w-12 bg-white/30" />
        </div>

        <p className="mb-2 text-sm tracking-[0.2em] text-white/80 animate-fade-in-up opacity-0 animate-delay-600 md:text-base">
          {t("hero.date")}
        </p>
        <p className="mb-12 text-xs tracking-wide text-white/60 animate-fade-in-up opacity-0 animate-delay-700 md:text-sm">
          {t("hero.venue")}
        </p>

        {/* Countdown */}
        <div className="mb-14 animate-fade-in-up opacity-0 animate-delay-700">
          <Countdown variant="compact" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 animate-fade-in-up opacity-0 animate-delay-800 sm:flex-row">
          <a
            href="#rsvp"
            className="group relative overflow-hidden rounded-full border border-white/30 bg-white/90 px-10 py-3 text-sm font-medium tracking-[0.22em] uppercase text-foreground shadow-lg shadow-black/10 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
              aria-hidden
            />
            <span className="relative flex items-center justify-center gap-3">
              <span>{t("hero.cta.rsvp")}</span>
              <svg
                aria-hidden
                className="h-4 w-4 text-foreground/70 transition duration-300 group-hover:translate-x-1 group-hover:text-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 animate-delay-800">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-px animate-pulse bg-white/30" />
        </div>
      </div>
    </section>
  );
}
