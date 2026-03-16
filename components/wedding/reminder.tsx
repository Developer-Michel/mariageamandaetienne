"use client";

import { useI18n } from "@/lib/i18n";
import { Countdown } from "./countdown";
import { storageUrl } from "@/lib/utils";

export function Reminder() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `https://ebgkchlrtcmsmzbzjbkp.supabase.co/storage/v1/object/public/wedding/Main/IMG_6867.JPG?width=1920&format=avif`,
            backgroundPosition: "center 45%",
          }}
        />
        <div className="absolute inset-0 bg-primary/70" />
      </div>

      <div className="px-4 py-12 md:py-16">
        <div className="pl-5 max-w-5xl items-center gap-6 text-left">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
            <p className="font-serif text-xl font-light text-primary-foreground md:text-2xl">
              {t("reminder.text")}
            </p>
            <Countdown variant="compact" />
          </div>
        </div>
      </div>
    </section>
  );
}
