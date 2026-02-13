import type { Metadata, Viewport } from "next"
import { Playfair_Display, Lora } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Amanda & Etienne - 22 Aout 2026",
  description:
    "Joignez-vous a nous pour celebrer notre mariage le 22 aout 2026 au Mouton Village, Saint-Charles-sur-Richelieu.",
}

export const viewport: Viewport = {
  themeColor: "#8B9F82",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${playfair.variable} ${lora.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
