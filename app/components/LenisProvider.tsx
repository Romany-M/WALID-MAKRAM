"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,           // ← كان 1.4 — أقل = أسرع وأقل تقطيع
      easing: (t) => 1 - Math.pow(1 - t, 4), // ← easeOutQuart أسلس من الـ exponential
      smoothWheel: true,
      syncTouch: false,        // ← مهم جداً على الموبايل يمنع التعارض مع touch events
      touchMultiplier: 1.5,    // ← سرعة السكرول باليد على الموبايل
      infinite: false,
    });

    (window as any).__lenis = lenis;

    // ← استخدم timestamp من rAF مباشرة أدق من الـ loop القديم
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId); // ← مهم تلغي الـ loop عند unmount
      lenis.destroy();
      (window as any).__lenis = null;
    };
  }, []);

  return <>{children}</>;
}