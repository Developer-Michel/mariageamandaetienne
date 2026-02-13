"use client"

import { useI18n } from "@/lib/i18n"
import { Section, SectionHeader } from "./section"

const row1 = [
  { name: "Catherine Lim", roleKey: "party.role.mother", initials: "CL" },
  { name: "Pierre Laniel", roleKey: "party.role.father", initials: "PL" },
  { name: "Maxime Laniel", roleKey: "party.role.bestman", initials: "ML" },
  { name: "Sophie Chen", roleKey: "party.role.maidofhonor", initials: "SC" },
  { name: "Alexandre Tremblay", roleKey: "party.role.groomsman", initials: "AT" },
  { name: "Isabelle Nguyen", roleKey: "party.role.bridesmaid", initials: "IN" },
  { name: "Marie-Claire Laniel", roleKey: "party.role.motherGroom", initials: "MC" },
  { name: "David Lim", roleKey: "party.role.fatherBride", initials: "DL" },
  { name: "Camille Lim", roleKey: "party.role.sister", initials: "CL" },
  { name: "Gabriel Laniel", roleKey: "party.role.brother", initials: "GL" },
]

const row2 = [
  { name: "Jean-Marc Laniel", roleKey: "party.role.uncle", initials: "JM" },
  { name: "Lucie Tran", roleKey: "party.role.aunt", initials: "LT" },
  { name: "Emilie Lavoie", roleKey: "party.role.cousin", initials: "EL" },
  { name: "Hugo Bergeron", roleKey: "party.role.cousinGroom", initials: "HB" },
  { name: "Vincent Gagnon", roleKey: "party.role.friend", initials: "VG" },
  { name: "Mei Lin Wu", roleKey: "party.role.friendBride", initials: "MW" },
  { name: "Philippe Moreau", roleKey: "party.role.friendGroom", initials: "PM" },
  { name: "Aurelie Dubois", roleKey: "party.role.friend", initials: "AD" },
  { name: "Marc-Antoine Roy", roleKey: "party.role.officiant", initials: "MR" },
  { name: "Sarah Bouchard", roleKey: "party.role.friendBride", initials: "SB" },
]

function PersonCard({ name, role, initials }: { name: string; role: string; initials: string }) {
  return (
    <div className="flex w-48 shrink-0 flex-col items-center px-4 text-center md:w-56">
      <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full border border-border/60 bg-secondary/50 transition-colors duration-300 hover:border-primary/40 hover:bg-secondary md:h-28 md:w-28">
        <span className="font-serif text-xl tracking-wide text-muted-foreground/70 md:text-2xl">
          {initials}
        </span>
      </div>
      <h3 className="font-serif text-base font-light text-foreground">{name}</h3>
      <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{role}</p>
    </div>
  )
}

function MarqueeRow({
  people,
  reverse = false,
  duration,
}: {
  people: typeof row1
  reverse?: boolean
  duration: string
}) {
  const { t } = useI18n()

  // Duplicate the list so the second copy seamlessly follows the first
  const doubled = [...people, ...people]

  return (
    <div className="group relative overflow-hidden py-6">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-24" />

      <div
        className={reverse ? "animate-marquee-reverse flex w-max" : "animate-marquee flex w-max"}
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
  )
}

export function Party() {
  const { t } = useI18n()

  return (
    <Section id="party" reveal="up">
      <SectionHeader title={t("party.title")} />

      <div className="-mx-4 flex flex-col gap-2 md:-mx-8 lg:-mx-16">
        <MarqueeRow people={row1} duration="55s" />
        <MarqueeRow people={row2} reverse duration="65s" />
      </div>

      {/* Thin decorative line */}
      <div className="mx-auto mt-12 h-px w-24 bg-border" />
    </Section>
  )
}
