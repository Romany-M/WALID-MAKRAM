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

/* ✅ خط جديد للـ UI — واضح وحديث */
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

export const metadata = {
  title: "WALID MAKRAM",
  description: "ART GALLERY",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
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