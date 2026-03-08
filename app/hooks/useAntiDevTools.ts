"use client";

import { useEffect } from "react";

export function useAntiDevTools() {
  useEffect(() => {

    // ── 1. منع Right-Click على الصفحة كلها ──────────────────────
    const noCtx = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", noCtx);

    // ── 2. منع Drag على الصور والـ Canvas ───────────────────────
    const noDrag = (e: DragEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "IMG" || tag === "CANVAS") e.preventDefault();
    };
    document.addEventListener("dragstart", noDrag);

    // ── 3. منع تحديد النص (ما عدا input/textarea) ───────────────
    const noSelect = (e: Event) => {
      if (!(e.target as HTMLElement).closest("input, textarea"))
        e.preventDefault();
    };
    document.addEventListener("selectstart", noSelect);

    // ── 4. منع Keyboard Shortcuts ───────────────────────────────
    const noKeys = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const k    = e.key.toLowerCase();
      const blocked =
        e.key  === "F12"                           || // DevTools
        (ctrl && e.shiftKey && "ijc".includes(k)) || // Ctrl+Shift+I/J/C
        (ctrl && k === "u")                        || // View Source
        (ctrl && k === "s")                        || // Save Page
        (ctrl && k === "p")                        || // Print
        (ctrl && k === "a");                          // Select All
      if (blocked) { e.preventDefault(); e.stopPropagation(); }
    };
    document.addEventListener("keydown", noKeys, true); // capture phase

    // ── 5. منع Copy ──────────────────────────────────────────────
    const noCopy = (e: ClipboardEvent) => {
      const sel = window.getSelection();
      // نسمح بالـ copy داخل input/textarea فقط
      if (!(document.activeElement instanceof HTMLInputElement) &&
          !(document.activeElement instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        if (e.clipboardData && sel) e.clipboardData.setData("text/plain", "");
      }
    };
    document.addEventListener("copy", noCopy);

    // ── 6. منع Print عبر CSS كذلك ───────────────────────────────
    const printStyle = document.createElement("style");
    printStyle.id        = "__no_print__";
    printStyle.innerHTML = `@media print { body { display: none !important; } }`;
    document.head.appendChild(printStyle);

    // ── 7. منع Screenshot عبر Print Screen key ───────────────────
    const noPrtSc = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        // مؤقتاً خلي الصفحة شفافة للـ screenshot فيطلع فاضي
        document.body.style.visibility = "hidden";
        setTimeout(() => { document.body.style.visibility = ""; }, 300);
      }
    };
    document.addEventListener("keyup", noPrtSc);

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      document.removeEventListener("contextmenu",  noCtx);
      document.removeEventListener("dragstart",    noDrag);
      document.removeEventListener("selectstart",  noSelect);
      document.removeEventListener("keydown",      noKeys, true);
      document.removeEventListener("copy",         noCopy);
      document.removeEventListener("keyup",        noPrtSc);
      document.getElementById("__no_print__")?.remove();
      document.body.style.filter        = "";
      document.body.style.pointerEvents = "";
      document.body.style.userSelect    = "";
      document.body.style.visibility    = "";
    };
  }, []);
}