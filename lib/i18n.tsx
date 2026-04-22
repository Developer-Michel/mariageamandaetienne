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
  "nav.music": { fr: "Musique", en: "Music" },
  "nav.contact": { fr: "Contact", en: "Contact" },

  // Hero
  "hero.date": { fr: "22 août 2026", en: "August 22, 2026" },
  "hero.venue": {
    fr: "Mouton Village, Saint-Charles-sur-Richelieu",
    en: "Mouton Village, Saint-Charles-sur-Richelieu",
  },
  "hero.cta.details": { fr: "Voir les détails", en: "View Details" },
  "hero.cta.rsvp": { fr: "Confirmer ma présence", en: "Confirm Attendance" },
  "hero.countdown.days": { fr: "Jours", en: "Days" },
  "hero.countdown.hours": { fr: "Heures", en: "Hours" },
  "hero.countdown.minutes": { fr: "Minutes", en: "Minutes" },
  "hero.countdown.seconds": { fr: "Secondes", en: "Seconds" },

  // Story
  "story.title": { fr: "Notre histoire", en: "Our Story" },
  "story.chapter1.title": {
    fr: "Première rencontre",
    en: "Our first date",
  },
  "story.chapter1.text": {
    fr: "Les deux amoureux ont vu le temps s'écouler, emportés par leur désir d’en apprendre davantage sur l’autre. Ce qui a commencé autour d’une simple crème glacée s’est doucement prolongé jusqu’à fort tard, comme s’ils ne voulaient déjà plus se quitter.",
    en: "The two strangers watched time slip by, swept up in their desire to learn more about each other. What began over a simple ice cream gently stretched late into the night, as if they already couldn’t bear to say goodbye.",
  },
  "story.chapter2.title": {
    fr: "Devenir un couple",
    en: "Becoming a couple",
  },
  "story.chapter2.text": {
    fr: "Pendant les deux premiers mois, ils ont peu à peu découvert le monde de l’autre, se rapprochant un peu plus chaque jour. Ils ont fait la distance qui les séparait simplement pour être ensemble. Lorsqu’ils sont devenus un couple, ils ont eu l’impression que tout prenait enfin sens.",
    en: "For the next two months, they both slowly uncovered each other’s world, growing closer with every passing day. They crossed the distance just to be together, choosing each other again and again. When they finally became a couple, it felt as though everything had fallen into place.",
  },
  "story.chapter3.title": {
    fr: "Notre parcours ensemble",
    en: "The journey to us",
  },
  "story.chapter3.text": {
    fr: "Au fil des années, leur amour s’est approfondi davantage. Ce qui a commencé comme de l’excitation s’est transformé en quelque chose de plus stable et sûr. Avec chaque regard et chaque rire partagé, le couple tombait un peu plus amoureux. Habiter ensemble était la prochaine étape - non seulement partager un espace mais construire une vie et un avenir ensemble.",
    en: "As months turned into years, their love for each other deepened. What began as excitement became steadier and more certain. With every shared laugh, they fell more and more in love. Moving in together felt like the most natural thing — not just sharing a space, but building a home, a life, and a future hand in hand.",
  },
  "story.chapter4.title": {
    fr: "Construire une vie",
    en: "Building a life",
  },
  "story.chapter4.text": {
    fr: "Alors qu’ils s'installent dans leur rythme paisible et partagé, ils ont accueilli deux chats dans leur vie — de petites boules d’amour qui les font vivre des émotions fortes, tant dans le cœur que dans l’esprit.",
    en: "As they settled into their calm, shared rhythm, they welcomed two cats into their lives — little bundles of love who whisk them away on daily adventures, both in heart and in spirit.",
  },
  "story.chapter5.title": {
    fr: "La demande en mariage",
    en: "The proposal",
  },
  "story.chapter5.text": {
    fr: "Etienne a recréé la magie de leurs premiers rendez-vous — partant de chaque petit sourire allant jusqu'à leurs endroits préférés — avant de poser enfin la grande question. C’était comme s’il avait soigneusement tissé l’histoire de leur amour, les conduisant tout naturellement à ce moment inoubliable.",
    en: "Etienne recreated the magic of their early dates - from the little laughs to the favorite spots they shared - before finally asking the big question. It was as if he had carefully stitched together the story of their love, leading them to that unforgettable moment.",
  },

  // Info
  "info.title": { fr: "Infos pratiques", en: "Practical Information" },
  "info.schedule.title": { fr: "Horaire", en: "Schedule" },
  "info.schedule.ceremony": { fr: "Cérémonie", en: "Ceremony" },
  "info.schedule.cocktail": { fr: "Cocktail", en: "Cocktail Hour" },
  "info.schedule.enter": {
    fr: "Entrée dans la salle",
    en: "Seating in the hall",
  },
  "info.schedule.dinner": { fr: "Souper", en: "Dinner" },
  "info.schedule.party": { fr: "Soirée dansante", en: "Dance Party" },
  "info.address.title": { fr: "Adresse", en: "Address" },
  "info.address.text": {
    fr: "12 Chem. des Patriotes, Saint-Charles-sur-Richelieu, QC J0H 2G0",
    en: "12 Chem. des Patriotes, Saint-Charles-sur-Richelieu, QC J0H 2G0",
  },
  "info.address.venue": { fr: "Mouton Village", en: "Mouton Village" },
  "info.accommodation.title": { fr: "Hébergement", en: "Accommodation" },
  "info.accommodation.text": {
    fr: "Plusieurs options d'hébergement sont disponibles à proximité. Nous vous recommandons de réserver tôt.",
    en: "Several accommodation options are available nearby. We recommend booking early.",
  },
  "info.tips.title": { fr: "Conseils", en: "Tips" },
  "info.tips.text": {
    fr: "Code vestimentaire : tenue de cocktail. Prévoyez des chaussures confortables pour la soirée dansante. Le stationnement est disponible sur place.",
    en: "Dress code: cocktail attire. Bring comfortable shoes for the dance party. Parking is available on site.",
  },
  "info.gift.title": { fr: "Cadeaux", en: "Gifts" },
  "info.gift.text": {
    fr: "Nous sommes heureux de vous avoir à nos côtés. Si vous désirez nous gâter, une participation financière nous aiderait à débuter cette nouvelle aventure.",
    en: "The greatest gift to us is having you by our side. If you wish to spoil us, a monetary contribution would help us begin this new chapter.",
  },

  // Hotel
  "hotel.title": {
    fr: "Hôtel Rive Gauche",
    en: "Hôtel Rive Gauche",
  },
  "hotel.subtitle": {
    fr: "Option d'hébergement recommandée à proximité",
    en: "Recommended nearby accommodation",
  },
  "hotel.instructions": {
    fr: "En appelant directement à la réception de l'hôtel : 450-467-4477 ou via le site internet : Reservations | Hôtel Rive Gauche en mentionnant le code groupe (195529).",
    en: "Call the hotel front desk at 450-467-4477 or book on the Reservations | Hôtel Rive Gauche site and mention the group code (195529).",
  },
  "hotel.call": { fr: "Téléphone", en: "Phone" },
  "hotel.online": { fr: "Réservation en ligne", en: "Online booking" },
  "hotel.groupCode": { fr: "Code groupe", en: "Group code" },

  // Party
  "party.title": { fr: "Les gens qui comptent", en: "People Who Matter" },
  "party.role.mother": { fr: "Mère de la mariée", en: "Mother of the Bride" },
  "party.role.father": { fr: "Père du marié", en: "Father of the Groom" },
  "party.role.bestman": { fr: "Témoin", en: "Best Man" },
  "party.role.maidofhonor": { fr: "Demoiselle d'honneur", en: "Maid of Honor" },
  "party.role.groomsman": { fr: "Garçon d'honneur", en: "Groomsman" },
  "party.role.bridesmaid": { fr: "Demoiselle d'honneur", en: "Bridesmaid" },
  "party.role.motherGroom": { fr: "Mère du marié", en: "Mother of the Groom" },
  "party.role.fatherBride": {
    fr: "Père de la mariée",
    en: "Father of the Bride",
  },
  "party.role.sister": { fr: "Sœur de la mariée", en: "Sister of the Bride" },
  "party.role.brother": { fr: "Frère du marié", en: "Brother of the Groom" },
  "party.role.uncle": { fr: "Oncle du marié", en: "Uncle of the Groom" },
  "party.role.aunt": { fr: "Tante de la mariée", en: "Aunt of the Bride" },
  "party.role.cousin": {
    fr: "Cousine de la mariée",
    en: "Cousin of the Bride",
  },
  "party.role.cousinGroom": {
    fr: "Cousin du marié",
    en: "Cousin of the Groom",
  },
  "party.role.friend": { fr: "Ami du couple", en: "Friend of the Couple" },
  "party.role.friendBride": {
    fr: "Amie de la mariée",
    en: "Friend of the Bride",
  },
  "party.role.friendGroom": { fr: "Ami du marié", en: "Friend of the Groom" },
  "party.role.officiant": { fr: "Officiant", en: "Officiant" },

  // Gallery
  "gallery.title": { fr: "Galerie", en: "Gallery" },
  "gallery.before": { fr: "Avant", en: "Before" },
  "gallery.after": { fr: "Après", en: "After" },
  "gallery.close": { fr: "Fermer", en: "Close" },

  // RSVP
  "rsvp.title": {
    fr: "Confirmez votre présence",
    en: "Confirm Your Attendance",
  },
  "rsvp.subtitle": {
    fr: "Nous avons hâte de célébrer avec vous",
    en: "We can't wait to celebrate with you",
  },
  "rsvp.attending": { fr: "Serez-vous présent(e)?", en: "Will you attend?" },
  "rsvp.yes": { fr: "Oui, avec joie !", en: "Yes, with joy!" },
  "rsvp.no": { fr: "Malheureusement, non", en: "Unfortunately, no" },
  "rsvp.guests": { fr: "Nombre d'accompagnateurs", en: "Number of guests" },
  "rsvp.allergies": {
    fr: "Allergies ou restrictions alimentaires",
    en: "Allergies or dietary restrictions",
  },
  "rsvp.meal": { fr: "Choix de repas", en: "Meal choice" },
  "rsvp.meal.select": {
    fr: "Sélectionnez un repas",
    en: "Select a meal",
  },
  "rsvp.meal.meat": {
    fr: "Filet de porc : BBQ du Québec, sauce romesco noisettes grillées, écrasé de PDT, ail et poivrons",
    en: "Pork filet: QC BBQ, romesco sauce with grilled hazelnuts, mashed potatoes, garlic and peppers",
  },
  "rsvp.meal.fish": {
    fr: "Surf & Turf : pièce de bœuf du boucher, chili crunch, maïs, acras de crevettes nordiques",
    en: "Surf & Turf: butcher's beef, chili crunch, corn, northern shrimp fritters",
  },
  "rsvp.meal.vegetarian": {
    fr: "Végé : Polenta, légumes grillés, romesco, vierge de lentilles Beluga, noisettes de Saint-Hilaire",
    en: "Végé: Polenta, grilled vegetables, romesco, Beluga lentil vinaigrette, Saint-Hilaire hazelnuts",
  },
  "rsvp.meal.enfant": {
    fr: "Menu enfant",
    en: "Children's menu",
  },
  "rsvp.message": {
    fr: "Un petit mot pour les mariés (optionnel)",
    en: "A note for the couple (optional)",
  },
  "rsvp.submit": { fr: "Envoyer ma réponse", en: "Send my response" },
  "rsvp.success": {
    fr: "Merci pour votre réponse !",
    en: "Thank you for your response!",
  },
  "rsvp.companions.title": { fr: "Accompagnateurs", en: "Companions" },
  "rsvp.companions.add": {
    fr: "Ajouter un accompagnateur",
    en: "Add a companion",
  },
  "rsvp.companions.none": {
    fr: "Ajoutez un accompagnateur si vous venez accompagné(e).",
    en: "Add a companion if you are not coming alone.",
  },
  "rsvp.companions.label": { fr: "Accompagnateur", en: "Companion" },
  "rsvp.companions.fullName": { fr: "Nom complet", en: "Full name" },
  "rsvp.companions.meal": { fr: "Choix du menu", en: "Menu choice" },
  "rsvp.companions.attending": { fr: "Présence", en: "Attendance" },
  "rsvp.companions.attending.pending": {
    fr: "Pas de réponse",
    en: "No response",
  },
  "rsvp.companions.attending.yes": {
    fr: "Sera présent",
    en: "Will attend",
  },
  "rsvp.companions.attending.no": {
    fr: "Ne sera pas présent",
    en: "Will not attend",
  },
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
  "reminder.cta": { fr: "Confirmer ma présence", en: "Confirm Attendance" },

  // Contact
  "contact.title": { fr: "Contact", en: "Contact" },
  "contact.subtitle": {
    fr: "N'hésitez pas à nous contacter pour toute question",
    en: "Don't hesitate to reach out with any questions",
  },
  "contact.email": { fr: "Courriel", en: "Email" },
  "contact.phone": { fr: "Téléphone", en: "Phone" },
  "contact.phone.secondary": {
    fr: "Téléphone secondaire",
    en: "Secondary Phone",
  },
  "contact.cta": { fr: "Envoyer un courriel", en: "Send an Email" },

  // Common
  "common.remove": { fr: "Retirer", en: "Remove" },

  // Guest
  "guest.badge": { fr: "Invité", en: "Guest" },

  // Music
  "music.label": { fr: "Musique", en: "Music" },
  "music.title": {
    fr: "Musique qui te donne envie de danser",
    en: "music that make you want to dance",
  },
  "music.form.song": { fr: "Nom de la chanson", en: "Song name" },
  "music.form.song.placeholder": {
    fr: "Ex: Dancing Queen",
    en: "Ex: Dancing Queen",
  },
  "music.form.name": {
    fr: "Nom de la personne qui recommande",
    en: "Name of the person who recommends",
  },
  "music.form.name.placeholder": {
    fr: "Votre nom",
    en: "Your name",
  },
  "music.form.send": { fr: "Envoyer", en: "Send" },
  "music.form.sending": { fr: "Envoi...", en: "Sending..." },
  "music.form.success": {
    fr: "Merci! Ta recommandation a ete envoyee.",
    en: "Thanks! Your recommendation has been sent.",
  },
  "music.form.error.required": {
    fr: "Merci de remplir les deux champs.",
    en: "Please fill out both fields.",
  },
  "music.form.error.send": {
    fr: "Impossible d'envoyer la recommandation pour le moment.",
    en: "Unable to send recommendation right now.",
  },

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
