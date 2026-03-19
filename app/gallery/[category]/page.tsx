"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadConfig, ArtItem, MuralItem } from "../../lib/galleryData";
import { useLang } from "../../components/LanguageContext";
import WatermarkedImage from "../../components/WatermarkedImage";
import FullscreenLightbox from "../../components/FullscreenLightbox";

type Item = ArtItem | MuralItem;

function getCategoryStr(raw: string | string[] | undefined): string {
  if (Array.isArray(raw)) return raw[0] ?? "";
  return raw ?? "";
}

// ✅ UPDATED CATEGORY META
const categoryMeta: Record<string, { labelEN: string; labelAR: string }> = {
  icons:       { labelEN: "Icons",                     labelAR: "أيقونات" },
  gilding:     { labelEN: "Gilding & Engraving",       labelAR: "تذهيب ونقش" },
  mosaic:      { labelEN: "Mosaic",                    labelAR: "فسيفساء" },
  exhibitions: { labelEN: "Exhibitions",               labelAR: "معارض" },
  murals:      { labelEN: "Murals & Domes",            labelAR: "الجداريات والقباب" },
};

// ✅ UPDATED SECTION IDS
const sectionId: Record<string, string> = {
  icons:       "gallery",
  gilding:     "gallery",
  mosaic:      "gallery",
  exhibitions: "exhibitions",
  murals:      "murals",
};

function getField(item: Item, enVal: string, arKey: string, isAR: boolean): string {
  if (!isAR) return enVal;
  const rec = item as unknown as Record<string, string>;
  return rec[arKey] || enVal;
}

const PAGE_SIZE = 8;

export default function GalleryDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const category = getCategoryStr(params.category);

  const { lang } = useLang();
  const isAR = lang === "AR";

  const meta      = categoryMeta[category] ?? { labelEN: category, labelAR: category };
  const metaLabel = isAR ? meta.labelAR : meta.labelEN;

  const [items, setItems] = useState<Item[]>([]);
  const [lb,    setLb]    = useState<number | null>(null);
  const [page,  setPage]  = useState(0);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pageItems  = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
  const load = async () => {
    const cfg = await loadConfig();

    const map: Record<string, Item[]> = {
      icons:       cfg.galleryData.icons,
      gilding:     cfg.galleryData.gilding,
      mosaic:      cfg.galleryData.mosaic,
      exhibitions: cfg.exhibitions,
      murals:      cfg.murals,
    };

    setItems(map[category] ?? []);
  };

  load();
}, [category]);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const handleBack = () => {
    const id = sectionId[category];
    if (id) sessionStorage.setItem("scrollToSection", id);
    router.push("/");
  };

  const goToPage = (idx: number) => {
    setPage(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-neutral-50 text-neutral-900"}`}>

      <AnimatePresence>
        {lb !== null && (
          <FullscreenLightbox items={items} index={lb} onClose={() => setLb(null)} onNav={setLb} />
        )}
      </AnimatePresence>

      <div className="pt-32 pb-24 px-10 md:px-28">
        <div className="flex items-center justify-between mb-16">
          <button onClick={handleBack}
            className="flex items-center gap-2 text-neutral-400 hover:text-[#b8955a] text-sm tracking-widest uppercase transition">
            {isAR ? "→ العودة" : "← Back"}
          </button>
          <div className="text-center">
            <p className="text-[9px] tracking-[0.55em] text-neutral-400 uppercase mb-3">— {isAR ? "المعرض" : "Gallery"} —</p>
            <h1 className="font-light tracking-[0.4em] uppercase italic text-3xl md:text-4xl">{metaLabel}</h1>
            <div className="w-8 h-[1px] bg-[#b8955a] mx-auto mt-6" />
          </div>
          <span className="text-neutral-500 text-sm">{items.length} {isAR ? "عمل" : "works"}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
          {pageItems.map((item, i) => (
            <motion.div key={`${page}-${i}`}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.06 }}
              className="cursor-pointer"
              onClick={() => setLb(page * PAGE_SIZE + i)}>
              <div className="overflow-hidden bg-neutral-100 dark:bg-neutral-900 relative aspect-[4/5]">
                <WatermarkedImage
                  src={item.src}
                  alt={getField(item, item.title, "titleAR", isAR)}
                  className="absolute inset-0 w-full h-full"
                  objectPosition="top"
                  hoverScale={1.07}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#b8955a]/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition pointer-events-none">
                  <div className="w-11 h-11 rounded-full border border-white/60 flex items-center justify-center backdrop-blur-sm bg-black/20">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white fill-none" strokeWidth="1.6">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p className={`truncate font-medium mb-1 ${isAR ? "ar-card-text text-sm text-neutral-800 dark:text-white" : "text-[11px] tracking-[0.08em] uppercase text-neutral-800 dark:text-white"}`}>
                  {getField(item, item.title, "titleAR", isAR)}
                </p>
                <span className="text-[10px] tracking-widest text-[#b8955a]">{item.year}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-16">
            <button onClick={() => goToPage(page - 1)} disabled={page === 0}
              className={`px-5 py-2.5 border text-xs tracking-[0.3em] uppercase transition-all duration-300 disabled:opacity-30
                ${isDark ? "border-neutral-700 text-neutral-400 hover:border-[#b8955a] hover:text-white" : "border-neutral-300 text-neutral-500 hover:border-[#b8955a] hover:text-neutral-900"}`}>
              {isAR ? "التالي ←" : "← Prev"}
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button key={idx} onClick={() => goToPage(idx)}
                className={`w-9 h-9 text-xs tracking-widest border transition-all duration-300
                  ${page === idx
                    ? "bg-[#b8955a] border-[#b8955a] text-white"
                    : isDark ? "border-neutral-700 text-neutral-400 hover:border-[#b8955a] hover:text-white" : "border-neutral-300 text-neutral-500 hover:border-[#b8955a] hover:text-neutral-900"}`}>
                {idx + 1}
              </button>
            ))}
            <button onClick={() => goToPage(page + 1)} disabled={page === totalPages - 1}
              className={`px-5 py-2.5 border text-xs tracking-[0.3em] uppercase transition-all duration-300 disabled:opacity-30
                ${isDark ? "border-neutral-700 text-neutral-400 hover:border-[#b8955a] hover:text-white" : "border-neutral-300 text-neutral-500 hover:border-[#b8955a] hover:text-neutral-900"}`}>
              {isAR ? "→ السابق" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}