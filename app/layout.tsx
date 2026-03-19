import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import LenisProvider from "./components/LenisProvider";
import { LanguageProvider } from "./components/LanguageContext";
import { Cormorant_Garamond, Amiri, Almarai, Outfit } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-outfit",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-amiri",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-almarai",
});

/* ══ SEO Metadata ══ */
export const metadata: Metadata = {
  title: {
    default : "Dana Dahdal | Art Gallery — معرض دانا دحدال",
    template: "%s | Dana Dahdal Art Gallery",
  },
  description:
    "Dana Dahdal — Iconographer specializing in Byzantine, Greek Orthodox, and Syrian sacred art, icons and church murals. دانا دهدال فنانة متخصصة في الفن البيزنطي والأيقونات والجداريات الكنسية.",
  keywords: [
    "Dana Dahdal", "دانا دحدال",
    "Dana Dahdal Art", "Dana Dahdal Gallery", "معرض دانا دحدال",
    "Byzantine Art", "الفن البيزنطي",
    "Greek Orthodox Art", "الفن الأرثوذكسي اليوناني",
    "Syrian Christian Art", "الفن المسيحي السوري",
    "Iconography", "الأيقونات",
    "Sacred Art", "فن ديني",
    "Church Icons", "أيقونات كنسية",
    "Murals", "جداريات",
    "Religious Art", "فن ديني",
  ],
  authors    : [{ name: "Dana Dahdal" }],
  creator    : "Dana Dahdal",
  metadataBase: new URL("https://your-domain.com"),
  alternates : {
    canonical: "/",
    languages: { "en-US": "/", "ar-EG": "/" },
  },
  openGraph: {
    type           : "website",
    locale         : "en_US",
    alternateLocale: "ar_EG",
    url            : "https://your-domain.com",
    siteName       : "Dana Dahdal Art Gallery",
    title          : "Dana Dahdal | Byzantine Iconographer",
    description    : "Discover Byzantine, Greek Orthodox & Syrian sacred art and iconography",
    images: [{
      url   : "https://your-domain.com/og-image.jpg",
      width : 1200,
      height: 630,
      alt   : "Dana Dahdal Art Gallery",
    }],
  },
  twitter: {
    card       : "summary_large_image",
    title      : "Dana Dahdal | Iconographer",
    description: "Byzantine & Sacred Art",
    images     : ["https://your-domain.com/og-image.jpg"],
  },
  robots: {
    index    : true,
    follow   : true,
    googleBot: {
      index              : true,
      follow             : true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ArtGallery",
              "name": "Dana Dahdal Art Gallery",
              "alternateName": ["معرض دانا دحدال"],
              "description": "Iconographer specializing in Byzantine, Greek Orthodox and Syrian sacred art",
              "url": "https://your-domain.com",
              "image": "https://your-domain.com/og-image.jpg",
              "founder": {
                "@type": "Person",
                "name": "Dana Dahdal",
                "jobTitle": "Iconographer",
              },
              "sameAs": [
                "https://www.instagram.com/dana.dahdal.iconographer",
                "https://www.facebook.com/dana.dahdal.58"
              ],
            }),
          }}
        />
      </head>

      <body className={`${cormorant.variable} ${outfit.variable} ${amiri.variable} ${almarai.variable} ${outfit.className}`}>
        <LanguageProvider>
          <LenisProvider>
            <Navbar />
            {children}
          </LenisProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}