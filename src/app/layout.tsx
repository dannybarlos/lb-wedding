import type { Metadata } from "next";
import { Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import { SITE_CONFIG } from "@/config/site.config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.couple.name1} & ${SITE_CONFIG.couple.name2} — ${SITE_CONFIG.wedding.displayDate}`,
  description: `Join us to celebrate the wedding of ${SITE_CONFIG.couple.name1} and ${SITE_CONFIG.couple.name2} on ${SITE_CONFIG.wedding.displayDate} at ${SITE_CONFIG.wedding.venue.name}.`,
  openGraph: {
    title: `${SITE_CONFIG.couple.monogram} — ${SITE_CONFIG.wedding.displayDate}`,
    description: `You're cordially invited to celebrate the wedding of ${SITE_CONFIG.couple.name1} & ${SITE_CONFIG.couple.name2}.`,
    type: "website",
    images: [{ url: "/images/venue-illustration.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`h-full ${playfair.variable} ${caveat.variable}`}
    >
      <body className="min-h-full" style={{ backgroundColor: "var(--color-bg)" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
