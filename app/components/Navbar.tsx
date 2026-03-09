"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLang, t } from "./LanguageContext";

const categoryToNameKey: Record<string, string> = {
  ancient: "gallery",
  coptic:  "gallery",
  oil:     "gallery",
  various: "various_art",
  murals:  "murals_domes",
};

const links = [
  { nameKey: "gallery",      href: "#gallery", id: "gallery"  },
  { nameKey: "murals_domes", href: "#murals",  id: "murals"   },
  { nameKey: "various_art",  href: "#various", id: "various"  },
  { nameKey: "about",        href: "#about",   id: "about"    },
  { nameKey: "contact",      href: "#contact", id: "contact"  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [active,   setActive]   = useState<string>("");
  const [isDark,   setIsDark]   = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang } = useLang();

  // ✅ كل الـ hooks لازم تيجي قبل أي return
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isHome  = pathname === "/";

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (isAdmin || isHome) return;
    const parts = pathname?.split("/") ?? [];
    if (parts[1] === "gallery" && parts[2]) {
      const key = categoryToNameKey[parts[2]];
      if (key) setActive(key);
    }
  }, [pathname, isHome, isAdmin]);

  useEffect(() => {
    if (isAdmin || !isHome) return;
    const handleScroll = () => {
      const middle = window.scrollY + window.innerHeight / 2;
      let current = "";
      links.forEach(({ id, nameKey }) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (middle >= el.offsetTop && middle < el.offsetTop + el.offsetHeight)
          current = nameKey;
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, isAdmin]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // ✅ الـ early return بعد كل الـ hooks
  if (isAdmin) return null;

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) html.classList.remove("dark");
    else        html.classList.add("dark");
    setIsDark(!isDark);
  };

  const handleNavClick = (id: string, nameKey: string) => {
    setActive(nameKey);
    setMenuOpen(false);
    if (!isHome) sessionStorage.setItem("scrollToSection", id);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 backdrop-blur-md
                         bg-white/90 dark:bg-[#0f0f0f]/90
                         border-b border-neutral-200/60 dark:border-neutral-800/40">
        <div className="flex items-center justify-between px-5 py-4 md:hidden">
          <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-700 dark:text-neutral-300 font-light">
            Walid Makram
          </span>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            className="flex flex-col gap-[5px] p-2 group"
          >
            <span className={`block w-6 h-[1.5px] bg-neutral-700 dark:bg-neutral-300 transition-all duration-300
              ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}/>
            <span className={`block h-[1.5px] bg-neutral-700 dark:bg-neutral-300 transition-all duration-300
              ${menuOpen ? "opacity-0 w-0" : "w-6"}`}/>
            <span className={`block w-6 h-[1.5px] bg-neutral-700 dark:bg-neutral-300 transition-all duration-300
              ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}/>
          </button>
        </div>

        {/* ── Desktop Nav ── */}
        <nav className={`hidden md:flex items-center justify-center px-10 py-5
          ${lang === "AR" ? "gap-8" : "gap-10"}`}
          dir={lang === "AR" ? "rtl" : "ltr"}>
          {links.map(link => (
            <div key={link.nameKey} className="relative">
              <Link
                href={isHome ? link.href : "/"}
                onClick={() => handleNavClick(link.id, link.nameKey)}
                className={`transition duration-300
                  ${lang === "AR" ? "ar-nav-link" : "text-[10px] tracking-[0.25em] uppercase"}
                  ${active === link.nameKey
                    ? "text-[#b8955a]"
                    : "text-neutral-700 dark:text-neutral-300 hover:text-amber-500 dark:hover:text-amber-400"}`}>
                {t[link.nameKey][lang]}
              </Link>
              <span className={`absolute left-0 -bottom-2 h-[1px] bg-[#b8955a] transition-all duration-400
                ${active === link.nameKey ? "w-full" : "w-0"}`}/>
              {!isHome && active === link.nameKey && (
                <span className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#b8955a]" />
              )}
            </div>
          ))}
        </nav>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white/97 dark:bg-[#0a0a0a]/97 backdrop-blur-md
                       flex flex-col items-center justify-center gap-10 md:hidden"
            dir={lang === "AR" ? "rtl" : "ltr"}
          >
            {links.map((link, i) => (
              <motion.div key={link.nameKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}>
                <Link
                  href={isHome ? link.href : "/"}
                  onClick={() => handleNavClick(link.id, link.nameKey)}
                  className={`block text-center transition duration-300
                    ${lang === "AR"
                      ? "font-almarai text-2xl font-light tracking-wide"
                      : "text-base tracking-[0.4em] uppercase font-light"}
                    ${active === link.nameKey
                      ? "text-[#b8955a]"
                      : "text-neutral-800 dark:text-neutral-200"}`}>
                  {t[link.nameKey][lang]}
                </Link>
              </motion.div>
            ))}
            <div className="flex gap-4 mt-6">
              <button onClick={toggleLang}
                className="px-5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-full
                           text-xs tracking-widest uppercase text-neutral-600 dark:text-neutral-400
                           hover:border-[#b8955a] hover:text-[#b8955a] transition duration-300">
                {lang === "EN" ? "عربي" : "English"}
              </button>
              <button onClick={toggleTheme}
                className="px-5 py-2 border border-neutral-300 dark:border-neutral-700 rounded-full
                           text-xs tracking-widest uppercase text-neutral-600 dark:text-neutral-400
                           hover:border-[#b8955a] hover:text-[#b8955a] transition duration-300">
                {isDark ? "Light" : "Dark"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Controls (desktop) ── */}
      <div className="hidden md:flex fixed bottom-8 right-8 z-50 flex-col gap-3">
        <button onClick={toggleLang} aria-label="Toggle language"
          className="relative w-11 h-11 flex items-center justify-center rounded-full
                     bg-[#0f0f0f]/80 border border-neutral-700 backdrop-blur-md
                     hover:border-[#b8955a] transition-all duration-300 group">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"
               className="w-4 h-4 stroke-neutral-300 group-hover:stroke-[#b8955a] transition duration-300">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span className="absolute -top-1 -right-1 text-[7px] tracking-wider bg-[#b8955a] text-white
                           w-4 h-4 rounded-full flex items-center justify-center font-medium">
            {lang}
          </span>
        </button>

        <button onClick={toggleTheme} aria-label="Toggle theme"
          className="w-11 h-11 flex items-center justify-center rounded-full
                     bg-[#0f0f0f]/80 border border-neutral-700 backdrop-blur-md
                     hover:border-[#b8955a] transition-all duration-300 group">
          {isDark ? (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"
                 className="w-4 h-4 stroke-neutral-300 group-hover:stroke-[#b8955a] transition duration-300">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"
                 className="w-4 h-4 stroke-neutral-300 group-hover:stroke-[#b8955a] transition duration-300">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1"  x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1"  y1="12" x2="3"  y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
              <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}