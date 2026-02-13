"use client";

import { useI18n } from "@/lib/i18n";
import { Section, SectionHeader } from "./section";
import { Mail, Phone } from "lucide-react";

export function Contact() {
  const { t } = useI18n();

  return (
    <Section id="contact" reveal="up">
      <div className=" bg-secondary p-10  shadow-xl shadow-black/20 ring-1 ring-white/5">
        <SectionHeader
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
        />

        <div className="mx-auto max-w-xl">
          <div className="overflow-hidden shadow-sm backdrop-blur-sm">
            <div className="grid gap-px bg-border/30 sm:grid-cols-2 sm:divide-x sm:divide-border/40">
              {/* Email */}
              <div className="flex flex-col gap-2 bg-card/60 px-6 py-6 sm:py-7">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {t("contact.email")}
                </p>
                <a
                  href="mailto:amandalim.kc@gmail.com"
                  className="text-base font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  amandalim.kc@gmail.com
                </a>
              </div>

              {/* Primary phone */}
              <div className="flex flex-col gap-2 bg-card/60 px-6 py-6 sm:py-7">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {t("contact.phone")}
                </p>
                <a
                  href="tel:514-553-6028"
                  className="text-base font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  514-553-6028
                </a>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-12 h-px w-24 bg-border"></div>
        </div>
      </div>
    </Section>
  );
}
