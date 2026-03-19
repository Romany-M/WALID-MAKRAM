"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "EN" | "AR";
interface LangCtx { lang: Lang; toggleLang: () => void; }

const LanguageContext = createContext<LangCtx>({ lang: "EN", toggleLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("EN");
  const toggleLang = () => setLang(l => l === "EN" ? "AR" : "EN");
  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);

/* ── All site translations ── */
export const t: Record<string, Record<Lang, string>> = {
  // Navbar
  gallery:      { EN: "Gallery",      AR: "المعرض"       },
  murals_domes: { EN: "Murals Domes", AR: "الجداريات"    },
  Exhibitions:  { EN: "Exhibitions",  AR: "معارض" },
  about:        { EN: "About",        AR: "عن الفنان"    },
  contact:      { EN: "Contact",      AR: "تواصل"        },

  // Hero
  hero_name:    { EN: "DANA DAHDAL", AR: "دانا دحدل"    },
  hero_sub:     { EN: "ART GALLERY",  AR: "معرض فني"     },

  // Section labels
  selected_works:   { EN: "— Selected Works —",   AR: "— أعمال مختارة —"   },
  gallery_title:    { EN: "Gallery",               AR: "المعرض"              },
  Exhibitions_title:{ EN: "Exhibitions",  AR: "معارض"  },
  commission:       { EN: "— Commission a Work —", AR: "— طلب عمل فني —"    },
  contact_title:    { EN: "Contact",               AR: "تواصل معنا"          },

  // Gallery tabs
  Icons_art:   { EN: "Icons",   AR: "أيقونات"   },
  Gilding_Engraving: { EN: "Gilding & Engraving", AR: "تذهيب ونقش" },
  Mosaic_art: { EN: "Mosaic", AR: "فسيفساء"  },

  // Buttons
  explore_icons:   { EN: "Explore Icons",           AR: "استعرض الأيقونات" },
  explore_gilding: { EN: "Explore Gilding & Engraving", AR: "استعرض التذهيب والنقش" },
  explore_mosaic:  { EN: "Explore Mosaic",          AR: "استعرض الفسيفساء" },
  explore_murals:  { EN: "Explore Murals",          AR: "استعرض الجداريات" },
  explore_exhibitions: { EN: "Explore Exhibitions", AR: "استعرض المعارض" },

  // About
  philosophy:   { EN: "Philosophy",        AR: "الفلسفة"                   },
  beyond:       { EN: "Beyond the",        AR: "ما وراء"                   },
  visible:      { EN: "Visible World",     AR: "العالم المرئي"              },
  about_p1:     { EN: "Dana Dahdal is a master of iconography, a sacred art form where every line is a prayer and every color a theological statement.", AR: "دانا دحدل فنانة متخصصة في فن الأيقونات، حيث يمثل كل خط صلاة وكل لون تعبيرًا روحانيًا عميقًا." },
  about_quote:  { EN: "\"My work is not about creating art; it is about revealing the light that has existed for centuries within the sacred canons.\"", AR: "«عملي ليس عن صنع الفن، بل عن الكشف عن النور الذي وُجد لقرون داخل الكنون المقدسة»" },
  about_p2:     { EN: "Specializing in traditional techniques and gold leaf, her works extend across various artistic styles including icons, gilding, mosaics, and exhibitions.", AR: "تتخصص في التقنيات التقليدية وأوراق الذهب، وتمتد أعمالها عبر مجالات فنية متعددة مثل الأيقونات والتذهيب والفسيفساء والمعارض." },
  artist_caption: { EN: "The hand that creates art", AR: "اليد التي تصنع الفن" },

  // Contact form
  name:     { EN: "Name",          AR: "الاسم"         },
  email:    { EN: "Email",         AR: "البريد"        },
  subject:  { EN: "Subject",       AR: "الموضوع"       },
  message:  { EN: "Message",       AR: "الرسالة"       },
  name_ph:  { EN: "Your Name",     AR: "اسمك"          },
  email_ph: { EN: "Email Address", AR: "بريدك الإلكتروني" },
  sub_ph:   { EN: "Subject",       AR: "موضوع الرسالة" },
  msg_ph:   { EN: "Your Message",  AR: "رسالتك"        },
  send:     { EN: "Send Message",  AR: "إرسال"         },

  // Footer
  footer:   { EN: "© 2026 DANA DAHDAL", AR: "© 2026 دانا دحدل" },

  // Lightbox
  close:    { EN: "Close", AR: "إغلاق" },
  prev:     { EN: "← Prev", AR: "السابق ←" },
  next:     { EN: "Next →", AR: "→ التالي" },
};