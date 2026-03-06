"use client";

import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className=" relative border-t border-border bg-background px-4 py-8">
      <div className="relative mx-auto max-w-6xl text-center">
        <p className="font-serif text-lg font-light text-foreground">
          {"Amanda & Etienne"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">22.08.2026</p>
        <p className="mt-4 text-xs text-muted-foreground/60">
          {t("footer.text")}
        </p>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70 md:text-xs">
        Designed & developed by Michel Racicot
      </div>
    </footer>
  );
}
