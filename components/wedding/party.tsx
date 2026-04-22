"use client";

import { useI18n } from "@/lib/i18n";
import { Section, SectionHeader } from "./section";
import Image from "next/image.js";
const row1 = [
  { name: "Sarah", roleKey: "party.role.bridesmaid", initials: "S" },
  { name: "Marco", roleKey: "party.role.groomsman", initials: "M" },
  { name: "Alex", roleKey: "party.role.groomsman", initials: "A" },
  { name: "Alexandra", roleKey: "party.role.bridesmaid", initials: "A" },
  { name: "Renaud", roleKey: "party.role.groomsman", initials: "R" },
  { name: "Vincent", roleKey: "party.role.groomsman", initials: "V" },
  { name: "Zachary", roleKey: "party.role.groomsman", initials: "Z" },
  { name: "Alicia", roleKey: "party.role.bridesmaid", initials: "A" },
  { name: "Esther", roleKey: "party.role.bridesmaid", initials: "E" },
  { name: "Juliana", roleKey: "party.role.bridesmaid", initials: "J" },
  { name: "Marylou", roleKey: "party.role.bridesmaid", initials: "M" },
];

function PersonCard({
  name,
  role,
  initials,
}: {
  name: string;
  role: string;
  initials: string;
}) {
  return (
    <div className="flex w-48 shrink-0 flex-col items-center px-4 text-center md:w-56">
      <div className="mb-3 flex relative h-24 w-24  overflow-hidden  items-center justify-center rounded-full border border-border/60 bg-secondary/50 transition-colors duration-300 hover:border-primary/40 hover:bg-secondary md:h-28 md:w-28">
        <span className=" font-serif text-xl tracking-wide text-muted-foreground/70 md:text-2xl">
          <Image
            src={`/images/wedding/${name.replace(/ /g, "%20")}.jpeg`}
            alt={name}
            fill
            sizes="112px"
            className="object-cover object-center"
          />
        </span>
      </div>
      <h3 className="font-serif text-base font-light text-foreground">
        {name}
      </h3>
      <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        {role}
      </p>
    </div>
  );
}

function MarqueeRow({
  people,
  reverse = false,
  duration,
}: {
  people: typeof row1;
  reverse?: boolean;
  duration: string;
}) {
  const { t } = useI18n();

  // Duplicate the list so the second copy seamlessly follows the first
  const doubled = [...people, ...people];

  return (
    <div className="group relative overflow-hidden py-6">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-24" />

      <div
        className={
          reverse
            ? "animate-marquee-reverse flex w-max"
            : "animate-marquee flex w-max"
        }
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {doubled.map((person, i) => (
          <PersonCard
            key={`${person.name}-${i}`}
            name={person.name}
            role={t(person.roleKey)}
            initials={person.initials}
          />
        ))}
      </div>
    </div>
  );
}

export function Party() {
  const { t } = useI18n();

  return (
    <Section id="party" reveal="up">
      <SectionHeader title={t("party.title")} />

      <div className="-mx-4 flex flex-col gap-2 md:-mx-8 lg:-mx-16">
        <MarqueeRow people={row1} duration="55s" />
      </div>

      {/* Thin decorative line */}
      <div className="mx-auto mt-12 h-px w-24 bg-border" />
    </Section>
  );
}
