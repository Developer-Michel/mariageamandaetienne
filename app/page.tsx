"use client";

import { I18nProvider } from "@/lib/i18n";
import { GuestProvider } from "@/lib/guest";
import { Navigation } from "@/components/wedding/navigation";
import { Hero } from "@/components/wedding/hero";
import { Story } from "@/components/wedding/story";
import { Info } from "@/components/wedding/info";
import { Party } from "@/components/wedding/party";
import { Gallery } from "@/components/wedding/gallery";
import { RSVPForm } from "@/components/wedding/rsvp";
import { HotelInfo } from "@/components/wedding/hotel";
import { Reminder } from "@/components/wedding/reminder";
import { MusicRecommendation } from "@/components/wedding/music-recommendation";
import { Contact } from "@/components/wedding/contact";
import { Footer } from "@/components/wedding/footer";

export default function WeddingPage() {
  return (
    <I18nProvider>
      <GuestProvider>
        <Navigation />
        <main>
          <Hero />
          <Story />
          <Info />
          <Party />
          <Gallery />
          <RSVPForm />
          <HotelInfo />
          <Reminder />
          <MusicRecommendation />
          <Contact />
        </main>
        <Footer />
      </GuestProvider>
    </I18nProvider>
  );
}
