"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

/* Each pair = one large static photo + one smaller photo that slides in over a corner */
const pairs = [
  {
    main: {
      src: "/images/wedding/main/IMG_6998.JPG",
      alt: "Amanda et Etienne dans le jardin",
    },
    overlay: {
      src: "/images/wedding/main/IMG_6861.JPG",
      alt: "Detail des mains",
    },
    overlayPosition: "bottom-right" as const,
  },
  {
    main: {
      src: "/images/wedding/main/IMG_6839.JPG",
      alt: "Rires sous le grand arbre",
    },
    overlay: {
      src: "/images/wedding/main/IMG_6828.JPG",
      alt: "Le bouquet",
    },
    overlayPosition: "top-left" as const,
  },
  {
    main: {
      src: "/images/wedding/main/IMG_6814.JPG",
      alt: "Danse au coucher du soleil",
    },
    overlay: {
      src: "/images/wedding/main/IMG_6988.JPG",
      alt: "La reception",
    },
    overlayPosition: "bottom-left" as const,
  },
];

type OverlayPosition = "bottom-right" | "top-left" | "bottom-left";

const overlayStyles: Record<
  OverlayPosition,
  { position: string; from: string }
> = {
  "bottom-right": {
    position: "-bottom-6 -right-4 md:-bottom-16 md:-right-20",
    from: " translate-y-[60px]",
  },
  "top-left": {
    position: "-top-6 -left-4 md:-top-16 md:-left-20",
    from: " -translate-y-[60px]",
  },
  "bottom-left": {
    position: "-bottom-6 -left-4 md:-bottom-16 md:-left-20",
    from: " translate-y-[60px]",
  },
};

function PhotoPair({
  main,
  overlay,
  overlayPosition,
  index,
}: {
  main: { src: string; alt: string };
  overlay: { src: string; alt: string };
  overlayPosition: OverlayPosition;
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const posConfig = overlayStyles[overlayPosition];

  return (
    <div
      ref={ref}
      className={cn(
        "relative mx-auto w-full max-w-2xl",
        /* Alternate alignment for visual rhythm */
        index % 2 === 0 ? "lg:ml-[50%]" : "lg:mr-[150%] lg:ml-auto",
      )}
    >
      {/* Main large photo */}
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-lg transition-opacity ease-in-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDelay: isVisible ? "120ms" : "0s",
          transitionDuration: "1400ms",
        }}
      >
        <Image
          src={main.src}
          alt={main.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 95vw, 650px"
        />
      </div>

      {/* Small overlay photo sliding in from corner */}
      <div
        className={cn(
          "absolute z-10 w-[25%] overflow-hidden rounded-sm shadow-2xl",
          posConfig.position,
          "opacity-0 will-change-transform transition-[opacity,transform]",
          posConfig.from,
          isVisible && "opacity-100 translate-x-0 translate-y-0",
        )}
        style={{
          transitionDelay: isVisible ? "320ms" : "0s",
          transitionDuration: "2000ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="relative h-44 md:h-56">
          <Image
            src={overlay.src}
            alt={overlay.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 45vw, 260px"
          />
        </div>
        {/* Soft border glow */}
        <div className="pointer-events-none absolute inset-0 rounded-sm ring-2 ring-background/60" />
      </div>
    </div>
  );
}

export function Gallery() {
  return (
    <section id="gallery" className="relative   py-24 md:py-36 bg-primary/70">
      {/* Fixed background image for the gallery section */}

      <div className="absolute font-serif top-0 font-medium  italic -translate-y-[50%] bg-secondary left-0 p-10 pl-20 pr-20">
        Gallery
      </div>
      <div className="mx-auto mb-16 h-px w-16  " />
      <div className="overflow-hidden">
        {/* Subtle decorative line */}

        <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 md:gap-24 md:px-8">
          {pairs.map((pair, i) => (
            <PhotoPair key={i} {...pair} index={i} />
          ))}
        </div>

        {/* Bottom decorative line */}
        <div className="mx-auto mt-16 h-px w-16 bg-primary/30" />
      </div>
    </section>
  );
}
