"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  defaultConfig, loadConfig, saveConfig, uploadImage,
  GalleryConfig, ArtItem, MuralItem,
} from "../lib/galleryData";
import TranslateButton from "../components/TranslateButton";

type Section = "hero"|"ancient"|"coptic"|"oil"|"various"|"murals";

const emptyArt:   ArtItem   = { src:"", title:"", titleAR:"", medium:"", mediumAR:"", dims:"", year:"", location:"", locationAR:"" };
const emptyMural: MuralItem = { src:"", title:"", titleAR:"", location:"", locationAR:"", medium:"", mediumAR:"", size:"", year:"" };

const ART_FIELDS = [
  { key:"src",        label:"Image URL",      labelAR:"رابط الصورة",     ph:"/icons/ancient/1.jpg" },
  { key:"title",      label:"Title (EN)",     labelAR:"العنوان إنجليزي", ph:"The Holy Family"      },
  { key:"titleAR",    label:"Title (AR)",     labelAR:"العنوان عربي",    ph:"العائلة المقدسة"      },
  { key:"medium",     label:"Medium (EN)",    labelAR:"الأسلوب إنجليزي", ph:"Egg Tempera on Wood"  },
  { key:"mediumAR",   label:"Medium (AR)",    labelAR:"الأسلوب عربي",    ph:"تمبيرا بيض على خشب"  },
  { key:"dims",       label:"Dimensions",     labelAR:"الأبعاد",          ph:"40 × 55 cm"           },
  { key:"year",       label:"Year",           labelAR:"السنة",            ph:"2023"                 },
  { key:"location",   label:"Location (EN)",  labelAR:"الموقع إنجليزي",  ph:"Cairo, Egypt"         },
  { key:"locationAR", label:"Location (AR)",  labelAR:"الموقع عربي",     ph:"القاهرة، مصر"         },
];
const MURAL_FIELDS = [
  { key:"src",        label:"Image URL",      labelAR:"رابط الصورة",     ph:"/icons/oil/1.jpg"               },
  { key:"title",      label:"Title (EN)",     labelAR:"العنوان إنجليزي", ph:"The Pantocrator Dome"           },
  { key:"titleAR",    label:"Title (AR)",     labelAR:"العنوان عربي",    ph:"قبة المسيح الضابط الكل"         },
  { key:"location",   label:"Location (EN)",  labelAR:"الموقع إنجليزي",  ph:"St. Mary's Cathedral, Jordan"   },
  { key:"locationAR", label:"Location (AR)",  labelAR:"الموقع عربي",     ph:"كاتدرائية السيدة العذراء، الأردن"},
  { key:"medium",     label:"Medium (EN)",    labelAR:"الأسلوب إنجليزي", ph:"Fresco Technique"               },
  { key:"mediumAR",   label:"Medium (AR)",    labelAR:"الأسلوب عربي",    ph:"تقنية الفريسكو"                 },
  { key:"size",       label:"Size",           labelAR:"المساحة",          ph:"120 sqm"                        },
  { key:"year",       label:"Year",           labelAR:"السنة",            ph:"2021–2022"                      },
];

// الحقول العربية وما يقابلها إنجليزي
const AR_TO_EN: Record<string, string> = {
  titleAR:    "title",
  mediumAR:   "medium",
  locationAR: "location",
};

const NAV: { key: Section; en: string; ar: string; icon: string }[] = [
  { key:"hero",    en:"Hero Image",     ar:"صورة الغلاف",       icon:"🖼️" },
  { key:"ancient", en:"Ancient Art",    ar:"الفن القديم",        icon:"🏛️" },
  { key:"coptic",  en:"Coptic Art",     ar:"الفن القبطي",        icon:"✝️" },
  { key:"oil",     en:"Oil Paintings",  ar:"اللوحات الزيتية",   icon:"🎨" },
  { key:"various", en:"Various Works",  ar:"أعمال متنوعة",       icon:"🖌️" },
  { key:"murals",  en:"Murals & Domes", ar:"الجداريات والقباب", icon:"⛪" },
];

const PASSWORD = "walidmakram";

/* ══ InputField ══ */
function InputField({
  label, labelAR, ph, value, onChange, span2 = false, uploadable = false,
}: {
  label: string; labelAR: string; ph: string; value: string;
  onChange: (v: string) => void; span2?: boolean; uploadable?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("يرجى اختيار ملف صورة فقط"); return; }
    try {
      setUploading(true);
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      alert("فشل رفع الصورة: " + (err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className={span2 ? "col-span-2" : ""}>
      <label className="block text-[10px] tracking-widest text-neutral-500 uppercase mb-1">
        {label} <span className="text-neutral-700 normal-case">/ {labelAR}</span>
      </label>
      {uploadable ? (
        <div className="flex gap-2">
          <input value={value} onChange={e => onChange(e.target.value)} placeholder={ph}
            className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-xs
                       placeholder:text-neutral-700 focus:outline-none focus:border-[#b8955a] transition min-w-0" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="shrink-0 px-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#b8955a]
                       text-[#b8955a] rounded transition flex items-center justify-center text-xl disabled:opacity-40">
            {uploading ? <span className="w-5 h-5 border-2 border-[#b8955a]/30 border-t-[#b8955a] rounded-full animate-spin" /> : "📁"}
          </button>
          <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} className="hidden" />
        </div>
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={ph}
          className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-xs
                     placeholder:text-neutral-700 focus:outline-none focus:border-[#b8955a] transition" />
      )}
    </div>
  );
}

/* ══ FormFields — حقول الفورم مع زراير الترجمة ══ */
function FormFields({
  fields,
  item,
  onChange,
}: {
  fields: typeof ART_FIELDS;
  item: ArtItem | MuralItem;
  onChange: (key: string, value: string) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const val = (key: string) => (item as any)[key] || "";

  return (
    <div className="grid grid-cols-2 gap-2">
      {fields.map(f => {
        const enKey = AR_TO_EN[f.key]; // لو الحقل عربي، enKey = المقابل الإنجليزي
        return (
          <div key={f.key} className={`flex flex-col gap-1 ${f.key === "src" ? "col-span-2" : ""}`}>
            {/* label + زرار الترجمة جنب بعض */}
            <div className="flex items-center justify-between gap-2">
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase">
                {f.label} <span className="text-neutral-700 normal-case">/ {f.labelAR}</span>
              </label>
              {/* زرار الترجمة فقط على الحقول العربية */}
              {enKey && (
                <TranslateButton
                  arabicText={val(f.key)}
                  onTranslated={en => onChange(enKey, en)}
                />
              )}
            </div>
            {f.key === "src" ? (
              /* حقل الصورة مع رفع */
              <InputField
                label="" labelAR="" ph={f.ph}
                value={val(f.key)}
                onChange={v => onChange(f.key, v)}
                span2 uploadable
              />
            ) : (
              <input
                value={val(f.key)}
                onChange={e => onChange(f.key, e.target.value)}
                placeholder={f.ph}
                dir={f.key.endsWith("AR") ? "rtl" : "ltr"}
                className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-xs
                           placeholder:text-neutral-700 focus:outline-none focus:border-[#b8955a] transition"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══ ADMIN DASHBOARD ══ */
export default function AdminDashboard() {
  const [cfg, setCfg]           = useState<GalleryConfig>(defaultConfig);
  const [active, setActive]     = useState<Section>("hero");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [editIdx, setEditIdx]   = useState<number|null>(null);
  const [editItem, setEditItem] = useState<ArtItem|MuralItem|null>(null);
  const [addMode, setAddMode]   = useState(false);
  const [newItem, setNewItem]   = useState<ArtItem|MuralItem>(emptyArt);
  const [authenticated, setAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [draggedOver, setDraggedOver] = useState<number|null>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const heroFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadConfig().then(setCfg); }, []);

  useEffect(() => {
    setEditIdx(null); setEditItem(null);
    setAddMode(false);
    setNewItem(active === "murals" ? emptyMural : emptyArt);
    setDraggedOver(null);
  }, [active]);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const handleLogin = () => {
    if (passInput === PASSWORD) { setAuthenticated(true); setPassError(false); }
    else { setPassError(true); setPassInput(""); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveConfig(cfg);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("فشل الحفظ: " + (err as Error).message);
    } finally { setSaving(false); }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset everything to defaults?")) return;
    setSaving(true);
    try { await saveConfig(defaultConfig); setCfg(defaultConfig); }
    catch (err) { alert("فشل الإعادة: " + (err as Error).message); }
    finally { setSaving(false); }
  };

  const handleHeroFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      setHeroUploading(true);
      const url = await uploadImage(file);
      setCfg({ ...cfg, heroSrc: url });
    } catch (err) {
      alert("فشل رفع الصورة: " + (err as Error).message);
    } finally { setHeroUploading(false); e.target.value = ""; }
  };

  const getItems = (): (ArtItem|MuralItem)[] => {
    if (!cfg?.galleryData) return [];
    if (active === "ancient") return cfg.galleryData.ancient || [];
    if (active === "coptic")  return cfg.galleryData.coptic  || [];
    if (active === "oil")     return cfg.galleryData.oil     || [];
    if (active === "various") return cfg.variousWorks        || [];
    if (active === "murals")  return cfg.murals              || [];
    return [];
  };

  const setItems = (items: (ArtItem|MuralItem)[]) => {
    if (active === "murals")  { setCfg({ ...cfg, murals: items as MuralItem[] }); return; }
    if (active === "various") { setCfg({ ...cfg, variousWorks: items as ArtItem[] }); return; }
    if (["ancient","coptic","oil"].includes(active))
      setCfg({ ...cfg, galleryData: { ...cfg.galleryData, [active]: items as ArtItem[] } });
  };

  const del       = (i: number) => { if (window.confirm("Delete this item?")) { const it = [...getItems()]; it.splice(i,1); setItems(it); } };
  const startEdit = (i: number) => { setEditIdx(i); setEditItem({ ...getItems()[i] }); setAddMode(false); };
  const saveEdit  = () => { if (editIdx===null||!editItem) return; const it=[...getItems()]; it[editIdx]=editItem; setItems(it); setEditIdx(null); setEditItem(null); };
  const addItem   = () => { setItems([...getItems(), newItem]); setNewItem(active==="murals"?emptyMural:emptyArt); setAddMode(false); };

  const fields = active === "murals" ? MURAL_FIELDS : ART_FIELDS;
  const items  = getItems();
  const activeNav = NAV.find(s => s.key === active);

  /* ── PASSWORD SCREEN ── */
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4" style={{ fontFamily:"system-ui, sans-serif" }}>
        <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="text-[#b8955a] text-4xl mb-3">🔐</div>
            <p className="text-white text-2xl tracking-widest font-light">ADMIN PANEL</p>
            <p className="text-neutral-500 text-sm mt-1">Walid Makram Gallery</p>
          </div>
          <input type="password" value={passInput}
            onChange={e => { setPassInput(e.target.value); setPassError(false); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="كلمة السر / Password"
            className="w-full bg-black/30 border border-white/10 rounded px-5 py-3.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#b8955a] text-sm" />
          {passError && <p className="text-red-500 text-xs mt-3 text-center">كلمة سر خاطئة • Wrong password</p>}
          <button onClick={handleLogin}
            className="mt-6 w-full bg-[#b8955a] hover:bg-[#a07848] text-black font-medium py-3.5 rounded-lg transition text-sm tracking-wider">
            UNLOCK DASHBOARD
          </button>
          <p className="text-center text-[10px] text-neutral-600 mt-8">تواصل مع وليد للحصول على الوصول</p>
        </div>
      </div>
    );
  }

  /* ── SIDEBAR CONTENT ── */
  const SidebarContent = () => (
    <>
      <div className="px-6 py-6 border-b border-white/10">
        <p className="text-[8px] tracking-[0.6em] uppercase text-[#b8955a] mb-1">Admin Panel</p>
        <p className="text-white font-light tracking-widest uppercase text-sm md:text-base">Walid Makram</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(s => (
          <button key={s.key}
            onClick={() => { setActive(s.key); setSidebarOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all
              ${active === s.key
                ? "bg-[#b8955a]/15 text-[#b8955a] border-l-2 border-[#b8955a] pl-3"
                : "text-neutral-400 hover:text-white hover:bg-white/5"}`}>
            <span className="mr-2">{s.icon}</span>{s.en}
            <span className="block text-[10px] text-neutral-600 mt-0.5 pl-6">{s.ar}</span>
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <Link href="/"
          className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm px-4 py-2 rounded hover:bg-white/5 transition">
          ← Back to Site
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#0d0d0d] text-white" style={{ fontFamily:"system-ui, sans-serif" }}>

      {/* ── Sidebar Desktop ── */}
      <aside className="hidden md:flex w-60 shrink-0 bg-[#111] border-r border-white/10 flex-col">
        <SidebarContent />
      </aside>

      {/* ── Sidebar Mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-64 bg-[#111] border-r border-white/10 flex flex-col h-full">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top Header ── */}
        <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b border-white/10 bg-[#111] shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="md:hidden flex flex-col gap-[5px] p-1.5 shrink-0"
              aria-label="Toggle sidebar">
              <span className="block w-5 h-[1.5px] bg-neutral-300" />
              <span className="block w-5 h-[1.5px] bg-neutral-300" />
              <span className="block w-5 h-[1.5px] bg-neutral-300" />
            </button>
            <div className="min-w-0">
              <h2 className="text-white font-light tracking-wide text-sm md:text-base truncate">
                {activeNav?.icon} {activeNav?.en}
                <span className="text-neutral-600 text-xs ml-2 hidden sm:inline">{activeNav?.ar}</span>
              </h2>
              {active !== "hero" && <p className="text-neutral-600 text-xs mt-0.5">{items.length} items</p>}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={handleReset} disabled={saving}
              className="px-3 md:px-5 py-2 text-xs md:text-sm font-bold tracking-wider uppercase border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition disabled:opacity-40">
              <span className="hidden sm:inline">🗑 Reset</span>
              <span className="sm:hidden">🗑</span>
            </button>
            <button onClick={handleSave} disabled={saving}
              className={`px-4 md:px-8 py-2 text-xs md:text-sm font-bold tracking-wider uppercase rounded-lg transition-all flex items-center gap-2 shadow-lg
                ${saved ? "bg-green-500 text-white" : "bg-[#b8955a] hover:bg-[#a07848] text-black"} disabled:opacity-60`}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /><span className="hidden sm:inline">Saving...</span></>
                : saved
                ? <><span>✓</span><span className="hidden sm:inline">Saved!</span></>
                : <><span>💾</span><span className="hidden sm:inline">Save Changes</span></>}
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">

          {/* HERO */}
          {active === "hero" && (
            <div className="max-w-xl">
              <p className="text-neutral-500 text-sm mb-6">
                يمكنك كتابة URL مباشرة أو رفع صورة من الكمبيوتر — ستُرفع على Supabase تلقائياً
              </p>
              <label className="block text-[10px] tracking-widest uppercase text-neutral-500 mb-2">
                Hero Image URL / رابط صورة الغلاف
              </label>
              <div className="flex gap-2">
                <input value={cfg.heroSrc} onChange={e => setCfg({ ...cfg, heroSrc: e.target.value })}
                  placeholder="/hero.png"
                  className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#b8955a] transition min-w-0" />
                <button type="button" onClick={() => heroFileRef.current?.click()} disabled={heroUploading}
                  className="shrink-0 px-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#b8955a] text-[#b8955a] rounded transition flex items-center justify-center text-xl disabled:opacity-40">
                  {heroUploading ? <span className="w-5 h-5 border-2 border-[#b8955a]/30 border-t-[#b8955a] rounded-full animate-spin" /> : "📁"}
                </button>
              </div>
              <input type="file" ref={heroFileRef} accept="image/*" className="hidden" onChange={handleHeroFile} />
              {cfg.heroSrc && (
                <div className="mt-4 overflow-hidden rounded border border-white/10" style={{ height:200 }}>
                  <img src={cfg.heroSrc} className="w-full h-full object-cover opacity-60" alt="Preview" />
                </div>
              )}
            </div>
          )}

          {/* ITEMS GRID */}
          {active !== "hero" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {items.map((item, idx) => {
                  const isEditing = editIdx === idx;
                  return (
                    <div key={idx}
                      className={`bg-white/5 rounded-lg border border-white/10 overflow-hidden transition-all duration-200
                        ${!isEditing ? "cursor-grab active:cursor-grabbing" : ""}
                        ${draggedOver === idx && !isEditing ? "ring-2 ring-[#b8955a] ring-offset-4 ring-offset-[#0d0d0d] scale-[1.02]" : ""}`}
                      draggable={!isEditing}
                      onDragStart={!isEditing ? e => e.dataTransfer.setData("text/plain", idx.toString()) : undefined}
                      onDragOver={!isEditing ? e => e.preventDefault() : undefined}
                      onDragEnter={!isEditing ? e => { e.preventDefault(); setDraggedOver(idx); } : undefined}
                      onDragLeave={!isEditing ? () => setDraggedOver(null) : undefined}
                      onDrop={!isEditing ? e => {
                        e.preventDefault();
                        const from = parseInt(e.dataTransfer.getData("text/plain"));
                        if (isNaN(from) || from === idx) { setDraggedOver(null); return; }
                        const cur = [...items];
                        const [moved] = cur.splice(from, 1);
                        cur.splice(from < idx ? idx - 1 : idx, 0, moved);
                        setItems(cur);
                        setDraggedOver(null);
                      } : undefined}
                    >
                      {isEditing ? (
                        <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
                          <p className="text-[#b8955a] text-[10px] tracking-widest uppercase">
                            ✏️ Editing — اكتب بالعربي واضغط ترجم
                          </p>
                          {/* ✅ FormFields مع زراير الترجمة */}
                          <FormFields
                            fields={fields}
                            item={editItem!}
                            onChange={(key, val) =>
                              setEditItem(prev => prev ? { ...prev, [key]: val } as ArtItem|MuralItem : prev)
                            }
                          />
                          <div className="flex gap-2 pt-2">
                            <button onClick={saveEdit}
                              className="flex-1 bg-[#b8955a] text-black text-xs py-2 rounded hover:bg-[#a07848] transition font-medium">
                              Save
                            </button>
                            <button onClick={() => { setEditIdx(null); setEditItem(null); }}
                              className="flex-1 border border-white/20 text-white/60 text-xs py-2 rounded hover:bg-white/5 transition">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="relative bg-neutral-900" style={{ paddingTop:"56.25%" }}>
                            <img src={item.src} alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover object-top opacity-75" />
                            <span className="absolute top-2 right-2 bg-black/60 text-[10px] text-neutral-400 px-2 py-0.5 rounded">
                              {idx + 1}
                            </span>
                          </div>
                          <div className="p-3">
                            <p className="text-white text-sm font-light truncate">{item.title}</p>
                            <p className="text-neutral-500 text-[10px] mt-0.5">
                              {item.year} · {"dims" in item ? (item as ArtItem).dims : (item as MuralItem).size}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => startEdit(idx)}
                                className="flex-1 border border-[#b8955a]/40 text-[#b8955a] text-[10px] py-1.5 rounded hover:bg-[#b8955a]/10 transition uppercase tracking-wider">
                                ✏️ Edit
                              </button>
                              <button onClick={() => del(idx)}
                                className="flex-1 border border-red-900/40 text-red-500 text-[10px] py-1.5 rounded hover:bg-red-900/20 transition uppercase tracking-wider">
                                🗑️ Del
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ADD FORM */}
              {addMode ? (
                <div className="bg-white/5 border border-[#b8955a]/30 rounded-lg p-4 md:p-6">
                  <p className="text-[#b8955a] text-[10px] tracking-widest uppercase mb-4">
                    Add New Item — اكتب بالعربي واضغط ترجم للحصول على الإنجليزي تلقائياً
                  </p>
                  {/* ✅ FormFields مع زراير الترجمة */}
                  <FormFields
                    fields={fields}
                    item={newItem}
                    onChange={(key, val) => setNewItem(prev => ({ ...prev, [key]: val }) as ArtItem|MuralItem)}
                  />
                  <div className="flex gap-3 mt-4">
                    <button onClick={addItem}
                      className="px-6 py-2 bg-[#b8955a] text-black text-xs font-medium rounded hover:bg-[#a07848] transition uppercase tracking-wider">
                      Add Item
                    </button>
                    <button onClick={() => setAddMode(false)}
                      className="px-6 py-2 border border-white/20 text-white/60 text-xs rounded hover:bg-white/5 transition uppercase">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddMode(true)}
                  className="flex items-center gap-3 border border-dashed border-white/20 rounded-lg
                             px-4 md:px-6 py-3 md:py-4 text-sm text-neutral-400 hover:text-white
                             hover:border-[#b8955a]/50 transition group w-full md:w-auto">
                  <span className="text-2xl text-[#b8955a] group-hover:scale-110 transition-transform leading-none">+</span>
                  Add New Item / إضافة عمل جديد
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}