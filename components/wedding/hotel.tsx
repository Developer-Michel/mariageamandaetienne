"use client";

import { useI18n } from "@/lib/i18n";
import { Section, SectionHeader } from "./section";

export function HotelInfo() {
  const { t } = useI18n();

  return (
    <Section id="hotel" alt reveal="scale">
      <SectionHeader title={t("hotel.title")} subtitle={t("hotel.subtitle")} />

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
          <p className="text-base leading-relaxed text-foreground">
            {t("hotel.instructions")}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("hotel.call")}
              </p>
              <a
                href="tel:14504674477"
                className="mt-2 inline-block text-lg font-semibold text-foreground transition hover:text-primary"
              >
                450-467-4477
              </a>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("hotel.online")}
              </p>
              <a
                href="https://www.hotelrivegauche.ca/fr/reservations#/room"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-lg font-semibold text-foreground transition hover:text-primary"
              >
                Reservations | Hôtel Rive Gauche
              </a>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-primary/5 px-4 py-3 text-sm text-foreground">
            <span className="font-semibold">{t("hotel.groupCode")} :</span>
            <span className="ml-2 font-mono text-base">195529</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
