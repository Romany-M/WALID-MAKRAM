"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLang, t } from "./LanguageContext";

export default function Navbar() {
  const [active, setActive] = useState<string>("");
  const [isDark, setIsDark] = useState(true);
  const { lang, toggleLang } = useLang();

  const links = [
    { nameKey: "gallery",      href: "#gallery",  id: "gallery"  },
    { nameKey: "murals_domes", href: "#murals",   id: "murals"   },
    { nameKey: "various_art",  href: "#various",  id: "various"  },
    { nameKey: "about",        href: "#about",    id: "about"    },
    { nameKey: "contact",      href: "#contact",  id: "contact"  },
  ];

  /* ── Init dark mode on mount ── */
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  /* ── Scroll Spy ── */
  useEffect(() => {
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
  }, []);

  /* ── Theme Toggle ── */
  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) html.classList.remove("dark");
    else html.classList.add("dark");
    setIsDark(!isDark);
  };

  return (
    <>
      {/* ── Main Navbar ── */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md
                         bg-white/90 dark:bg-[#0f0f0f]/90
                         border-b border-neutral-200/60 dark:border-neutral-800/40">
        <nav className={`flex items-center justify-center px-10 py-5 ${lang === "AR" ? "gap-8" : "gap-10"}`} dir={lang === "AR" ? "rtl" : "ltr"}>
          {links.map((link) => (
            <div key={link.nameKey} className="relative">
              <Link
                href={link.href}
                onClick={() => setActive(link.nameKey)}
                className={`transition duration-300 ${
                  lang === "AR"
                    ? "ar-nav-link"
                    : "text-[10px] tracking-[0.25em] uppercase"
                } ${
                  active === link.nameKey
                    ? "text-[#b8955a]"
                    : "text-neutral-700 dark:text-neutral-300 hover:text-amber-500 dark:hover:text-amber-400"
                }`}
              >
                {t[link.nameKey][lang]}
              </Link>
              <span
                className={`absolute left-0 -bottom-2 h-[1px] bg-[#b8955a] transition-all duration-400 ${
                  active === link.nameKey ? "w-full" : "w-0"
                }`}
              />
            </div>
          ))}
        </nav>
      </header>

      {/* ── Floating Controls: Dark Mode + Language ── */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">

        {/* Language */}
        <button
          onClick={toggleLang}
          aria-label="Toggle language"
          className="relative w-11 h-11 flex items-center justify-center rounded-full
                     bg-[#0f0f0f]/80 border border-neutral-700 backdrop-blur-md
                     hover:border-[#b8955a] transition-all duration-300 group"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"
               className="w-4 h-4 stroke-neutral-300 group-hover:stroke-[#b8955a] transition duration-300">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className="absolute -top-1 -right-1 text-[7px] tracking-wider bg-[#b8955a] text-white
                           w-4 h-4 rounded-full flex items-center justify-center font-medium">
            {lang}
          </span>
        </button>

        {/* Dark / Light */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-11 h-11 flex items-center justify-center rounded-full
                     bg-[#0f0f0f]/80 border border-neutral-700 backdrop-blur-md
                     hover:border-[#b8955a] transition-all duration-300 group"
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"
                 className="w-4 h-4 stroke-neutral-300 group-hover:stroke-[#b8955a] transition duration-300">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"
                 className="w-4 h-4 stroke-neutral-300 group-hover:stroke-[#b8955a] transition duration-300">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1"  x2="12" y2="3"  />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1"  y1="12" x2="3"  y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
              <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
            </svg>
          )}
        </button>

      </div>
    </>
  );
}