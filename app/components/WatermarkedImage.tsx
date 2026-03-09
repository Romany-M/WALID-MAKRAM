"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  src: string;
  alt?: string;
  className?: string;
  watermark?: string;
  objectPosition?: "top" | "center" | "bottom";
  naturalSize?: boolean;
}

export default function WatermarkedImage({
  src,
  alt = "",
  className = "",
  watermark = "Walid Makram ©",
  objectPosition = "top",
  naturalSize = false,
}: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const imgRef      = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded]         = useState(false);
  const [displaySize, setDisplaySize] = useState<{ w: number; h: number } | null>(null);

  /* ── رسم الصورة + watermark ────────────────────────────────── */
  const draw = useCallback(
    (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;

      if (naturalSize) {
        // ── lightbox: الصورة كاملة بدون crop ──
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, cw, ch);
      } else {
        // ── grid: object-cover حقيقي ──
        const iw    = img.naturalWidth;
        const ih    = img.naturalHeight;
        const scale = Math.max(cw / iw, ch / ih);
        const sw    = cw / scale;
        const sh    = ch / scale;
        const sx    = (iw - sw) / 2;
        const sy    =
          objectPosition === "top"    ? 0
          : objectPosition === "bottom" ? ih - sh
          : (ih - sh) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
      }

      // في دالة draw — بدّل الجزء الخاص بالـ watermark بالكود ده:

      // ── watermark مكرر مائل ──
      const fontSize = Math.max(10, Math.round(cw * 0.022)); // ← أصغر شوية
      ctx.font       = `300 ${fontSize}px Arial, sans-serif`; // ← 300 بدل 400 (أرفع)
      ctx.textAlign  = "center";
      const stepX    = cw * 0.42;  // ← تباعد أكبر = عدد أقل
      const stepY    = ch * 0.32;

      for (let y = stepY * 0.5; y < ch + stepY; y += stepY) {
        for (let x = stepX * 0.5; x < cw + stepX; x += stepX) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-Math.PI / 7);
          ctx.shadowColor   = "rgba(0,0,0,0.3)";  // ← shadow أخف
          ctx.shadowBlur    = 3;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          ctx.fillStyle     = "rgba(255,255,255,0.055)"; // ← 0.10 → 0.055
          ctx.fillText(watermark, 0, 0);
          ctx.restore();
        }
      }
    },
    [watermark, objectPosition, naturalSize]
  );

  /* ── حساب حجم العرض في الـ lightbox ────────────────────────── */
  const calcDisplaySize = useCallback((nw: number, nh: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 768;

    // على الموبايل الـ layout عمودي — الصورة تاخد النص العلوي
    // على الـ desktop الـ layout جنب بجنب — الـ info panel بياخد ~500px
    const maxW = isMobile ? vw * 0.88 : (vw - 520) * 0.88;
    const maxH = isMobile ? vh * 0.45 : vh * 0.72;

    const scale = Math.min(maxW / nw, maxH / nh, 1); // مش نكبّر أكبر من الحجم الأصلي
    setDisplaySize({
      w: Math.round(nw * scale),
      h: Math.round(nh * scale),
    });
  }, []);

  /* ── تحميل الصورة ──────────────────────────────────────────── */
  useEffect(() => {
    if (!src) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoaded(false);
    setDisplaySize(null);

    const img       = new Image();
    img.crossOrigin = "anonymous";
    imgRef.current  = img;

    img.onload = () => {
      if (naturalSize) {
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        calcDisplaySize(img.naturalWidth, img.naturalHeight);
      } else {
        const rect    = canvas.getBoundingClientRect();
        canvas.width  = rect.width  || img.naturalWidth;
        canvas.height = rect.height || img.naturalHeight;
      }
      draw(canvas, img);
      setLoaded(true);
    };

    img.onerror = () => {
      canvas.width  = 400;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      if (ctx) { ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, 400, 500); }
      setLoaded(true);
    };

    img.src = src;
  }, [src, draw, naturalSize, calcDisplaySize]);

  /* ── إعادة حساب الحجم عند تغيير حجم النافذة (lightbox) ──── */
  useEffect(() => {
    if (!naturalSize) return;
    const img = imgRef.current;
    if (!img?.complete || !img.naturalWidth) return;

    const onResize = () => calcDisplaySize(img.naturalWidth, img.naturalHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [naturalSize, calcDisplaySize]);

  /* ── ResizeObserver — فقط في وضع grid ──────────────────────── */
  useEffect(() => {
    if (naturalSize) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      const img = imgRef.current;
      if (!img?.complete || !img.naturalWidth) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      canvas.width  = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
      draw(canvas, img);
    });

    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw, naturalSize]);

  /* ── منع سرقة الصورة ───────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const noCtx  = (e: MouseEvent)     => e.preventDefault();
    const noDrag = (e: DragEvent)      => e.preventDefault();
    const noCopy = (e: ClipboardEvent) => e.preventDefault();
    canvas.addEventListener("contextmenu", noCtx);
    canvas.addEventListener("dragstart",   noDrag);
    canvas.addEventListener("copy",        noCopy);
    return () => {
      canvas.removeEventListener("contextmenu", noCtx);
      canvas.removeEventListener("dragstart",   noDrag);
      canvas.removeEventListener("copy",        noCopy);
    };
  }, []);

  /* ── Style ─────────────────────────────────────────────────── */
  const style: React.CSSProperties =
    naturalSize && displaySize
      ? {
          display   : "block",
          width     : `${displaySize.w}px`,   // ← أبعاد محسوبة بدقة
          height    : `${displaySize.h}px`,
          opacity   : loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }
      : naturalSize
      ? {
          // قبل اكتمال الحساب — مرئي بأبعاد مؤقتة
          display   : "block",
          maxWidth  : "88vw",
          opacity   : 0,
          transition: "opacity 0.6s ease",
        }
      : {
          display   : "block",
          width     : "100%",
          height    : "100%",
          opacity   : loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        };

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      className={naturalSize ? className : className}
      style={style}
    />
  );
}