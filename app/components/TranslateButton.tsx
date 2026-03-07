"use client";  // أضف ده هنا

import { useState } from "react";

interface Props {
  arabicText: string;
  onTranslated: (en: string) => void;
}

export default function TranslateButton({ arabicText, onTranslated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);

  const handleTranslate = async () => {
    if (!arabicText.trim()) return;
    setLoading(true);
    setError(false);

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(arabicText)}&langpair=ar|en`;
      const res  = await fetch(url);
      const data = await res.json();
      const translated = data?.responseData?.translatedText?.trim();
      if (translated) onTranslated(translated);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={loading || !arabicText.trim()}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase
        border rounded transition-all duration-300 disabled:opacity-40
        ${error
          ? "border-red-400 text-red-400"
          : "border-[#b8955a] text-[#b8955a] hover:bg-[#b8955a] hover:text-white"}`}
    >
      {loading ? (
        <>
          <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
          </svg>
          جاري الترجمة...
        </>
      ) : error ? (
        "حدث خطأ — حاول مجدداً"
      ) : (
        <>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 8l6 6M4 14l6-6 2-3M2 5h7M7 2v3M22 22l-5-10-5 10M14 18h6"/>
          </svg>
          ترجم للإنجليزية
        </>
      )}
    </button>
  );
}