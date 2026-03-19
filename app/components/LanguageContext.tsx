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
  various_art:  { EN: "Various Art",  AR: "أعمال متنوعة" },
  about:        { EN: "About",        AR: "عن الفنان"    },
  contact:      { EN: "Contact",      AR: "تواصل"        },

  // Hero
  hero_name:    { EN: "WALID MAKRAM", AR: "وليد مكرم"    },
  hero_sub:     { EN: "ART GALLERY",  AR: "معرض فني"     },

  // Section labels
  selected_works:   { EN: "— Selected Works —",   AR: "— أعمال مختارة —"   },
  gallery_title:    { EN: "Gallery",               AR: "المعرض"              },
  various_title:    { EN: "Various Works of Art",  AR: "أعمال فنية متنوعة"  },
  commission:       { EN: "— Commission a Work —", AR: "— طلب عمل فني —"    },
  contact_title:    { EN: "Contact",               AR: "تواصل معنا"          },

  // Gallery tabs
  ancient_art:   { EN: "Ancient Art",   AR: "الفن القديم"   },
  coptic_art:    { EN: "Coptic Art",    AR: "الفن القبطي"   },
  oil_paintings: { EN: "Oil Paintings", AR: "أعمال زيتية"  },

  // Buttons
  explore_ancient:  { EN: "Explore All Ancient Art",        AR: "استعرض الفن القديم"         },
  explore_coptic:   { EN: "Explore All Coptic Art",         AR: "استعرض الفن القبطي"         },
  explore_oil:      { EN: "Explore All Oil Paintings",      AR: "استعرض اللوحات الزيتية"     },
  explore_murals:   { EN: "Explore All Murals",             AR: "استعرض الجداريات"           },
  explore_various:  { EN: "Explore All Various Works of Art", AR: "استعرض الأعمال المتنوعة"  },

  // About
  philosophy:   { EN: "Philosophy",        AR: "الفلسفة"                   },
  beyond:       { EN: "Beyond the",        AR: "ما وراء"                   },
  visible:      { EN: "Visible World",     AR: "العالم المرئي"              },
  about_p1:     { EN: "Walid Makram is a master of iconography, a sacred art form where every line is a prayer and every color a theological statement.", AR: "وليد مكرم أستاذ في فن الأيقونات، هذا الفن المقدس الذي تكون فيه كل خطوط رسالةً وكل ألوان شهادةً لاهوتية." },
  about_quote:  { EN: "\"My work is not about creating art; it is about revealing the light that has existed for centuries within the sacred canons.\"", AR: "«عملي ليس عن صنع الفن، بل عن الكشف عن النور الذي وُجد لقرون داخل الكنون المقدسة»" },
  about_p2:     { EN: "Specializing in egg tempera and 24K gold leaf, his icons adorn cathedrals and private collections across the Middle East and Europe, preserving a tradition that spans over two millennia.", AR: "متخصص في تمبيرا البيض وأوراق الذهب عيار 24، وأيقوناته تزين الكاتدرائيات والمجموعات الخاصة في الشرق الأوسط وأوروبا." },
  artist_caption: { EN: "The hand that traces the divine", AR: "اليد التي ترسم الإلهي" },

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
  footer:   { EN: "© 2026 WALID MAKRAM", AR: "© 2026 وليد مكرم" },

  // Lightbox
  close:    { EN: "Close", AR: "إغلاق" },
  prev:     { EN: "← Prev", AR: "السابق ←" },
  next:     { EN: "Next →", AR: "→ التالي" },
};