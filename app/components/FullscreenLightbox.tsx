"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LanguageContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = Record<string, any>;

interface Props {
  items: Item[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}

function InfoContent({ item, isAR }: { item: Item; isAR: boolean }) {
  const get = (en: string, arKey: string) => isAR && item[arKey] ? item[arKey] : en;
  return (
    <>
      <p className="text-[#b8955a] text-[10px] tracking-[0.65em] uppercase mb-5">— {item.year} —</p>
      <h3 className={`font-extralight leading-relaxed mb-8 text-white
        ${isAR ? "ar-section-title text-xl" : "text-2xl md:text-3xl tracking-[0.15em]"}`}>
        {get(item.title, "titleAR")}
      </h3>
      <div className="space-y-5 border-t border-white/10 pt-6">
        {item.medium && (
          <div>
            <p className="text-[9px] tracking-[0.55em] uppercase mb-2 text-white/25">{isAR ? "الأسلوب" : "Medium"}</p>
            <p className={`text-sm font-light text-neutral-300 ${isAR ? "ar-card-text" : "italic"}`}>
              {get(item.medium, "mediumAR")}
            </p>
          </div>
        )}
        {item.dims && (
          <div>
            <p className="text-[9px] tracking-[0.55em] uppercase mb-2 text-white/25">{isAR ? "الأبعاد" : "Dimensions"}</p>
            <p className="text-sm tracking-widest text-neutral-400">{item.dims}</p>
          </div>
        )}
        {item.size && (
          <div>
            <p className="text-[9px] tracking-[0.55em] uppercase mb-2 text-white/25">{isAR ? "المساحة" : "Scale"}</p>
            <p className="text-sm tracking-widest text-neutral-400">{item.size}</p>
          </div>
        )}
        {item.location && (
          <div>
            <p className="text-[9px] tracking-[0.55em] uppercase mb-2 text-white/25">{isAR ? "الموقع" : "Location"}</p>
            <p className={`text-sm leading-relaxed text-neutral-400 ${isAR ? "ar-card-text" : "tracking-wider"}`}>
              {get(item.location, "locationAR")}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function FullscreenLightbox({ items, index, onClose, onNav }: Props) {
  const { lang } = useLang();
  const isAR = lang === "AR";
  const item  = items[index];
  const total = items.length;

  const [showInfo,   setShowInfo]   = useState(false);
  const [scale,      setScale]      = useState(1);
  const [zoomPct,    setZoomPct]    = useState(1); // فقط للـ indicator عشان ما نعملش re-render بسببه

  // ── refs للحالة الداخلية (بدون re-render) ──
  const containerRef    = useRef<HTMLDivElement>(null);
  const imgWrapperRef   = useRef<HTMLDivElement>(null);  // ← DOM direct update
  const rafRef          = useRef<number | null>(null);
  const isDragging      = useRef(false);
  const dragStart       = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const lastTap         = useRef(0);
  const currentScale    = useRef(1);
  const currentOffset   = useRef({ x: 0, y: 0 });
  const lastPinchDist   = useRef<number | null>(null);
  const isPinching      = useRef(false);

  // ── apply transform مباشرة على DOM (أسرع من setState) ──
  const applyTransform = useCallback((s: number, ox: number, oy: number, animate = false) => {
    const el = imgWrapperRef.current;
    if (!el) return;
    el.style.transition = animate ? "transform 0.25s ease" : "none";
    el.style.transform  = `scale(${s}) translate(${ox / s}px, ${oy / s}px)`;
  }, []);

  const clamp = useCallback((s: number, ox: number, oy: number) => {
    const el = containerRef.current;
    if (!el) return { x: ox, y: oy };
    const { width: w, height: h } = el.getBoundingClientRect();
    const maxX = Math.max(0, (w * s - w) / 2);
    const maxY = Math.max(0, (h * s - h) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, ox)),
      y: Math.min(maxY, Math.max(-maxY, oy)),
    };
  }, []);

  const applyScale = useCallback((next: number) => {
    const s = Math.min(5, Math.max(1, next));
    const o = s === 1 ? { x: 0, y: 0 } : clamp(s, currentOffset.current.x, currentOffset.current.y);
    currentScale.current  = s;
    currentOffset.current = o;
    applyTransform(s, o.x, o.y, true);
    setScale(s);
    setZoomPct(s);
  }, [clamp, applyTransform]);

  // reset لما الصورة تتغير — مع الاحتفاظ بحالة showInfo
  useEffect(() => {
    currentScale.current  = 1;
    currentOffset.current = { x: 0, y: 0 };
    setScale(1);
    setZoomPct(1);
    applyTransform(1, 0, 0, true);
  }, [index, applyTransform]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onNav((index - 1 + total) % total);
      if (e.key === "ArrowRight") onNav((index + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [index, total, onClose, onNav]);

  // ── Wheel ──
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    applyScale(currentScale.current - e.deltaY * 0.003);
  }, [applyScale]);

  // ── Mouse drag ──
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (currentScale.current <= 1) return;
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, ox: currentOffset.current.x, oy: currentOffset.current.y };
    if (imgWrapperRef.current) imgWrapperRef.current.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const ox = dragStart.current.ox + e.clientX - dragStart.current.x;
    const oy = dragStart.current.oy + e.clientY - dragStart.current.y;
    const o  = clamp(currentScale.current, ox, oy);
    currentOffset.current = o;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => applyTransform(currentScale.current, o.x, o.y));
  }, [clamp, applyTransform]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (imgWrapperRef.current) imgWrapperRef.current.style.cursor = currentScale.current > 1 ? "grab" : "default";
  }, []);

  // ── Touch ──
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length === 2) {
      isPinching.current = true;
      const [a, b] = [e.touches[0], e.touches[1]];
      lastPinchDist.current = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      dragStart.current = {
        x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2,
        ox: currentOffset.current.x, oy: currentOffset.current.y,
      };
    } else if (e.touches.length === 1) {
      isPinching.current = false;
      const now = Date.now();
      if (now - lastTap.current < 300) {
        applyScale(currentScale.current > 1.2 ? 1 : 2.5);
        lastTap.current = 0;
        return;
      }
      lastTap.current = now;
      dragStart.current = {
        x: e.touches[0].clientX, y: e.touches[0].clientY,
        ox: currentOffset.current.x, oy: currentOffset.current.y,
      };
    }
  }, [applyScale]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.touches.length === 2 && lastPinchDist.current !== null) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist  = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      const ratio = dist / lastPinchDist.current;
      lastPinchDist.current = dist;
      const s = Math.min(5, Math.max(1, currentScale.current * ratio));
      const o = s === 1 ? { x: 0, y: 0 } : clamp(s, currentOffset.current.x, currentOffset.current.y);
      currentScale.current  = s;
      currentOffset.current = o;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        applyTransform(s, o.x, o.y);
        setZoomPct(s);
      });
    } else if (e.touches.length === 1 && !isPinching.current && currentScale.current > 1) {
      const ox = dragStart.current.ox + e.touches[0].clientX - dragStart.current.x;
      const oy = dragStart.current.oy + e.touches[0].clientY - dragStart.current.y;
      const o  = clamp(currentScale.current, ox, oy);
      currentOffset.current = o;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => applyTransform(currentScale.current, o.x, o.y));
    }
  }, [clamp, applyTransform]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length < 2) {
      // sync React state بعد انتهاء الـ pinch
      setScale(currentScale.current);
      setZoomPct(currentScale.current);
      isPinching.current    = false;
      lastPinchDist.current = null;
    }
    isDragging.current = false;
  }, []);

  const get = (en: string, arKey: string) => isAR && item[arKey] ? item[arKey] : en;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[300] bg-black"
      dir={isAR ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center
        px-4 md:px-8 py-4 md:py-5 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <span className="text-white/40 text-xs tracking-[0.5em] font-light pointer-events-auto">
          {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-3 pointer-events-auto">
          <button onClick={() => setShowInfo(v => !v)}
            className="md:hidden w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
              text-white/50 hover:text-white hover:border-white/40 transition">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </button>
          <button onClick={onClose}
            className="flex items-center gap-2 md:gap-3 text-white/60 hover:text-white
              text-xs tracking-[0.4em] uppercase transition group">
            <span className="hidden md:block">{isAR ? "إغلاق" : "Close"}</span>
            <span className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
              text-[#b8955a] text-lg group-hover:border-[#b8955a] transition">✕</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="absolute inset-0 flex">
        {/* Image container */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center overflow-hidden"
          style={{ touchAction: "none" }}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onContextMenu={e => e.preventDefault()}
          onDragStart={e => e.preventDefault()}
        >
          {/* fade-in فقط هنا */}
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-center"
          >
            {/* zoom + pan هنا عبر DOM مباشرة */}
            <div
              ref={imgWrapperRef}
              style={{
                transform: "scale(1) translate(0px, 0px)",
                transformOrigin: "center center",
                willChange: "transform",
                cursor: scale > 1 ? "grab" : "default",
              }}
            >
              <img
                src={item.src}
                alt={get(item.title, "titleAR")}
                draggable={false}
                className="block w-auto h-auto object-contain"
                style={{ maxWidth: "100vw", maxHeight: "100dvh", pointerEvents: "none", userSelect: "none" }}
              />
            </div>
          </motion.div>

          {/* Watermark */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="absolute text-white/[0.05] font-light select-none"
                style={{ fontSize: "clamp(9px,2vw,13px)", transform: "rotate(-25deg)", whiteSpace: "nowrap",
                  left: `${(i % 3) * 38 - 5}%`, top: `${Math.floor(i / 3) * 30 - 5}%`,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)", letterSpacing: "0.03em" }}>
                Walid Makram ©
              </span>
            ))}
          </div>

          {/* Hints */}
          {scale === 1 && (
            <div className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
              <span className="text-white/20 text-[10px] tracking-widest hidden md:block">scroll to zoom · drag to pan</span>
              <span className="text-white/20 text-[10px] tracking-widest md:hidden">pinch to zoom · double tap</span>
            </div>
          )}
          {zoomPct > 1 && (
            <div className="absolute top-16 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 pointer-events-none rounded">
              <span className="text-white/50 text-[10px] tracking-widest">{Math.round(zoomPct * 100)}%</span>
            </div>
          )}
        </div>

        {/* Desktop info panel */}
        <motion.div
          key={`info-${index}`}
          initial={{ opacity: 0, x: isAR ? -30 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden md:flex w-[420px] lg:w-[480px] shrink-0 flex-col justify-center
            px-10 lg:px-14 py-14 border-l border-white/10 bg-black overflow-y-auto"
        >
          <InfoContent item={item} isAR={isAR} />
          <div className="flex gap-3 mt-10">
            <button onClick={() => onNav((index - 1 + total) % total)}
              className="flex-1 border border-white/15 py-4 text-sm tracking-[0.3em] uppercase
                text-white/40 hover:text-white hover:border-[#b8955a] transition">
              {isAR ? "← السابق" : "← Prev"}
            </button>
            <button onClick={() => onNav((index + 1) % total)}
              className="flex-1 border border-white/15 py-4 text-sm tracking-[0.3em] uppercase
                text-white/40 hover:text-white hover:border-[#b8955a] transition">
              {isAR ? "التالي →" : "Next →"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile nav arrows */}
      <button className="md:hidden absolute left-1 top-1/2 -translate-y-1/2 z-20
        w-10 h-20 flex items-center justify-center text-5xl text-white/20 hover:text-[#b8955a] transition"
        onClick={() => onNav((index - 1 + total) % total)}>‹
      </button>
      <button className="md:hidden absolute right-1 top-1/2 -translate-y-1/2 z-20
        w-10 h-20 flex items-center justify-center text-5xl text-white/20 hover:text-[#b8955a] transition"
        onClick={() => onNav((index + 1) % total)}>›
      </button>

      {/* Mobile bottom title */}
      {!showInfo && (
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-10 px-6 py-5
          bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
          <p className={`text-white/80 text-sm font-light text-center truncate mb-1 ${isAR ? "ar-card-text" : ""}`}>
            {get(item.title, "titleAR")}
          </p>
          <p className="text-[#b8955a] text-[10px] tracking-widest text-center">{item.year}</p>
        </div>
      )}

      {/* Mobile info bottom sheet */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden absolute inset-0 z-20 bg-black/50"
              onClick={() => setShowInfo(false)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="md:hidden absolute bottom-0 left-0 right-0 z-30 bg-neutral-950
                border-t border-white/10 rounded-t-2xl px-6 pt-4 pb-10 max-h-[75vh] overflow-y-auto"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
              <InfoContent item={item} isAR={isAR} />
              <div className="flex gap-3 mt-8">
                <button onClick={() => onNav((index - 1 + total) % total)}
                  className="flex-1 border border-white/15 py-3 text-xs tracking-[0.3em] uppercase
                    text-white/40 hover:text-white hover:border-[#b8955a] transition">
                  {isAR ? "← السابق" : "← Prev"}
                </button>
                <button onClick={() => onNav((index + 1) % total)}
                  className="flex-1 border border-white/15 py-3 text-xs tracking-[0.3em] uppercase
                    text-white/40 hover:text-white hover:border-[#b8955a] transition">
                  {isAR ? "التالي →" : "Next →"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}