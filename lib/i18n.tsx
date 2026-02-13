"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type Locale = "fr" | "en";

type Translations = {
  [key: string]: {
    fr: string;
    en: string;
  };
};

export const translations: Translations = {
  // Nav
  "nav.story": { fr: "Notre histoire", en: "Our Story" },
  "nav.info": { fr: "Infos pratiques", en: "Practical Info" },
  "nav.party": { fr: "Proches", en: "Wedding Party" },
  "nav.gallery": { fr: "Galerie", en: "Gallery" },
  "nav.rsvp": { fr: "RSVP", en: "RSVP" },
  "nav.contact": { fr: "Contact", en: "Contact" },

  // Hero
  "hero.date": { fr: "22 Aout 2026", en: "August 22, 2026" },
  "hero.venue": {
    fr: "Mouton Village, Saint-Charles-sur-Richelieu",
    en: "Mouton Village, Saint-Charles-sur-Richelieu",
  },
  "hero.cta.details": { fr: "Voir les details", en: "View Details" },
  "hero.cta.rsvp": { fr: "Confirmer ma presence", en: "Confirm Attendance" },
  "hero.countdown.days": { fr: "Jours", en: "Days" },
  "hero.countdown.hours": { fr: "Heures", en: "Hours" },
  "hero.countdown.minutes": { fr: "Minutes", en: "Minutes" },
  "hero.countdown.seconds": { fr: "Secondes", en: "Seconds" },

  // Story
  "story.title": { fr: "Notre histoire", en: "Our Story" },
  "story.chapter1.title": {
    fr: "La premiere rencontre",
    en: "When We First Met",
  },
  "story.chapter1.text": {
    fr: "Tout a commnercer avec Étienne qui attandait devant son auto ",
    en: "It all started on an ordinary day that became extraordinary. A glance, a smile, and the beginning of a beautiful adventure.",
  },
  "story.chapter2.title": {
    fr: "L'amour fleurit",
    en: "Our First Date",
  },
  "story.chapter2.text": {
    fr: "pendant un mois ils apprirent à se connaître, partagèrent des rires et eurent la certitude que quelque chose de spécial était en train de naître.",
    en: "A coffee that lasted hours, shared laughter, and the certainty that something special was blossoming.",
  },
  "story.chapter3.title": {
    fr: "L'officialisation du couple",
    en: "The Proposal",
  },
  "story.chapter3.text": {
    fr: "Ils ont commencer à planifier une vie ensemble, remplie d'amour, de complicité et d'aventures partagées. Un moment magique, un genou à terre, et un oui qui a scellé notre promesse d'amour éternel.",
    en: "A magical moment, a bent knee, and a yes that sealed our promise of eternal love.",
  },
  "story.chapter4.title": {
    fr: "Achat de la maison ensemble",
    en: "Buying a House Together",
  },
  "story.chapter4.text": {
    fr: "Ils ont commencer à planifier une vie ensemble, remplie d'amour, de complicité et d'aventures partagées. Un moment magique, un genou à terre, et un oui qui a scellé notre promesse d'amour éternel.",
    en: "A magical moment, a bent knee, and a yes that sealed our promise of eternal love.",
  },
  "story.chapter5.title": {
    fr: "Adoption d'enfant",
    en: "Adoption",
  },
  "story.chapter5.text": {
    fr: "Ils ont commencer à planifier une vie ensemble, remplie d'amour, de complicité et d'aventures partagées. Un moment magique, un genou à terre, et un oui qui a scellé notre promesse d'amour éternel.",
    en: "A magical moment, a bent knee, and a yes that sealed our promise of eternal love.",
  },
  "story.chapter6.title": {
    fr: "La demande",
    en: "The Proposal",
  },
  "story.chapter6.text": {
    fr: "Ils ont commencer à planifier une vie ensemble, remplie d'amour, de complicité et d'aventures partagées. Un moment magique, un genou à terre, et un oui qui a scellé notre promesse d'amour éternel.",
    en: "A magical moment, a bent knee, and a yes that sealed our promise of eternal love.",
  },

  // Info
  "info.title": { fr: "Infos pratiques", en: "Practical Information" },
  "info.schedule.title": { fr: "Horaire", en: "Schedule" },
  "info.schedule.ceremony": { fr: "Ceremonie", en: "Ceremony" },
  "info.schedule.cocktail": { fr: "Cocktail", en: "Cocktail Hour" },
  "info.schedule.dinner": { fr: "Souper", en: "Dinner" },
  "info.schedule.party": { fr: "Soiree dansante", en: "Dance Party" },
  "info.address.title": { fr: "Adresse", en: "Address" },
  "info.address.text": {
    fr: "12 Chem. des Patriotes, Saint-Charles-sur-Richelieu, QC J0H 2G0",
    en: "12 Chem. des Patriotes, Saint-Charles-sur-Richelieu, QC J0H 2G0",
  },
  "info.address.venue": { fr: "Mouton Village", en: "Mouton Village" },
  "info.accommodation.title": { fr: "Hebergement", en: "Accommodation" },
  "info.accommodation.text": {
    fr: "Plusieurs options d'hebergement sont disponibles a proximite. Nous vous recommandons de reserver tot.",
    en: "Several accommodation options are available nearby. We recommend booking early.",
  },
  "info.tips.title": { fr: "Conseils", en: "Tips" },
  "info.tips.text": {
    fr: "Code vestimentaire: tenue de cocktail. Prevoyez des chaussures confortables pour la soiree dansante. Le stationnement est disponible sur place.",
    en: "Dress code: cocktail attire. Bring comfortable shoes for the dance party. Parking is available on site.",
  },

  // Party
  "party.title": { fr: "Les gens qui comptent", en: "People Who Matter" },
  "party.role.mother": { fr: "Mere de la mariee", en: "Mother of the Bride" },
  "party.role.father": { fr: "Pere du marie", en: "Father of the Groom" },
  "party.role.bestman": { fr: "Temoin", en: "Best Man" },
  "party.role.maidofhonor": { fr: "Demoiselle d'honneur", en: "Maid of Honor" },
  "party.role.groomsman": { fr: "Garcon d'honneur", en: "Groomsman" },
  "party.role.bridesmaid": { fr: "Demoiselle d'honneur", en: "Bridesmaid" },
  "party.role.motherGroom": { fr: "Mere du marie", en: "Mother of the Groom" },
  "party.role.fatherBride": {
    fr: "Pere de la mariee",
    en: "Father of the Bride",
  },
  "party.role.sister": { fr: "Soeur de la mariee", en: "Sister of the Bride" },
  "party.role.brother": { fr: "Frere du marie", en: "Brother of the Groom" },
  "party.role.uncle": { fr: "Oncle du marie", en: "Uncle of the Groom" },
  "party.role.aunt": { fr: "Tante de la mariee", en: "Aunt of the Bride" },
  "party.role.cousin": {
    fr: "Cousine de la mariee",
    en: "Cousin of the Bride",
  },
  "party.role.cousinGroom": {
    fr: "Cousin du marie",
    en: "Cousin of the Groom",
  },
  "party.role.friend": { fr: "Ami du couple", en: "Friend of the Couple" },
  "party.role.friendBride": {
    fr: "Amie de la mariee",
    en: "Friend of the Bride",
  },
  "party.role.friendGroom": { fr: "Ami du marie", en: "Friend of the Groom" },
  "party.role.officiant": { fr: "Officiant", en: "Officiant" },

  // Gallery
  "gallery.title": { fr: "Galerie", en: "Gallery" },
  "gallery.before": { fr: "Avant", en: "Before" },
  "gallery.after": { fr: "Apres", en: "After" },
  "gallery.close": { fr: "Fermer", en: "Close" },

  // RSVP
  "rsvp.title": {
    fr: "Confirmez votre presence",
    en: "Confirm Your Attendance",
  },
  "rsvp.subtitle": {
    fr: "Nous avons hate de celebrer avec vous",
    en: "We can't wait to celebrate with you",
  },
  "rsvp.attending": { fr: "Serez-vous present(e)?", en: "Will you attend?" },
  "rsvp.yes": { fr: "Oui, avec joie!", en: "Yes, with joy!" },
  "rsvp.no": { fr: "Malheureusement, non", en: "Unfortunately, no" },
  "rsvp.guests": { fr: "Nombre d'accompagnateurs", en: "Number of guests" },
  "rsvp.allergies": {
    fr: "Allergies ou restrictions alimentaires",
    en: "Allergies or dietary restrictions",
  },
  "rsvp.meal": { fr: "Choix de repas", en: "Meal choice" },
  "rsvp.meal.meat": {
    fr: "Filet de porc: qc bbq, sauce romesco noisette grillées, ecrasé de pdt, ail et poivrons",
    en: "Pork filet: QC BBQ, romesco sauce with grilled hazelnuts, mashed potatoes, garlic and peppers",
  },
  "rsvp.meal.fish": {
    fr: "Surf & Turf: pièce de boeuf du boucher,chili crunch, maïs,acras de crevettes nordiques",
    en: "Surf & Turf: butcher's beef, chili crunch, corn, northern shrimp fritters",
  },
  "rsvp.meal.vegetarian": {
    fr: "Végé: Polenta, légumes grillés,romesco, vierge de lentilles Beluga, noisette Saint-Hilaire",
    en: "Végé:Polenta, grilled vegetables, romesco, Beluga lentil vinaigrette, Saint-Hilaire hazelnuts",
  },
  "rsvp.meal.enfant": {
    fr: "Menu enfant",
    en: "Children's menu",
  },
  "rsvp.message": {
    fr: "Un petit mot pour les maries (optionnel)",
    en: "A note for the couple (optional)",
  },
  "rsvp.submit": { fr: "Envoyer ma reponse", en: "Send my response" },
  "rsvp.success": {
    fr: "Merci pour votre reponse!",
    en: "Thank you for your response!",
  },
  "rsvp.companions.title": { fr: "Accompagnateurs", en: "Companions" },
  "rsvp.companions.add": {
    fr: "Ajouter un accompagnateur",
    en: "Add a companion",
  },
  "rsvp.companions.none": {
    fr: "Ajoutez un accompagnateur si vous venez accompagne(e).",
    en: "Add a companion if you are not coming alone.",
  },
  "rsvp.companions.label": { fr: "Accompagnateur", en: "Companion" },
  "rsvp.companions.fullName": { fr: "Nom complet", en: "Full name" },
  "rsvp.companions.meal": { fr: "Choix du menu", en: "Menu choice" },
  "rsvp.companions.restrictions": {
    fr: "Restrictions ou allergies",
    en: "Restrictions or allergies",
  },
  "rsvp.companions.restrictionsPlaceholder": {
    fr: "Ex: sans gluten, sans lactose...",
    en: "Ex: gluten-free, lactose-free...",
  },

  // Reminder
  "reminder.text": { fr: "On se retrouve dans...", en: "See you in..." },
  "reminder.cta": { fr: "Confirmer ma presence", en: "Confirm Attendance" },

  // Contact
  "contact.title": { fr: "Contact", en: "Contact" },
  "contact.subtitle": {
    fr: "N'hesitez pas a nous contacter pour toute question",
    en: "Don't hesitate to reach out with any questions",
  },
  "contact.email": { fr: "Courriel", en: "Email" },
  "contact.phone": { fr: "Telephone", en: "Phone" },
  "contact.phone.secondary": {
    fr: "Telephone secondaire",
    en: "Secondary Phone",
  },
  "contact.cta": { fr: "Envoyer un courriel", en: "Send an Email" },

  // Common
  "common.remove": { fr: "Retirer", en: "Remove" },

  // Guest
  "guest.badge": { fr: "Invite", en: "Guest" },

  // Music
  "music.label": { fr: "Musique", en: "Music" },

  // Footer
  "footer.text": { fr: "Fait avec amour", en: "Made with love" },
};

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    if (lang === "en" || lang === "fr") {
      setLocale(lang);
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[locale] || key;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
