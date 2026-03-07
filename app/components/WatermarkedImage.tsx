"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  src: string;
  alt?: string;
  className?: string;
  watermark?: string;
  objectPosition?: "top" | "center" | "bottom";
  /**
   * naturalSize=true  → الـ canvas يأخذ حجم الصورة الطبيعي ويتحكم CSS في العرض
   *                     (مناسب للـ lightbox)
   * naturalSize=false → الـ canvas يملأ الـ container (object-cover)
   *                     (مناسب للـ grid cards) — default
   */
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  /* ── رسم الصورة + watermark ──────────────────────────────────── */
  const draw = useCallback(
    (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      if (naturalSize) {
        // ── وضع الـ lightbox: ارسم الصورة كاملة بدون crop ──
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, cw, ch);
      } else {
        // ── وضع الـ grid: object-cover حقيقي ──
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

      // ── watermark مكرر مائل ──
      const fontSize = Math.max(12, Math.round(cw * 0.028));
      ctx.font      = `600 ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = "center";

      const stepX = cw * 0.38;
      const stepY = ch * 0.28;

      for (let y = stepY * 0.5; y < ch + stepY; y += stepY) {
        for (let x = stepX * 0.5; x < cw + stepX; x += stepX) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-Math.PI / 7);
          ctx.shadowColor   = "rgba(0,0,0,0.55)";
          ctx.shadowBlur    = 4;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          ctx.fillStyle     = "rgba(255,255,255,0.20)";
          ctx.fillText(watermark, 0, 0);
          ctx.restore();
        }
      }
    },
    [watermark, objectPosition, naturalSize]
  );

  /* ── تحميل الصورة ────────────────────────────────────────────── */
  useEffect(() => {
    if (!src) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoaded(false);
    const img       = new Image();
    img.crossOrigin = "anonymous";
    imgRef.current  = img;

    img.onload = () => {
      if (naturalSize) {
        // الـ canvas يأخذ الأبعاد الطبيعية للصورة
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
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
  }, [src, draw, naturalSize]);

  /* ── ResizeObserver — فقط في وضع grid ───────────────────────── */
  useEffect(() => {
    if (naturalSize) return; // الـ lightbox مش محتاج resize
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

  /* ── منع سرقة الصورة ─────────────────────────────────────────── */
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

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      className={className}
      style={
        naturalSize
          ? {
              // ── lightbox: حجم طبيعي مقيّد بالـ viewport ──
              display   : "block",
              maxHeight : "68vh",
              maxWidth  : "80vw",
              width     : "auto",
              height    : "auto",
              opacity   : loaded ? 1 : 0,
              transition: "opacity 0.6s ease",
            }
          : {
              // ── grid: يملأ الـ container ──
              display   : "block",
              width     : "100%",
              height    : "100%",
              opacity   : loaded ? 1 : 0,
              transition: "opacity 0.6s ease",
            }
      }
    />
  );
}