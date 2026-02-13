"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const WEDDING_DATE = new Date("2026-08-22T15:00:00-04:00");

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownUnit({
  value,
  label,
  variant = "large",
}: {
  value: number;
  label: string;
  variant?: "large" | "compact";
}) {
  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center">
        <span className="font-serif text-2xl font-light text-primary-foreground md:text-3xl">
          {String(value).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-primary-foreground/70">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-lg  backdrop-blur-sm md:h-28 md:w-28">
        <span className="font-serif text-4xl font-light text-white md:text-5xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/60 md:text-xs">
        {label}
      </span>
    </div>
  );
}

export function Countdown({
  variant = "large",
}: {
  variant?: "large" | "compact";
}) {
  const { t } = useI18n();
  const [time, setTime] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`flex items-center ${variant === "large" ? "gap-4 md:gap-6" : "gap-4"}`}
      >
        {["--", "--", "--", "--"].map((_, i) => (
          <CountdownUnit key={i} value={0} label="..." variant={variant} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center ${variant === "large" ? "gap-4 md:gap-6" : "gap-4"}`}
    >
      <CountdownUnit
        value={time.days}
        label={t("hero.countdown.days")}
        variant={variant}
      />
      <span
        className={`font-serif font-light ${variant === "large" ? "text-3xl text-white/25 md:text-4xl" : "text-xl text-primary-foreground/50"}`}
      >
        :
      </span>
      <CountdownUnit
        value={time.hours}
        label={t("hero.countdown.hours")}
        variant={variant}
      />
      <span
        className={`font-serif font-light ${variant === "large" ? "text-3xl text-white/25 md:text-4xl" : "text-xl text-primary-foreground/50"}`}
      >
        :
      </span>
      <CountdownUnit
        value={time.minutes}
        label={t("hero.countdown.minutes")}
        variant={variant}
      />
      <span
        className={`font-serif font-light ${variant === "large" ? "text-3xl text-white/25 md:text-4xl" : "text-xl text-primary-foreground/50"}`}
      >
        :
      </span>
      <CountdownUnit
        value={time.seconds}
        label={t("hero.countdown.seconds")}
        variant={variant}
      />
    </div>
  );
}
