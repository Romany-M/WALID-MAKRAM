"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadConfig, ArtItem, MuralItem } from "../../lib/galleryData";
import { useLang } from "../../components/LanguageContext";
import WatermarkedImage from "../../components/WatermarkedImage";
import { useAntiDevTools } from "../../hooks/useAntiDevTools";

type Item = ArtItem | MuralItem;

function getCategoryStr(raw: string | string[] | undefined): string {
  if (Array.isArray(raw)) return raw[0] ?? "";
  return raw ?? "";
}

const categoryMeta: Record<string, { labelEN: string; labelAR: string }> = {
  ancient: { labelEN: "Ancient Art",    labelAR: "الفن القديم"       },
  coptic:  { labelEN: "Coptic Art",     labelAR: "الفن القبطي"       },
  oil:     { labelEN: "Oil Paintings",  labelAR: "اللوحات الزيتية"  },
  various: { labelEN: "Various Works",  labelAR: "أعمال متنوعة"      },
  murals:  { labelEN: "Murals & Domes", labelAR: "الجداريات والقباب" },
};

const sectionId: Record<string, string> = {
  ancient: "gallery",
  coptic:  "gallery",
  oil:     "gallery",
  various: "various",
  murals:  "murals",
};

function getField(item: Item, enVal: string, arKey: string, isAR: boolean): string {
  if (!isAR) return enVal;
  const rec = item as unknown as Record<string, string>;
  return rec[arKey] || enVal;
}

const PAGE_SIZE = 8;

export default function GalleryDetailPage() {
  // ✅ useAntiDevTools هنا جوه الـ component
  useAntiDevTools();

  const params   = useParams();
  const router   = useRouter();
  const category = getCategoryStr(params.category);

  const { lang } = useLang();
  const isAR = lang === "AR";

  const meta      = categoryMeta[category] ?? { labelEN: category, labelAR: category };
  const metaLabel = isAR ? meta.labelAR : meta.labelEN;

  const [items,  setItems] = useState<Item[]>([]);
  const [lb,     setLb]    = useState<number | null>(null);
  const [page,   setPage]  = useState(0);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pageItems  = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    const load = async () => {
      const cfg = await loadConfig();
      const map: Record<string, Item[]> = {
        ancient: cfg.galleryData.ancient,
        coptic:  cfg.galleryData.coptic,
        oil:     cfg.galleryData.oil,
        various: cfg.variousWorks,
        murals:  cfg.murals,
      };
      setItems(map[category] ?? []);
    };
    load();
  }, [category]);

  useEffect(() => {
    if (lb === null) return;
    const total = items.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     setLb(null);
      if (e.key === "ArrowLeft")  setLb(i => i !== null ? (i - 1 + total) % total : null);
      if (e.key === "ArrowRight") setLb(i => i !== null ? (i + 1) % total : null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lb, items.length]);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const currentItem = lb !== null ? items[lb] : null;

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

      {/* ══ LIGHTBOX ══ */}
      <AnimatePresence>
        {lb !== null && currentItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-[300] backdrop-blur-sm flex flex-col ${isDark ? "bg-black/97" : "bg-white/97"}`}
            onClick={() => setLb(null)}
            dir={isAR ? "rtl" : "ltr"}
          >
            <div className={`flex justify-between items-center px-8 py-5 border-b flex-shrink-0 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
              <span className={`text-xs tracking-[0.5em] font-light ${isDark ? "text-white/40" : "text-neutral-400"}`}>
                {String(lb + 1).padStart(2, "0")} — {String(items.length).padStart(2, "0")}
              </span>
              <button onClick={() => setLb(null)}
                className={`flex items-center gap-3 text-sm tracking-[0.4em] uppercase transition group ${isDark ? "text-white/60 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}>
                {isAR ? "إغلاق" : "Close"}
                <span className={`w-9 h-9 rounded-full border flex items-center justify-center text-lg text-[#b8955a] transition group-hover:border-[#b8955a] ${isDark ? "border-white/20" : "border-neutral-300"}`}>✕</span>
              </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-stretch overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* ✅ ارتفاع ثابت على الموبايل */}
              <div className="h-[42vh] shrink-0 md:h-auto md:flex-1 flex items-center justify-center relative p-8 md:p-16">
                <button
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-20 flex items-center justify-center text-5xl transition ${isDark ? "text-white/15 hover:text-[#b8955a]" : "text-neutral-300 hover:text-[#b8955a]"}`}
                  onClick={() => setLb((lb - 1 + items.length) % items.length)}>‹
                </button>

                <motion.div key={lb} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                  className="relative inline-flex">
                  <WatermarkedImage
                    src={currentItem.src}
                    alt={getField(currentItem, currentItem.title, "titleAR", isAR)}
                    objectPosition="top"
                    naturalSize
                  />
                  <div className="absolute -inset-4 border border-[#b8955a]/15 pointer-events-none" />
                </motion.div>

                <button
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-20 flex items-center justify-center text-5xl transition ${isDark ? "text-white/15 hover:text-[#b8955a]" : "text-neutral-300 hover:text-[#b8955a]"}`}
                  onClick={() => setLb((lb + 1) % items.length)}>›
                </button>
              </div>

              <motion.div key={`i-${lb}`}
                initial={{ opacity: 0, x: isAR ? -24 : 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className={`w-full md:w-[500px] shrink-0 flex flex-col justify-start md:justify-center px-12 py-8 md:py-14 border-t md:border-t-0 md:border-l overflow-y-auto flex-1 md:flex-none ${isDark ? "border-white/10 bg-transparent" : "border-neutral-200 bg-white"}`}>
                <p className="text-[#b8955a] text-[10px] tracking-[0.65em] uppercase mb-6">— {currentItem.year} —</p>
                <h3 className={`font-extralight leading-relaxed mb-10 text-3xl tracking-[0.15em] ${isDark ? "text-white" : "text-neutral-900"}`}>
                  {getField(currentItem, currentItem.title, "titleAR", isAR)}
                </h3>
                <div className={`space-y-6 border-t pt-8 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <div>
                    <p className={`text-[9px] tracking-[0.55em] uppercase mb-2 ${isDark ? "text-white/25" : "text-neutral-400"}`}>{isAR ? "الأسلوب" : "Medium"}</p>
                    <p className={`text-sm italic font-light ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>{getField(currentItem, currentItem.medium, "mediumAR", isAR)}</p>
                  </div>
                  {"dims" in currentItem && (
                    <div>
                      <p className={`text-[9px] tracking-[0.55em] uppercase mb-2 ${isDark ? "text-white/25" : "text-neutral-400"}`}>{isAR ? "الأبعاد" : "Dimensions"}</p>
                      <p className={`text-sm tracking-widest ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>{(currentItem as ArtItem).dims}</p>
                    </div>
                  )}
                  {"size" in currentItem && (
                    <div>
                      <p className={`text-[9px] tracking-[0.55em] uppercase mb-2 ${isDark ? "text-white/25" : "text-neutral-400"}`}>{isAR ? "المساحة" : "Scale"}</p>
                      <p className={`text-sm tracking-widest ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>{(currentItem as MuralItem).size}</p>
                    </div>
                  )}
                  <div>
                    <p className={`text-[9px] tracking-[0.55em] uppercase mb-2 ${isDark ? "text-white/25" : "text-neutral-400"}`}>{isAR ? "الموقع" : "Location"}</p>
                    <p className={`text-sm tracking-wider leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>{getField(currentItem, currentItem.location, "locationAR", isAR)}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-12">
                  <button onClick={() => setLb((lb - 1 + items.length) % items.length)}
                    className={`flex-1 border py-4 text-sm tracking-[0.3em] uppercase transition hover:border-[#b8955a] ${isDark ? "border-white/15 text-white/40 hover:text-white" : "border-neutral-200 text-neutral-400 hover:text-neutral-900"}`}>
                    {isAR ? "← السابق" : "← Prev"}
                  </button>
                  <button onClick={() => setLb((lb + 1) % items.length)}
                    className={`flex-1 border py-4 text-sm tracking-[0.3em] uppercase transition hover:border-[#b8955a] ${isDark ? "border-white/15 text-white/40 hover:text-white" : "border-neutral-200 text-neutral-400 hover:text-neutral-900"}`}>
                    {isAR ? "التالي →" : "Next →"}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ GRID ══ */}
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

        {/* ── Grid 8 صور في الصفحة ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
          {pageItems.map((item, i) => (
            <motion.div key={`${page}-${i}`}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.06 }}
              className="group cursor-pointer"
              onClick={() => setLb(page * PAGE_SIZE + i)}>

              {/* ── صورة بـ WatermarkedImage ── */}
              <div className="overflow-hidden bg-neutral-100 dark:bg-neutral-900 relative aspect-[4/5]">
                <WatermarkedImage
                  src={item.src}
                  alt={getField(item, item.title, "titleAR", isAR)}
                  className="absolute inset-0 w-full h-full"
                  objectPosition="top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#b8955a]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                {/* أيقونة التكبير */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  <div className="w-11 h-11 rounded-full border border-white/60 flex items-center justify-center backdrop-blur-sm bg-black/20">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white fill-none" strokeWidth="1.6">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>
                {/* hover: الاسم فوق الصورة */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none" dir={isAR ? "rtl" : "ltr"}>
                  <p className={`text-white font-medium ${isAR ? "ar-card-text text-sm" : "text-[10px] tracking-[0.35em] uppercase"}`}>
                    {getField(item, item.title, "titleAR", isAR)}
                  </p>
                  <p className="text-[#f0cc8a] text-[9px] mt-1">
                    {getField(item, item.location, "locationAR", isAR)}
                  </p>
                </div>
              </div>

              {/* بيانات تحت الصورة */}
              <div className={`mt-4 pb-3 border-b flex justify-between items-baseline gap-3 ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
                <p className="text-[9px] text-neutral-500 italic">
                  {getField(item, item.medium, "mediumAR", isAR)}
                </p>
                <div className="text-right flex-shrink-0">
                  {"dims" in item && <span className="text-[9px] tracking-widest text-neutral-400 block">{(item as ArtItem).dims}</span>}
                  {"size" in item && <span className="text-[9px] tracking-widest text-neutral-400 block">{(item as MuralItem).size}</span>}
                  <span className="text-[9px] tracking-widest text-neutral-400 block">{item.year}</span>
                </div>
              </div>
              <p className={`mt-2 truncate ${isAR ? "ar-card-text text-xs text-neutral-500 dark:text-neutral-400" : "text-[9px] tracking-wider text-neutral-400 dark:text-neutral-500 uppercase"}`}>
                {getField(item, item.location, "locationAR", isAR)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Pagination ── */}
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