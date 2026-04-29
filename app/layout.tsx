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
    default : "Walid Makram | Art Gallery — معرض وليد مكرم ",
    template: "%s | Walid Makram Art Gallery",
  },
  description:
    "Walid Makram — Egyptian artist specializing in Ancient Egyptian Art, Coptic Art, Oil Paintings, and monumental Murals & Domes. معرض وليد مكرم الفنان المصري متخصص في الفن المصري القديم، الفن القبطي، اللوحات الزيتية والجداريات.",
  keywords: [
    "Walid Makram", "Waled Makram", "وليد مكرم",
    "Walid Makram Art", "Walid Makram Gallery", "معرض وليد مكرم",
    "Egyptian Artist", "فنان مصري",
    "Ancient Egyptian Art", "الفن المصري القديم",
    "Coptic Art", "الفن القبطي",
    "Oil Paintings", "لوحات زيتية",
    "Murals Egypt", "جداريات مصر",
    "Church Murals Egypt", "جداريات كنائس مصر",
    "Art Gallery Egypt", "معرض فن مصر",
    "painter egypt", "رسام مصري",
  ],
  authors    : [{ name: "Walid Makram", url: "https://walidmakram.art" }],
  creator    : "Walid Makram",
  metadataBase: new URL("https://walidmakram.art"),
  alternates : {
    canonical: "/",
    languages: { "en-US": "/", "ar-EG": "/" },
  },
  verification: {
    google: "a663a827ed909103",
  },
  openGraph: {
    type           : "website",
    locale         : "en_US",
    alternateLocale: "ar_EG",
    url            : "https://walidmakram.art",
    siteName       : "Walid Makram",
    title          : "Walid Makram | Egyptian Artist — معرض وليد مكرم",
    description    : "Discover the art of Walid Makram — Ancient Egyptian, Coptic, Oil Paintings & Murals. اكتشف أعمال وليد مكرم الفنية.",
    images: [{
      url   : "https://walidmakram.art/og-image.jpg",
      width : 1200,
      height: 630,
      alt   : "Walid Makram Art Gallery",
    }],
  },
  twitter: {
    card       : "summary_large_image",
    title      : "Walid Makram | Egyptian Artist",
    description: "Ancient Egyptian Art, Coptic Art, Oil Paintings & Murals",
    images     : ["https://walidmakram.art/og-image.jpg"],
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

        {/* JSON-LD — WebSite — بيخلي جوجل يعرض اسم الموقع صح */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context"    : "https://schema.org",
              "@type"       : "WebSite",
              "name"        : "Walid Makram",
              "alternateName": "معرض وليد مكرم",
              "url"         : "https://walidmakram.art",
            }),
          }}
        />

        {/* JSON-LD — ArtGallery — بيساعد جوجل يفهم الموقع */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context"    : "https://schema.org",
              "@type"       : "ArtGallery",
              "name"        : "Walid Makram Art Gallery",
              "alternateName": ["معرض وليد مكرم", "Waled Makram Gallery"],
              "description" : "Egyptian artist specializing in Ancient Egyptian Art, Coptic Art, Oil Paintings and Murals",
              "url"         : "https://walidmakram.art",
              "image"       : "https://walidmakram.art/og-image.jpg",
              "founder": {
                "@type"        : "Person",
                "name"         : "Walid Makram",
                "alternateName": "وليد مكرم",
                "jobTitle"     : "Artist",
                "nationality"  : "Egyptian",
              },
              "sameAs": [
                "https://www.instagram.com/painterwaled",
                "https://www.facebook.com/painter.waled.makram",
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