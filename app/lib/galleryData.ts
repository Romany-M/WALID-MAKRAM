import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wnlfimqifwcjmyrajnaq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubGZpbXFpZndjam15cmFqbmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1ODk0NDksImV4cCI6MjA4ODE2NTQ0OX0.ZDx4Yvs3LcJ7me2zSbRHc-gH7RQXABGuuZmOF05gBBw"
);

/* ── Types ── */
export interface ArtItem {
  src: string; title: string; titleAR: string;
  medium: string; mediumAR: string; dims: string;
  year: string; location: string; locationAR: string;
}
export interface MuralItem {
  src: string; title: string; titleAR: string;
  location: string; locationAR: string;
  medium: string; mediumAR: string;
  size: string; year: string;
}
export interface GalleryConfig {
  heroSrc:      string;
  galleryData:  { ancient: ArtItem[]; coptic: ArtItem[]; oil: ArtItem[] };
  variousWorks: ArtItem[];
  murals:       MuralItem[];
}

export const defaultConfig: GalleryConfig = {
  heroSrc: "/hero.png",
  galleryData: { ancient: [], coptic: [], oil: [] },
  variousWorks: [],
  murals: [],
};

/* ── Load ── */
export async function loadConfig(): Promise<GalleryConfig> {
  try {
    const { data, error } = await supabase
      .from("gallery_config")
      .select("data")
      .eq("id", 1)
      .maybeSingle(); // ← maybeSingle بدل single عشان متكسرش لو مفيش صف

    if (error) throw error;
    if (!data) return defaultConfig;

    const saved = data.data as GalleryConfig;
    return {
      heroSrc:      saved.heroSrc      ?? defaultConfig.heroSrc,
      galleryData: {
        ancient: saved.galleryData?.ancient ?? [],
        coptic:  saved.galleryData?.coptic  ?? [],
        oil:     saved.galleryData?.oil     ?? [],
      },
      variousWorks: saved.variousWorks ?? [],
      murals:       saved.murals       ?? [],
    };
  } catch (err) {
    console.error("loadConfig error:", err);
    return defaultConfig;
  }
}

/* ── Save ── */
export async function saveConfig(cfg: GalleryConfig): Promise<void> {
  const { error } = await supabase
    .from("gallery_config")
    .upsert({ id: 1, data: cfg }, { onConflict: "id" });

  if (error) throw new Error(error.message);
}

/* ── Upload Image ── */
export async function uploadImage(file: File): Promise<string> {
  const ext      = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path     = `uploads/${filename}`;

  const { error } = await supabase.storage
    .from("gallery-images")
    .upload(path, file, { upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("gallery-images")
    .getPublicUrl(path);

  return data.publicUrl;
}