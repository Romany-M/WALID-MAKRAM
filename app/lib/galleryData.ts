import { supabase } from "./supabase";

/* ================= TYPES ================= */

export interface ArtItem {
  src: string;
  title: string; titleAR: string;
  medium: string; mediumAR: string;
  dims: string; year: string;
  location: string; locationAR: string;
}

export interface MuralItem {
  src: string;
  title: string; titleAR: string;
  location: string; locationAR: string;
  medium: string; mediumAR: string;
  size: string; year: string;
}

export interface GalleryConfig {
  heroSrc: string;
  galleryData: Record<"icons" | "gilding" | "mosaic", ArtItem[]>;
  exhibitions: ArtItem[];
  murals: MuralItem[];
}

/* ================= DEFAULT DATA ================= */

export const defaultGalleryData: Record<"icons"|"gilding"|"mosaic", ArtItem[]> = {

  icons: [
    { src:"/icons/icons/1.jpg", title:"The Descent into Hades", titleAR:"النزول إلى الجحيم", medium:"Egg Tempera & 24K Gold Leaf on Wood", mediumAR:"تمبيرا بيض وورق ذهب عيار 24 على خشب", dims:"45 × 60 cm", year:"2021", location:"Private Collection, Beirut", locationAR:"مجموعة خاصة، بيروت" },
  ],

  gilding: [
    { src:"/icons/gilding/1.jpg", title:"The Flight into Egypt", titleAR:"الهروب إلى مصر", medium:"Gold Leaf & Engraving", mediumAR:"تذهيب ونقش", dims:"60 × 80 cm", year:"2022", location:"Cairo, Egypt", locationAR:"القاهرة، مصر" },
  ],

  mosaic: [
    { src:"/icons/mosaic/1.jpg", title:"The Annunciation", titleAR:"البشارة", medium:"Mosaic Technique", mediumAR:"تقنية الفسيفساء", dims:"80 × 100 cm", year:"2023", location:"Dubai", locationAR:"دبي" },
  ],
};

export const defaultExhibitions: ArtItem[] = [
  { src:"/icons/exhibitions/1.jpg", title:"Sacred Exhibition", titleAR:"معرض مقدس", medium:"Mixed Media", mediumAR:"وسائط متعددة", dims:"—", year:"2024", location:"Paris", locationAR:"باريس" },
];

export const defaultMurals: MuralItem[] = [
  { src:"/icons/murals/1.jpg", title:"The Dome", titleAR:"القبة", location:"Church", locationAR:"كنيسة", medium:"Fresco", mediumAR:"فريسكو", size:"120 sqm", year:"2022" },
];

/* ================= DEFAULT CONFIG ================= */

export const defaultConfig: GalleryConfig = {
  heroSrc: "",
  galleryData: defaultGalleryData,
  exhibitions: defaultExhibitions,
  murals: defaultMurals,
};

/* ================= LOAD ================= */

export async function loadConfig(): Promise<GalleryConfig> {
  try {
    const { data, error } = await supabase
      .from("gallery_config")
      .select("config")
      .eq("id", 1)
      .maybeSingle();

    if (error) throw error;

    if (!data?.config || Object.keys(data.config).length === 0)
      return defaultConfig;

    const p = data.config as Partial<GalleryConfig>;

    return {
      heroSrc: p.heroSrc || defaultConfig.heroSrc,
      galleryData: p.galleryData || defaultConfig.galleryData,
      exhibitions: p.exhibitions || defaultConfig.exhibitions,
      murals: p.murals || defaultConfig.murals,
    };

  } catch (err) {
    console.error("loadConfig error:", err);
    return defaultConfig;
  }
}

/* ================= SAVE ================= */

export async function saveConfig(cfg: GalleryConfig): Promise<void> {
  const { error } = await supabase
    .from("gallery_config")
    .upsert(
      { id: 1, config: cfg, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );

  if (error) throw new Error(error.message);
}

/* ================= UPLOAD ================= */

export async function uploadImage(file: File): Promise<string> {
  const ext  = file.name.split(".").pop();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("gallery-images")
    .upload(name, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("gallery-images")
    .getPublicUrl(name);

  return data.publicUrl;
}