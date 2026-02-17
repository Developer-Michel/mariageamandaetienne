import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import { storageUrl } from "@/lib/utils";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amanda & Etienne",
  description:
    "Joignez-vous a nous pour celebrer notre mariage le 22 aout 2026 au Mouton Village, Saint-Charles-sur-Richelieu.",
  icons: {
    icon: storageUrl("icon.png", "/icon.png"),
    shortcut: storageUrl("icon.png", "/icon.png"),
    apple: storageUrl("icon.png", "/icon.png"),
  },
};

export const viewport: Viewport = {
  themeColor: "#8B9F82",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${lora.variable} font-sans antialiased`}
      >
        {children}
        <div className="pointer-events-none fixed bottom-4 right-4 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70 md:text-xs">
          Designed & developed by Michel Racicot
        </div>
      </body>
    </html>
  );
}
