"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { Section, SectionHeader } from "./section";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn, storageUrl } from "@/lib/utils";

const chapters = [
  {
    titleKey: "story.chapter1.title",
    textKey: "story.chapter1.text",
    year: "2019",
    image: storageUrl(
      "28AB5001-55EC-4597-9BC3-D0B4EE1440BB-92804-00000A1DB94C8586.jpg",
      "/images/story-meeting.JPG",
    ),
    alt: "Amanda et Etienne se rencontrent",
  },
  {
    titleKey: "story.chapter2.title",
    textKey: "story.chapter2.text",
    year: "2020",
    image: storageUrl("56.JPG", "/images/story-firstdate.JPG"),
    alt: "Premier rendez-vous d'Amanda et Etienne",
  },
  {
    titleKey: "story.chapter3.title",
    textKey: "story.chapter3.text",
    year: "2021",
    image: storageUrl("IMG_9865.JPG", "/images/story-proposal.JPG"),
    alt: "La demande en mariage",
  },
  {
    titleKey: "story.chapter4.title",
    textKey: "story.chapter4.text",
    year: "2023",
    image: storageUrl("DSC_0692.jpeg", "/images/story-proposal.JPG"),
    alt: "La demande en mariage",
  },
  {
    titleKey: "story.chapter5.title",
    textKey: "story.chapter5.text",
    year: "2025",
    image: storageUrl("IMG_6993.JPG", "/images/story-proposal.JPG"),
    alt: "La demande en mariage",
  },
];

function StoryChapter({
  title,
  text,
  year,
  image,
  alt,
  index,
}: {
  title: string;
  text: string;
  year: string;
  image: string;
  alt: string;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const { ref: animRef, isVisible } = useScrollAnimation(0.15);

  return (
    <div
      ref={animRef}
      className="relative flex flex-col items-center gap-8 md:flex-row md:gap-16  overflow-hidden"
    >
      {/* Timeline dot */}
      <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-background reveal-scale",
            isVisible && "is-visible",
          )}
        >
          <div className="h-3 w-3 rounded-full bg-primary" />
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex w-full flex-col gap-8 md:flex-row md:gap-16 ${isEven ? "" : "md:flex-row-reverse"}`}
      >
        {/* Image */}
        <div className="flex-1">
          <div
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-lg bg-muted will-change-transform",
              isEven ? "reveal-left" : "reveal-right",
              isVisible && "is-visible",
            )}
            style={isVisible ? { animationDelay: "220ms" } : undefined}
          >
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Text */}
        <div
          className={cn(
            "flex flex-1 flex-col justify-center",
            isEven ? "reveal-right" : "reveal-left",
            isVisible && "is-visible",
          )}
          style={isVisible ? { animationDelay: "360ms" } : undefined}
        >
          <span className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {year}
          </span>
          <h3 className="mb-4 font-serif text-2xl font-light text-foreground md:text-3xl">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Story() {
  const { t } = useI18n();

  return (
    <Section id="story" reveal="up">
      <SectionHeader title={t("story.title")} />

      {/* Timeline line (desktop) */}
      <div className="relative">
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border md:block" />
        <div className="flex flex-col gap-20">
          {chapters.map((ch, i) => (
            <StoryChapter
              key={ch.titleKey}
              title={t(ch.titleKey)}
              text={t(ch.textKey)}
              year={ch.year}
              image={ch.image}
              alt={ch.alt}
              index={i}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
