"use client";

import { useI18n } from "@/lib/i18n";
import { Section, SectionHeader } from "./section";
import { useStaggerReveal } from "@/hooks/use-scroll-animation";
import { cn, storageUrl } from "@/lib/utils";
import Image from "next/image";
const scheduleItems = [
  { time: "15:30", key: "info.schedule.ceremony" },
  { time: "16:15", key: "info.schedule.cocktail" },
  { time: "17:30", key: "info.schedule.enter" },
  { time: "17:45", key: "info.schedule.dinner" },
  { time: "20:00", key: "info.schedule.party" },
];

export function Info() {
  const { t } = useI18n();
  const { ref, getChildProps } = useStaggerReveal("up", 200, 0.08);

  return (
    <Section id="info" reveal="scale">
      <div className="bg-secondary p-7 shadow-xl shadow-black/20 ring-1 ring-white/5 md:p-8 lg:p-12">
        <SectionHeader title={t("info.title")} />
        <div
          ref={ref}
          className="mx-auto max-w-4xl flex flex-col gap-16 md:gap-20"
        >
          {/* Schedule */}
          <div
            {...getChildProps(0)}
            className={cn(
              "flex flex-col items-center",
              getChildProps(0).className,
            )}
          >
            <p className="mb-8 font-serif text-2xl font-light tracking-wide text-foreground md:text-3xl">
              {t("info.schedule.title")}
            </p>

            <div className="w-full max-w-md">
              {scheduleItems.map((item, i) => (
                <div
                  key={item.key}
                  className="group relative flex items-center gap-6 py-5"
                >
                  {/* Decorative dot on the timeline */}
                  <div className="relative flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {i < scheduleItems.length - 1 && (
                      <div className="absolute top-3 h-[calc(100%+2rem)] w-px bg-border" />
                    )}
                  </div>

                  <span className="w-16 font-serif text-lg text-primary">
                    {item.time}
                  </span>
                  <span className="font-serif text-lg font-light tracking-wide text-foreground">
                    {t(item.key)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Thin separator */}
          <div className="mx-auto h-px w-24 bg-border" />

          {/* Address */}
          <div
            {...getChildProps(1)}
            className={cn(
              "flex flex-col items-center text-center",
              getChildProps(1).className,
            )}
          >
            <p className="mb-4 font-serif text-2xl font-light tracking-wide text-foreground md:text-3xl">
              {t("info.address.title")}
            </p>

            <p className="mb-1 font-serif text-lg text-foreground">
              {t("info.address.venue")}
            </p>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              {t("info.address.text")}
            </p>

            <div className="relative mt-4 aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg shadow-sm sm:max-w-lg md:max-w-xl">
              <Image
                src={storageUrl("mouton.png", "/images/wedding/mouton.png")}
                alt="Amanda et Etienne"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          {/* Thin separator */}
          <div className="mx-auto h-px w-24 bg-border" />

          {/* Tips */}
          <div
            {...getChildProps(2)}
            className={cn(
              "flex flex-col items-center text-center",
              getChildProps(2).className,
            )}
          >
            <p className="mb-6 font-serif text-2xl font-light tracking-wide text-foreground md:text-3xl">
              {t("info.tips.title")}
            </p>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("info.tips.text")}
            </p>
          </div>
          {/* Thin separator */}
          <div className="mx-auto h-px w-24 bg-border" />
        </div>
      </div>
    </Section>
  );
}
