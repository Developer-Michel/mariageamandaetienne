"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

type RevealType = "up" | "left" | "right" | "scale" | "rotate";

export function Section({
  id,
  children,
  className,
  alt = false,
  reveal = "up",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  alt?: boolean;
  reveal?: RevealType;
}) {
  const { ref, isVisible } = useScrollAnimation(0.08);

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "px-4 py-20 md:py-28 lg:py-32",
        alt ? "bg-secondary" : "bg-background",
        className,
      )}
    >
      <div
        className={cn(
          reveal === "up" && "reveal-up",
          reveal === "left" && "reveal-left",
          reveal === "right" && "reveal-right",
          reveal === "scale" && "reveal-scale",
          reveal === "rotate" && "reveal-rotate",
          isVisible && "is-visible",
        )}
        style={{ maxWidth: "72rem", marginLeft: "auto", marginRight: "auto" }}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <div ref={ref} className="mb-16 text-center">
      <div
        className={cn(
          "mb-4 flex items-center justify-center gap-3 reveal-scale",
          isVisible && "is-visible",
        )}
      >
        <div className="h-px w-8 bg-primary/40" />
        <svg
          className="h-3 w-3 text-primary/60 "
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="12" r="3" />
        </svg>
        <div className="h-px w-8 bg-primary/40" />
      </div>
      <h2
        className={cn(
          "font-serif text-3xl font-light text-foreground md:text-4xl lg:text-5xl text-balance reveal-up",
          isVisible && "is-visible",
        )}
        style={isVisible ? { animationDelay: "350ms" } : undefined}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-sm text-muted-foreground md:text-base reveal-up",
            isVisible && "is-visible",
          )}
          style={isVisible ? { animationDelay: "650ms" } : undefined}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
