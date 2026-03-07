"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useLang, t } from "./components/LanguageContext";
import {
  ArtItem, MuralItem, GalleryConfig,
  defaultConfig, loadConfig,
} from "./lib/galleryData";

let _preloaderShown = false;

const socials = [
  { label:"Instagram", href:"https://www.instagram.com/painterwaled?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", color:"#E1306C", path:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { label:"Facebook",  href:"https://www.facebook.com/painter.waled.makram",  color:"#1877F2", path:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label:"WhatsApp",  href:"https://wa.me/201228797967",                      color:"#25D366", path:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
];

/* ══ PRELOADER ══ */
function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => { const id = setTimeout(onDone, 1800); return () => clearTimeout(id); }, [onDone]);
  return (
    <motion.div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center px-6"
      exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: "easeInOut" }}>
      <motion.div className="absolute bottom-0 left-0 h-[1px] bg-[#b8955a]"
        initial={{ width:"0%" }} animate={{ width:"100%" }} transition={{ duration:1.4, ease:"easeInOut" }} />
      <motion.p className="text-[9px] tracking-[0.55em] text-neutral-400 uppercase mb-6"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3, duration:1 }}>
        — ARTIST —
      </motion.p>
      <motion.h1 className="text-white font-light tracking-[0.12em] uppercase text-center"
        style={{ fontSize:"clamp(1.6rem,5vw,4rem)" }}
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:1.2 }}>
        WALID MAKRAM
      </motion.h1>
      <motion.h1 className="font-light tracking-[0.5em] uppercase text-center italic"
        style={{ fontSize:"clamp(1.6rem,5vw,4rem)", color:"#b8955a" }}
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8, duration:1.2 }}>
        ART GALLERY
      </motion.h1>
    </motion.div>
  );
}

/* ══ LIGHTBOX ══ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ImageLightbox({ items, index, onClose, onNav }: { items: any[]; index: number; onClose: () => void; onNav:(i:number)=>void }) {
  const { lang } = useLang();
  const item = items[index]; const total = items.length;
  const isAR = lang === "AR";
  const getF = (en: string, arKey: string) => isAR && item[arKey] ? item[arKey] : en;
  const [isDark, setIsDark] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")  onNav((index - 1 + total) % total);
      if (e.key === "ArrowRight") onNav((index + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [index, total, onClose, onNav]);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
      className={`fixed inset-0 z-[300] backdrop-blur-sm flex flex-col ${isDark ? "bg-black/97 text-white" : "bg-white/97 text-neutral-900"}`}
      onClick={onClose} dir={isAR ? "rtl" : "ltr"}>
      <div className={`flex justify-between items-center px-4 md:px-8 py-4 md:py-5 flex-shrink-0 border-b ${isDark ? "border-white/10" : "border-neutral-200"}`}>
        <span className={`text-xs tracking-[0.5em] font-light ${isDark ? "text-white/40" : "text-neutral-400"}`}>
          {String(index+1).padStart(2,"0")} &mdash; {String(total).padStart(2,"0")}
        </span>
        <button onClick={onClose}
          className={`flex items-center gap-2 md:gap-3 text-xs md:text-sm tracking-[0.4em] uppercase transition-colors duration-200 group ${isDark ? "text-white/60 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}>
          {t.close[lang]}
          <span className={`w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center text-base md:text-lg text-[#b8955a] transition-all duration-300 group-hover:border-[#b8955a] ${isDark ? "border-white/20" : "border-neutral-300"}`}>✕</span>
        </button>
      </div>
      <div className="flex-1 flex flex-col md:flex-row items-stretch overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex-1 flex items-center justify-center relative p-4 md:p-16 overflow-hidden min-h-0">
          <button className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 md:w-12 h-16 md:h-20 flex items-center justify-center text-4xl md:text-5xl transition z-10 ${isDark ? "text-white/15 hover:text-[#b8955a]" : "text-neutral-300 hover:text-[#b8955a]"}`}
            onClick={() => onNav((index-1+total)%total)}>‹</button>
          <motion.div key={index} initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5, ease:"easeOut" }} className="relative">
            <img src={item.src} alt={getF(item.title,"titleAR")}
              className="max-h-[45vh] md:max-h-[68vh] max-w-full object-contain object-top"
              style={{ filter:"drop-shadow(0 0 80px rgba(184,149,90,0.18))" }} />
            <div className="absolute -inset-4 border border-[#b8955a]/15 pointer-events-none hidden md:block" />
          </motion.div>
          <button className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 md:w-12 h-16 md:h-20 flex items-center justify-center text-4xl md:text-5xl transition z-10 ${isDark ? "text-white/15 hover:text-[#b8955a]" : "text-neutral-300 hover:text-[#b8955a]"}`}
            onClick={() => onNav((index+1)%total)}>›</button>
        </div>
        <motion.div key={`info-${index}`} initial={{ opacity:0, x: isAR ? -24 : 24 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, delay:0.1 }}
          className={`w-full md:w-[420px] lg:w-[500px] shrink-0 flex flex-col justify-center px-6 md:px-12 py-6 md:py-14 border-t md:border-t-0 md:border-l overflow-y-auto ${isDark ? "border-white/10 bg-transparent" : "border-neutral-200 bg-white"}`}>
          <p className="text-[#b8955a] text-[10px] tracking-[0.65em] uppercase mb-4 md:mb-6">— {item.year} —</p>
          <h3 className={`font-extralight leading-relaxed mb-6 md:mb-10 ${isDark ? "text-white" : "text-neutral-900"} ${isAR ? "ar-section-title text-xl md:text-2xl" : "text-2xl md:text-3xl tracking-[0.15em]"}`}>
            {getF(item.title,"titleAR")}
          </h3>
          <div className={`space-y-4 md:space-y-6 border-t pt-6 md:pt-8 ${isDark?"border-white/10":"border-neutral-200"}`}>
            <div>
              <p className={`text-[9px] tracking-[0.55em] uppercase mb-1 md:mb-2 ${isDark?"text-white/25":"text-neutral-400"}`}>{isAR?"الأسلوب":"Medium"}</p>
              <p className={`font-light leading-relaxed ${isDark?"text-neutral-300":"text-neutral-600"} ${isAR?"ar-card-text text-sm md:text-base":"text-sm italic"}`}>{getF(item.medium,"mediumAR")}</p>
            </div>
            {item.dims&&<div>
              <p className={`text-[9px] tracking-[0.55em] uppercase mb-1 md:mb-2 ${isDark?"text-white/25":"text-neutral-400"}`}>{isAR?"الأبعاد":"Dimensions"}</p>
              <p className={`text-sm tracking-widest ${isDark?"text-neutral-400":"text-neutral-500"}`}>{item.dims}</p>
            </div>}
            {item.size&&<div>
              <p className={`text-[9px] tracking-[0.55em] uppercase mb-1 md:mb-2 ${isDark?"text-white/25":"text-neutral-400"}`}>{isAR?"المساحة":"Scale"}</p>
              <p className={`text-sm tracking-widest ${isDark?"text-neutral-400":"text-neutral-500"}`}>{item.size}</p>
            </div>}
            <div>
              <p className={`text-[9px] tracking-[0.55em] uppercase mb-1 md:mb-2 ${isDark?"text-white/25":"text-neutral-400"}`}>{isAR?"الموقع":"Location"}</p>
              <p className={`leading-relaxed ${isDark?"text-neutral-400":"text-neutral-500"} ${isAR?"ar-card-text text-sm md:text-base":"text-sm tracking-wider"}`}>{getF(item.location,"locationAR")}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-8 md:mt-12">
            <button onClick={()=>onNav((index-1+total)%total)} className={`flex-1 border py-3 md:py-4 text-xs md:text-sm tracking-[0.3em] uppercase hover:border-[#b8955a] transition-all duration-300 ${isDark?"border-white/15 text-white/40 hover:text-white":"border-neutral-200 text-neutral-400 hover:text-neutral-900"}`}>{t.prev[lang]}</button>
            <button onClick={()=>onNav((index+1)%total)} className={`flex-1 border py-3 md:py-4 text-xs md:text-sm tracking-[0.3em] uppercase hover:border-[#b8955a] transition-all duration-300 ${isDark?"border-white/15 text-white/40 hover:text-white":"border-neutral-200 text-neutral-400 hover:text-neutral-900"}`}>{t.next[lang]}</button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══ ART CARD — كارت احترافي مع fade-in على الصورة، بدون hover ══ */
function ArtCard({ src, title, titleAR, medium, mediumAR, dims, year, location, locationAR, delay=0, onClick }: ArtItem & { delay?:number; onClick?:()=>void }) {
  const { lang } = useLang();
  const isAR = lang === "AR";
  return (
    <motion.div
      initial={{ opacity:0, y:50 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:"-80px" }}
      transition={{ duration:1, delay, ease:"easeOut" }}
      className="cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden"
      onClick={onClick}
    >
      {/* ── صورة مع fade-in عند الدخول للـ viewport ── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <motion.img
          src={src}
          alt={isAR ? titleAR : title}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.15, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </div>

      {/* ── بيانات الكارت — دايماً ظاهرة ── */}
      <div className="p-3 md:p-4" dir={isAR ? "rtl" : "ltr"}>
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 overflow-hidden">
            <h4 className={`font-semibold leading-snug truncate ${isAR ? "ar-card-text text-sm" : "text-[12px] md:text-[13px] tracking-[0.06em] uppercase text-neutral-900 dark:text-white"}`}>
              {isAR ? titleAR : title}
            </h4>
            <p className={`mt-1 truncate ${isAR ? "ar-card-text text-xs text-neutral-500 dark:text-neutral-400" : "text-[11px] text-neutral-500 dark:text-neutral-400 tracking-wide italic"}`}>
              {isAR ? mediumAR : medium}
            </p>
          </div>
          <div className={`flex-shrink-0 text-${isAR ? "left" : "right"}`}>
            <span className="text-[10px] md:text-[11px] tracking-widest text-[#b8955a] block">{year}</span>
            {dims && <span className="text-[10px] md:text-[11px] tracking-widest text-neutral-400 dark:text-neutral-500 block">{dims}</span>}
          </div>
        </div>
        {location && (
          <p className={`mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 truncate ${isAR ? "ar-card-text text-xs text-neutral-500 dark:text-neutral-400" : "text-[10px] tracking-wider text-neutral-400 dark:text-neutral-500 uppercase"}`}>
            {isAR ? locationAR : location}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ══ SECTION HEADER ══ */
function SectionHeader({ label, title }: { label:string; title:string }) {
  return (
    <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }} transition={{ duration:1 }} className="text-center mb-8 md:mb-14">
      <p className="text-[9px] tracking-[0.55em] text-neutral-400 uppercase mb-3 md:mb-5">{label}</p>
      <h2 className="font-light tracking-[0.3em] md:tracking-[0.5em] uppercase italic text-2xl md:text-3xl lg:text-4xl">{title}</h2>
      <div className="w-8 h-[1px] bg-[#b8955a] mx-auto mt-5 md:mt-7" />
    </motion.div>
  );
}

/* ══ GALLERY SECTION ══ */
function GallerySection({ data }: { data: GalleryConfig["galleryData"] }) {
  const { lang } = useLang();
  const isAR = lang === "AR";
  const [active, setActive] = useState<"ancient"|"coptic"|"oil">(() => {
    if (typeof window === "undefined") return "ancient";
    const saved = sessionStorage.getItem("galleryActiveTab");
    if (saved === "coptic" || saved === "oil" || saved === "ancient") { sessionStorage.removeItem("galleryActiveTab"); return saved; }
    return "ancient";
  });
  const [lb, setLb] = useState<number|null>(null);
  const items = data[active];

  const galleryTabs = [
    { key:"ancient", label:t.ancient_art[lang]   },
    { key:"coptic",  label:t.coptic_art[lang]    },
    { key:"oil",     label:t.oil_paintings[lang] },
  ];
  const exploreLabels: Record<string,string> = {
    ancient: t.explore_ancient[lang],
    coptic:  t.explore_coptic[lang],
    oil:     t.explore_oil[lang],
  };

  return (
    <>
      <AnimatePresence>
        {lb !== null && <ImageLightbox items={items} index={lb} onClose={()=>setLb(null)} onNav={setLb} />}
      </AnimatePresence>
      <section id="gallery" className="px-4 sm:px-8 md:px-28 py-12 md:py-24">
        <SectionHeader label={t.selected_works[lang]} title={t.gallery_title[lang]} />

        <div className="flex items-center justify-center mb-8 md:mb-14 px-2" dir={isAR?"rtl":"ltr"}>
          <div className="flex border border-neutral-200 dark:border-neutral-800 w-full max-w-md md:w-auto">
            {galleryTabs.map(tab=>(
              <button key={tab.key}
                onClick={()=>{ setActive(tab.key as "ancient"|"coptic"|"oil"); setLb(null); }}
                className={`relative flex-1 md:flex-none px-3 md:px-8 py-2.5 md:py-3
                  text-[8px] md:text-[10px] tracking-[0.08em] md:tracking-[0.2em]
                  uppercase transition-all duration-500 overflow-hidden whitespace-nowrap
                  border-r border-neutral-200 dark:border-neutral-800 last:border-r-0
                  font-medium
                  ${active===tab.key
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-black"
                    : "text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"}`}>
                {tab.label}
                {active===tab.key&&<motion.span layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b8955a]"/>}
              </button>
            ))}
          </div>
        </div>

        <motion.div key={active} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 items-start">
          {items.slice(0, 8).map((item,i)=><ArtCard key={i} {...item} delay={i*0.07} onClick={()=>setLb(i)}/>)}
        </motion.div>

        <div className="text-center mt-8 md:mt-14">
          <Link href={`/gallery/${active}`}
            onClick={() => { sessionStorage.setItem("galleryActiveTab", active); sessionStorage.setItem("scrollToSection", "gallery"); }}
            className="inline-flex items-center gap-3 md:gap-4 border border-neutral-300 dark:border-neutral-700
                       px-6 md:px-10 py-2.5 md:py-3 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase
                       hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black
                       hover:border-transparent transition-all duration-500 group">
            {exploreLabels[active]}
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

/* ══ CONTACT FORM ══ */
function ContactForm() {
  const { lang } = useLang();
  const isAR = lang === "AR";
  const [form, setForm]     = useState({ name:"", email:"", subject:"", message:"" });
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setStatus("sent"); setForm({ name:"", email:"", subject:"", message:"" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 3000); }
  };
  return (
    <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:1 }}
      className="w-full max-w-xl" dir={isAR ? "rtl" : "ltr"}>
      <SectionHeader label={t.commission[lang]} title={t.contact_title[lang]} />
      <div className="flex flex-col gap-0">
        {([
          { placeholder:t.name_ph[lang],  type:"text",  id:"name",    label:t.name[lang],    k:"name"    },
          { placeholder:t.email_ph[lang], type:"email", id:"email",   label:t.email[lang],   k:"email"   },
          { placeholder:t.sub_ph[lang],   type:"text",  id:"subject", label:t.subject[lang], k:"subject" },
        ] as const).map(f => (
          <div key={f.id} className="relative group">
            <label htmlFor={f.id} className="block text-[11px] tracking-[0.4em] uppercase text-neutral-600 dark:text-neutral-300 pt-5 pb-1 font-medium">{f.label}</label>
            <input id={f.id} type={f.type} placeholder={f.placeholder} value={form[f.k]} onChange={set(f.k)}
              className="w-full bg-transparent border-b-2 border-neutral-400 dark:border-neutral-600 pb-3 text-base tracking-[0.1em] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none transition-all duration-300"/>
            <span className={`absolute bottom-0 ${isAR?"right-0":"left-0"} w-0 h-[2px] bg-[#b8955a] group-focus-within:w-full transition-all duration-500`}/>
          </div>
        ))}
        <div className="relative group">
          <label htmlFor="message" className="block text-[11px] tracking-[0.4em] uppercase text-neutral-600 dark:text-neutral-300 pt-6 pb-1 font-medium">{t.message[lang]}</label>
          <textarea id="message" placeholder={t.msg_ph[lang]} value={form.message} onChange={set("message")}
            className="w-full bg-transparent border-b-2 border-neutral-400 dark:border-neutral-600 pb-3 text-base tracking-[0.1em] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none resize-none h-32 transition-all duration-300"/>
          <span className={`absolute bottom-0 ${isAR?"right-0":"left-0"} w-0 h-[2px] bg-[#b8955a] group-focus-within:w-full transition-all duration-500`}/>
        </div>
        <button onClick={handleSend} disabled={status === "sending"}
          className={`mt-10 md:mt-14 group flex items-center justify-between w-full border-2 px-6 md:px-8 py-3.5 md:py-4 text-[11px] tracking-[0.4em] uppercase font-medium transition-all duration-500 disabled:opacity-60
            ${status==="sent"?"border-green-500 bg-green-500 text-white":status==="error"?"border-red-500 text-red-500":"border-neutral-500 dark:border-neutral-400 text-neutral-800 dark:text-neutral-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent"}`}>
          {status==="sending"?(isAR?"جاري الإرسال...":"Sending..."):status==="sent"?(isAR?"تم الإرسال ✓":"Sent ✓"):status==="error"?(isAR?"حدث خطأ، حاول مجدداً":"Error, try again"):t.send[lang]}
          {status==="idle"&&<span className="group-hover:translate-x-2 transition-transform duration-300">{isAR?"←":"→"}</span>}
        </button>
        <div className="flex justify-center flex-wrap gap-6 md:gap-10 mt-10 md:mt-14">
          {socials.map(s=>(
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="text-neutral-600 dark:text-neutral-300 hover:text-[#b8955a] dark:hover:text-[#b8955a] transition duration-300 flex items-center gap-2 text-[11px] tracking-[0.35em] uppercase font-medium">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d={s.path}/></svg>{s.label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════
   PAGE
════════════════════════════════ */
export default function Home() {
  const { lang } = useLang();
  const isAR = lang === "AR";
  const [muralLb,   setMuralLb]   = useState<number|null>(null);
  const [variousLb, setVariousLb] = useState<number|null>(null);
  const [cfg, setCfg] = useState<GalleryConfig>(defaultConfig);
  const [loading, setLoading] = useState(!_preloaderShown);

  const artistImgRef = useRef(null);
  const artistInView = useInView(artistImgRef, { once: true, margin: "-80px" });

  useEffect(() => { if (loading && localStorage.getItem("preloaderShown")) { _preloaderShown = true; setLoading(false); } }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const targetId = sessionStorage.getItem("scrollToSection");
    if (targetId) {
      sessionStorage.removeItem("scrollToSection");
      const tryScroll = (attempts = 0) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lenis = (window as any).__lenis;
        const el = document.getElementById(targetId);
        if (lenis && el) lenis.scrollTo(el, { offset: -80, duration: 1.2 });
        else if (attempts < 20) setTimeout(() => tryScroll(attempts + 1), 100);
      };
      setTimeout(() => tryScroll(), 300);
    } else { window.scrollTo(0, 0); }
  }, []);

  useEffect(() => { const load = async () => { const data = await loadConfig(); setCfg(data); }; load(); }, []);

  const handlePreloaderDone = () => { _preloaderShown = true; setLoading(false); localStorage.setItem("preloaderShown", "true"); };

  return (
    <>
      <AnimatePresence>{loading && <Preloader onDone={handlePreloaderDone} />}</AnimatePresence>
      <AnimatePresence>{muralLb!==null&&<ImageLightbox items={cfg.murals} index={muralLb} onClose={()=>setMuralLb(null)} onNav={setMuralLb}/>}</AnimatePresence>
      <AnimatePresence>{variousLb!==null&&<ImageLightbox items={cfg.variousWorks} index={variousLb} onClose={()=>setVariousLb(null)} onNav={setVariousLb}/>}</AnimatePresence>

      <main className="bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
          <motion.div className="absolute inset-0"
            initial={{ opacity:0, scale:1.05 }} animate={{ opacity:loading?0:1, scale:loading?1.05:1 }}
            transition={{ duration:2, delay:0.2, ease:"easeOut" }}>
            <img src={cfg.heroSrc} alt="Hero" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/45"/>
          </motion.div>
          <motion.div className="relative z-10" initial={{ opacity:0 }} animate={{ opacity:loading?0:1 }} transition={{ duration:1.4, delay:0.5 }}>
            {isAR ? (
              <div className="mb-4 flex flex-col items-center gap-3">
                <h1 className="ar-hero-title text-center">وليد&ensp;مكرم</h1>
                <div className="flex items-center gap-4 w-full justify-center">
                  <span className="h-[1px] w-12 md:w-16 bg-gradient-to-r from-transparent to-[#b8955a]"/>
                  <span className="text-[#b8955a] text-[10px] tracking-[0.5em]">✦</span>
                  <span className="h-[1px] w-12 md:w-16 bg-gradient-to-l from-transparent to-[#b8955a]"/>
                </div>
              </div>
            ) : (
              <h1 className="font-light uppercase mb-2 text-white tracking-[0.12em] text-3xl md:text-6xl">{t.hero_name[lang]}</h1>
            )}
            <p className={`text-sm md:text-base tracking-[0.4em] text-neutral-300 uppercase ${isAR?"ar-label":""}`}>{t.hero_sub[lang]}</p>
            <div className="w-8 h-[1px] bg-[#b8955a] mx-auto mt-4"/>
          </motion.div>
        </section>

        {/* ── GALLERY ── */}
        <GallerySection data={cfg.galleryData}/>

        {/* ── MURALS ── */}
        <section id="murals" className="bg-neutral-100 dark:bg-[#0a0a0a] py-12 md:py-20 overflow-hidden">
          <div className="text-center mb-10 md:mb-16 select-none px-4 md:px-6">
            <motion.h2 initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:1 }} viewport={{ once:true }} className="relative inline-block">
              <span className="block text-4xl sm:text-5xl md:text-8xl font-black tracking-[0.2em] md:tracking-[0.3em] uppercase mb-[-16px] sm:mb-[-20px] md:mb-[-40px] murals-outline-text">
                {isAR?"الجداريات":"Murals"}
              </span>
              <span className="block text-3xl sm:text-4xl md:text-6xl font-extralight tracking-[0.3em] md:tracking-[0.5em] uppercase text-[#b8955a]"
                style={{ textShadow:"0 0 15px rgba(184,149,90,0.3)" }}>
                {isAR?"والقباب":"& Domes"}
              </span>
            </motion.h2>
            <motion.div initial={{ width:0 }} whileInView={{ width:"100px" }} transition={{ duration:1, delay:0.4 }} viewport={{ once:true }}
              className="h-[1px] mx-auto mt-8 md:mt-10"
              style={{ background:"linear-gradient(to right, transparent, #b8955a, transparent)" }}/>
          </div>
          <div className="overflow-hidden">
            <div className="flex gap-6 md:gap-14 animate-scroll w-max hover:[animation-play-state:paused]" style={{ animationDuration:"70s" }}>
              {[...cfg.murals, ...cfg.murals].map((m,i)=>(
                <div key={i} className="relative group flex-shrink-0 cursor-pointer w-[80vw] sm:w-[420px] md:w-[640px]"
                  onClick={()=>setMuralLb(i%cfg.murals.length)}>
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute inset-0 border border-[#b8955a]/60" />
                    <div className="absolute inset-[6px] md:inset-[10px] border border-[#b8955a]/35" />
                    <div className="absolute top-[4px] left-[4px] w-4 md:w-6 h-4 md:h-6 border-t-2 border-l-2 border-[#b8955a]" />
                    <div className="absolute top-[4px] right-[4px] w-4 md:w-6 h-4 md:w-6 border-t-2 border-r-2 border-[#b8955a]" />
                    <div className="absolute bottom-[4px] left-[4px] w-4 md:w-6 h-4 md:h-6 border-b-2 border-l-2 border-[#b8955a]" />
                    <div className="absolute bottom-[4px] right-[4px] w-4 md:w-6 h-4 md:h-6 border-b-2 border-r-2 border-[#b8955a]" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ boxShadow:"inset 0 0 30px rgba(184,149,90,0.15), 0 0 25px rgba(184,149,90,0.2)" }} />
                  </div>
                  <div className="overflow-hidden">
                    <img src={m.src} className="w-full h-[50vw] sm:h-[300px] md:h-[460px] object-cover object-top brightness-50 group-hover:brightness-90 group-hover:scale-105 transition-all duration-700 ease-out"/>
                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/90 via-black/30 to-transparent" dir={isAR?"rtl":"ltr"}>
                      <p className="text-white text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium drop-shadow mb-1">{isAR?m.titleAR:m.title}</p>
                      <p className="text-[#f0cc8a] text-[8px] md:text-[9px] tracking-[0.3em] uppercase mb-3 md:mb-4 drop-shadow">{isAR?m.locationAR:m.location}</p>
                      <div className="flex flex-wrap gap-2 md:gap-3 text-[8px] md:text-[9px] tracking-[0.25em] text-neutral-300 uppercase">
                        <span>{isAR?m.mediumAR:m.medium}</span><span className="text-neutral-600">·</span><span>{m.size}</span><span className="text-neutral-600">·</span><span>{m.year}</span>
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 md:w-14 h-12 md:h-14 rounded-full border border-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 backdrop-blur-sm bg-black/20">
                      <svg viewBox="0 0 24 24" className="w-4 md:w-5 h-4 md:h-5 stroke-white fill-none" strokeWidth="1.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8 md:mt-14 px-4">
            <Link href="/gallery/murals" onClick={() => sessionStorage.setItem("scrollToSection", "murals")}
              className="group inline-flex items-center gap-3 md:gap-4 border border-neutral-400 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 px-8 md:px-12 py-3 md:py-4 tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm uppercase hover:bg-[#b8955a] hover:border-[#b8955a] hover:text-white transition duration-500">
              {t.explore_murals[lang]}
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </section>

        {/* ── VARIOUS ── */}
        <section id="various" className="px-4 sm:px-8 md:px-28 pt-8 pb-12 md:pt-12 md:pb-20 bg-neutral-100 dark:bg-neutral-950">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#b8955a]/40 to-transparent mb-8 md:mb-12"/>
          <SectionHeader label="" title={t.various_title[lang]}/>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 items-start">
            {cfg.variousWorks.slice(0, 8).map((item,i)=><ArtCard key={i} {...item} delay={i*0.07} onClick={()=>setVariousLb(i)}/>)}
          </div>
          <div className="text-center mt-8 md:mt-14">
            <Link href="/gallery/various" onClick={() => sessionStorage.setItem("scrollToSection", "various")}
              className="inline-flex items-center gap-3 md:gap-4 border border-neutral-300 dark:border-neutral-700 px-6 md:px-10 py-2.5 md:py-3 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent transition-all duration-500 group">
              {t.explore_various[lang]}
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="py-16 md:py-32 px-4 sm:px-8 md:px-32 bg-[#f9f9f9] dark:bg-[#080808] overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-center" dir={isAR?"rtl":"ltr"}>
            <motion.div className="lg:col-span-5 relative" initial={{ opacity:0, x:isAR?50:-50 }} whileInView={{ opacity:1, x:0 }} transition={{ duration:1.5 }} viewport={{ once:true }}>
              <div className="absolute -inset-6 border border-[#b8955a]/30 translate-x-12 translate-y-12 hidden md:block"/>
              <div className="relative overflow-hidden aspect-[3/4] shadow-2xl max-w-sm mx-auto lg:max-w-none">
                <motion.img ref={artistImgRef} src="/icons/artist.png" alt="Walid Makram"
                  className="w-full h-full object-cover object-top transition-all duration-[2500ms] ease-in-out"
                  style={{ filter: artistInView ? "grayscale(0%)" : "grayscale(100%)" }}
                  whileHover={{ scale: 1.05 }} />
              </div>
              <p className="mt-6 md:mt-8 text-[10px] tracking-[0.5em] uppercase text-neutral-400 text-center">{t.artist_caption[lang]}</p>
            </motion.div>
            <div className="lg:col-span-7 space-y-8 md:space-y-14">
              <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:1, delay:0.3 }} viewport={{ once:true }}>
                <span className={`text-[#b8955a] uppercase block mb-3 md:mb-4 ${isAR?"ar-label":"text-[11px] tracking-[0.6em]"}`}>{t.philosophy[lang]}</span>
                <h2 className={`font-extralight leading-tight ${isAR?"ar-section-title":"text-3xl md:text-4xl lg:text-5xl tracking-[0.2em]"}`}>
                  {t.beyond[lang]} <br/> {t.visible[lang]}
                </h2>
              </motion.div>
              <motion.div className="space-y-6 md:space-y-8 text-neutral-600 dark:text-neutral-400 font-light leading-[2.2] text-base md:text-lg max-w-xl"
                initial={{ opacity:0 }} whileInView={{ opacity:1 }} transition={{ duration:1, delay:0.6 }} viewport={{ once:true }}>
                <p className={isAR?"ar-description":""}>{t.about_p1[lang]}</p>
                <p className={`${isAR?"border-r-2 pr-6 md:pr-8 ar-quote":"border-l-2 pl-6 md:pl-8"} border-[#b8955a] py-2 italic`}>{t.about_quote[lang]}</p>
                <p className={isAR?"ar-description":""}>{t.about_p2[lang]}</p>
              </motion.div>
              <motion.div className="flex flex-wrap gap-3 md:gap-6 pt-2 md:pt-4"
                initial={{ opacity:0 }} whileInView={{ opacity:1 }} transition={{ duration:1, delay:0.9 }} viewport={{ once:true }}>
                {socials.map(s=>(
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-3 border border-neutral-300 dark:border-neutral-700 text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium text-neutral-700 dark:text-neutral-300 transition-all duration-400 group"
                    onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor=s.color;el.style.color=s.color;}}
                    onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor="";el.style.color="";}}>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current flex-shrink-0"><path d={s.path}/></svg>
                    {s.label}<span className="opacity-40 group-hover:opacity-100 transition-opacity">→</span>
                  </a>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="bg-neutral-100 dark:bg-neutral-950 py-12 md:py-24 px-4 md:px-6 flex items-center justify-center">
          <ContactForm />
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-neutral-200 dark:bg-black border-t border-neutral-300 dark:border-neutral-800 py-8 px-6 md:px-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center" dir={isAR?"rtl":"ltr"}>
            <p className="text-[11px] tracking-[0.5em] uppercase text-neutral-600 dark:text-neutral-400 pb-5">
              {isAR ? "وليد مكرم © 2026" : "WALID MAKRAM © 2026"}
            </p>
            <div className="w-full h-[1px] bg-neutral-300 dark:bg-neutral-800"/>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 pt-5">
              {socials.map(s=>(
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-neutral-500 dark:text-neutral-600 hover:text-[#b8955a] dark:hover:text-[#b8955a] transition duration-300 text-[10px] tracking-[0.35em] uppercase">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}