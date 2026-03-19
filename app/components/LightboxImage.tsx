"use client";

export default function LightboxImage({
  src,
  alt = "",
  watermark = "Dana Dahdal ©",
}: {
  src: string;
  alt?: string;
  watermark?: string;
}) {
  return (
    <div
      className="relative inline-block select-none"
      onContextMenu={e => e.preventDefault()}
      onDragStart={e => e.preventDefault()}
    >
      {/* الصورة العادية — بدون canvas = بدون blur */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="block max-h-[42vh] md:max-h-[68vh] max-w-[88vw] md:max-w-[75vw] w-auto h-auto object-contain"
        style={{ pointerEvents: "none", userSelect: "none" }}
      />

      {/* overlay شفاف يمنع long-press save على الموبايل */}
      <div
        className="absolute inset-0 z-10"
        onContextMenu={e => e.preventDefault()}
        onDragStart={e => e.preventDefault()}
        style={{ WebkitUserSelect: "none", userSelect: "none" }}
      />

      {/* CSS watermark مكرر فوق الصورة */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-white/20 font-semibold select-none"
            style={{
              fontSize       : "clamp(10px, 2.5vw, 14px)",
              transform      : "rotate(-25deg)",
              whiteSpace     : "nowrap",
              left           : `${(i % 3) * 35 - 5}%`,
              top            : `${Math.floor(i / 3) * 28 - 5}%`,
              textShadow     : "1px 1px 3px rgba(0,0,0,0.5)",
              letterSpacing  : "0.05em",
            }}
          >
            {watermark}
          </span>
        ))}
      </div>
    </div>
  );
}