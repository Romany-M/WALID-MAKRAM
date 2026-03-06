import { supabase } from "./supabase";

// ✅ تأكد إن الـ import صح ومفيش supabase client تاني في الملف

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
  galleryData: Record<"ancient"|"coptic"|"oil", ArtItem[]>;
  variousWorks: ArtItem[];
  murals: MuralItem[];
}

export const defaultGalleryData: Record<"ancient"|"coptic"|"oil", ArtItem[]> = {
  ancient: [
    { src:"/icons/ancient/1.jpg", title:"The Descent into Hades",  titleAR:"النزول إلى الجحيم",       medium:"Egg Tempera & 24K Gold Leaf on Wood", mediumAR:"تمبيرا بيض وورق ذهب عيار 24 على خشب", dims:"45 × 60 cm", year:"2021", location:"Private Collection, Beirut",  locationAR:"مجموعة خاصة، بيروت"     },
    { src:"/icons/ancient/2.jpg", title:"Theotokos of the Sign",   titleAR:"والدة الإله آية العلامة", medium:"Mineral Pigments on Gessoed Panel",    mediumAR:"أصباغ معدنية على لوح مجصص",           dims:"30 × 40 cm", year:"2022", location:"Cairo, Egypt",                locationAR:"القاهرة، مصر"            },
    { src:"/icons/ancient/3.jpg", title:"Christ the High Priest",  titleAR:"المسيح الكاهن الأعظم",   medium:"Egg Tempera & 24K Gold Leaf on Wood", mediumAR:"تمبيرا بيض وورق ذهب عيار 24 على خشب", dims:"40 × 55 cm", year:"2023", location:"Private Collection, Amman",  locationAR:"مجموعة خاصة، عمّان"     },
    { src:"/icons/ancient/4.jpg", title:"The Holy Family",         titleAR:"العائلة المقدسة",         medium:"Traditional Pigments on Canvas",       mediumAR:"أصباغ تقليدية على قماش",              dims:"50 × 70 cm", year:"2020", location:"Holy Family Church, Egypt",  locationAR:"كنيسة العائلة المقدسة، مصر" },
    { src:"/icons/ancient/5.jpg", title:"Saints Peter and Paul",   titleAR:"القديسان بطرس وبولس",    medium:"Egg Tempera on Lime Wood",             mediumAR:"تمبيرا بيض على خشب الزيزفون",         dims:"35 × 50 cm", year:"2021", location:"St. Peter's Church, Cairo",  locationAR:"كنيسة مار بطرس، القاهرة" },
    { src:"/icons/ancient/6.jpg", title:"The Dormition",           titleAR:"رقاد السيدة العذراء",    medium:"Mineral Pigments & 24K Gold Leaf",     mediumAR:"أصباغ معدنية وورق ذهب عيار 24",       dims:"45 × 65 cm", year:"2022", location:"Private Collection, Beirut", locationAR:"مجموعة خاصة، بيروت"      },
    { src:"/icons/ancient/7.jpg", title:"Archangel Gabriel",       titleAR:"رئيس الملائكة جبرائيل",  medium:"Egg Tempera on Gessoed Panel",         mediumAR:"تمبيرا بيض على لوح مجصص",             dims:"30 × 45 cm", year:"2023", location:"Private Collection, Paris",  locationAR:"مجموعة خاصة، باريس"      },
    { src:"/icons/ancient/8.jpg", title:"The Baptism of Christ",   titleAR:"معمودية المسيح",          medium:"Traditional Byzantine Method",         mediumAR:"الأسلوب البيزنطي التقليدي",            dims:"55 × 75 cm", year:"2024", location:"Private Collection, London", locationAR:"مجموعة خاصة، لندن"       },
  ],
  coptic: [
    { src:"/icons/coptic/1.jpg", title:"The Flight into Egypt",      titleAR:"الهروب إلى مصر",               medium:"Traditional Pigments on Canvas",  mediumAR:"أصباغ تقليدية على قماش",              dims:"60 × 80 cm", year:"2022", location:"Cairo, Egypt",                 locationAR:"القاهرة، مصر"               },
    { src:"/icons/coptic/2.jpg", title:"Saint Mark the Evangelist",  titleAR:"القديس مرقس الإنجيلي",         medium:"Egg Tempera & Gold Leaf",         mediumAR:"تمبيرا بيض وورق ذهب",                 dims:"35 × 50 cm", year:"2023", location:"St. Mark's Cathedral, Cairo", locationAR:"كاتدرائية القديس مرقس، القاهرة" },
    { src:"/icons/coptic/3.jpg", title:"The Nativity Scene",         titleAR:"مشهد الميلاد",                  medium:"Mineral Pigments on Panel",       mediumAR:"أصباغ معدنية على لوح",                dims:"40 × 60 cm", year:"2021", location:"Private Collection, Paris",   locationAR:"مجموعة خاصة، باريس"         },
    { src:"/icons/coptic/4.jpg", title:"Saint Mary of Egypt",        titleAR:"القديسة مريم المصرية",          medium:"Egg Tempera on Lime Wood",        mediumAR:"تمبيرا بيض على خشب الزيزفون",         dims:"25 × 35 cm", year:"2024", location:"Private Collection, London",  locationAR:"مجموعة خاصة، لندن"          },
    { src:"/icons/coptic/5.jpg", title:"Presentation in the Temple", titleAR:"تقديم الرب في الهيكل",          medium:"Traditional Coptic Pigments",     mediumAR:"أصباغ قبطية تقليدية",                 dims:"50 × 70 cm", year:"2022", location:"Coptic Museum, Cairo",        locationAR:"المتحف القبطي، القاهرة"      },
    { src:"/icons/coptic/6.jpg", title:"Saint Anthony the Great",    titleAR:"القديس أنطونيوس الكبير",        medium:"Egg Tempera & Gold Leaf on Wood", mediumAR:"تمبيرا بيض وورق ذهب على خشب",         dims:"30 × 45 cm", year:"2021", location:"St. Anthony's Monastery",     locationAR:"دير القديس أنطونيوس"         },
    { src:"/icons/coptic/7.jpg", title:"The Virgin Enthroned",       titleAR:"العذراء على العرش",             medium:"Mineral Pigments on Panel",       mediumAR:"أصباغ معدنية على لوح",                dims:"40 × 55 cm", year:"2023", location:"Private Collection, New York",locationAR:"مجموعة خاصة، نيويورك"       },
    { src:"/icons/coptic/8.jpg", title:"Saint George the Martyr",    titleAR:"القديس جرجس الشهيد",            medium:"Traditional Byzantine on Canvas", mediumAR:"أسلوب بيزنطي تقليدي على قماش",        dims:"45 × 60 cm", year:"2020", location:"St. George's Church, Cairo",  locationAR:"كنيسة مار جرجس، القاهرة"    },
  ],
  oil: [
    { src:"/icons/oil/1.jpg", title:"The Annunciation",           titleAR:"البشارة",                   medium:"Oil on Belgian Linen",           mediumAR:"زيت على كتان بلجيكي",          dims:"80 × 100 cm", year:"2023", location:"Private Collection, Dubai",    locationAR:"مجموعة خاصة، دبي"       },
    { src:"/icons/oil/2.jpg", title:"Archangel Michael",          titleAR:"رئيس الملائكة ميخائيل",    medium:"Oil & Gold Leaf on Canvas",      mediumAR:"زيت وورق ذهب على قماش",        dims:"60 × 90 cm",  year:"2022", location:"St. Michael's, Jordan",        locationAR:"كنيسة مار ميخائيل، الأردن" },
    { src:"/icons/oil/3.jpg", title:"The Resurrection",           titleAR:"القيامة",                   medium:"Oil on Linen with Gold Accents", mediumAR:"زيت على كتان مع لمسات ذهبية",  dims:"70 × 95 cm",  year:"2024", location:"Private Collection, Geneva",   locationAR:"مجموعة خاصة، جنيف"      },
    { src:"/icons/oil/4.jpg", title:"Holy Trinity",               titleAR:"الثالوث الأقدس",            medium:"Oil on Panel",                   mediumAR:"زيت على لوح",                   dims:"50 × 70 cm",  year:"2021", location:"Private Collection, Riyadh",   locationAR:"مجموعة خاصة، الرياض"    },
    { src:"/icons/oil/5.jpg", title:"The Transfiguration",        titleAR:"التجلي",                    medium:"Oil on Belgian Linen",           mediumAR:"زيت على كتان بلجيكي",          dims:"75 × 100 cm", year:"2022", location:"Private Collection, Abu Dhabi",locationAR:"مجموعة خاصة، أبوظبي"    },
    { src:"/icons/oil/6.jpg", title:"The Last Supper",            titleAR:"العشاء الأخير",             medium:"Oil & Gold Leaf on Canvas",      mediumAR:"زيت وورق ذهب على قماش",        dims:"120 × 60 cm", year:"2023", location:"Private Collection, Beirut",   locationAR:"مجموعة خاصة، بيروت"     },
    { src:"/icons/oil/7.jpg", title:"Saint Joseph the Carpenter", titleAR:"القديس يوسف النجار",       medium:"Oil on Linen",                   mediumAR:"زيت على كتان",                  dims:"55 × 75 cm",  year:"2021", location:"Private Collection, Cairo",    locationAR:"مجموعة خاصة، القاهرة"   },
    { src:"/icons/oil/8.jpg", title:"The Pietà",                  titleAR:"النواح على المسيح",         medium:"Oil on Panel with Gold Leaf",    mediumAR:"زيت على لوح مع ورق ذهب",       dims:"65 × 85 cm",  year:"2024", location:"Private Collection, Milan",    locationAR:"مجموعة خاصة، ميلان"     },
  ],
};

export const defaultVariousWorks: ArtItem[] = [
  { src:"/icons/variousWorks/1.jpg", title:"Sacred Vessel",      titleAR:"إناء مقدس",    medium:"Egg Tempera & 24K Gold Leaf", mediumAR:"تمبيرا بيض وورق ذهب عيار 24", dims:"45 × 60 cm", year:"2021", location:"Private Collection, Beirut",  locationAR:"مجموعة خاصة، بيروت"  },
  { src:"/icons/variousWorks/2.jpg", title:"The Pilgrim's Path", titleAR:"طريق الحاج",   medium:"Mineral Pigments on Panel",   mediumAR:"أصباغ معدنية على لوح",         dims:"30 × 40 cm", year:"2022", location:"Cairo, Egypt",                locationAR:"القاهرة، مصر"         },
  { src:"/icons/variousWorks/3.jpg", title:"Light of the East",  titleAR:"نور الشرق",    medium:"Egg Tempera & Gold Leaf",     mediumAR:"تمبيرا بيض وورق ذهب",          dims:"40 × 55 cm", year:"2023", location:"Private Collection, Amman",   locationAR:"مجموعة خاصة، عمّان"  },
  { src:"/icons/variousWorks/4.jpg", title:"Vessels of Silence", titleAR:"أواني الصمت",  medium:"Traditional Pigments",        mediumAR:"أصباغ تقليدية",                dims:"50 × 70 cm", year:"2020", location:"Holy Family Church, Egypt",   locationAR:"كنيسة العائلة المقدسة، مصر" },
  { src:"/icons/variousWorks/5.jpg", title:"The Contemplative",  titleAR:"المتأمل",      medium:"Egg Tempera on Lime Wood",    mediumAR:"تمبيرا بيض على خشب الزيزفون", dims:"35 × 50 cm", year:"2022", location:"Private Collection, London",  locationAR:"مجموعة خاصة، لندن"   },
  { src:"/icons/variousWorks/6.jpg", title:"Eternal Light",      titleAR:"النور الأبدي", medium:"Mineral Pigments & Gold Leaf",mediumAR:"أصباغ معدنية وورق ذهب",        dims:"45 × 65 cm", year:"2023", location:"Private Collection, Paris",   locationAR:"مجموعة خاصة، باريس"  },
  { src:"/icons/variousWorks/7.jpg", title:"The Offering",       titleAR:"القربان",      medium:"Traditional Byzantine",       mediumAR:"أسلوب بيزنطي تقليدي",          dims:"40 × 55 cm", year:"2021", location:"Private Collection, Dubai",   locationAR:"مجموعة خاصة، دبي"    },
  { src:"/icons/variousWorks/8.jpg", title:"Desert Father",      titleAR:"أب الصحراء",   medium:"Egg Tempera on Panel",        mediumAR:"تمبيرا بيض على لوح",           dims:"30 × 45 cm", year:"2024", location:"Private Collection, Geneva",  locationAR:"مجموعة خاصة، جنيف"   },
];

export const defaultMurals: MuralItem[] = [
  { src:"/icons/oil/4.jpg",     title:"The Pantocrator Dome",    titleAR:"قبة المسيح الضابط الكل", location:"St. Mary's Cathedral, Jordan",   locationAR:"كاتدرائية السيدة العذراء، الأردن", medium:"Fresco Technique",         mediumAR:"تقنية الفريسكو",          size:"120 sqm", year:"2021–2022" },
  { src:"/icons/ancient/1.jpg", title:"The Last Supper",         titleAR:"العشاء الأخير",          location:"St. George's Church, Cairo",     locationAR:"كنيسة مار جرجس، القاهرة",          medium:"Acrylic on Plaster",       mediumAR:"أكريليك على الجص",       size:"85 sqm",  year:"2020"      },
  { src:"/icons/oil/1.jpg",     title:"The Ascension",           titleAR:"الصعود إلى السماء",      location:"Holy Family Monastery, Egypt",   locationAR:"دير العائلة المقدسة، مصر",          medium:"Fresco Secco",             mediumAR:"فريسكو سيكو",             size:"60 sqm",  year:"2023"      },
  { src:"/icons/ancient/2.jpg", title:"Angels in the Sanctuary", titleAR:"الملائكة في الهيكل",     location:"St. Bishoy Cathedral, Lebanon",  locationAR:"كاتدرائية القديس بيشوي، لبنان",    medium:"Gold Leaf & Fresco",       mediumAR:"ورق ذهب وفريسكو",        size:"45 sqm",  year:"2022"      },
  { src:"/icons/oil/3.jpg",     title:"The Transfiguration",     titleAR:"التجلي",                 location:"St. Anthony's Monastery, Egypt", locationAR:"دير القديس أنطونيوس، مصر",         medium:"Mineral Pigments on Wall", mediumAR:"أصباغ معدنية على الجدار", size:"70 sqm",  year:"2019"      },
];

export const defaultConfig: GalleryConfig = {
  heroSrc: "/hero.png",
  galleryData: defaultGalleryData,
  variousWorks: defaultVariousWorks,
  murals: defaultMurals,
};

/* ══════════════════════════════════
   Supabase load / save
══════════════════════════════════ */
export async function loadConfig(): Promise<GalleryConfig> {
  try {
    const { data, error } = await supabase
      .from("gallery_config")
      .select("config")          // ✅ "config" مش "data"
      .eq("id", 1)
      .maybeSingle();

    if (error) throw error;
    if (!data?.config || Object.keys(data.config).length === 0)
      return defaultConfig;

    const p = data.config as Partial<GalleryConfig>;
    return {
      heroSrc:      p.heroSrc      || defaultConfig.heroSrc,
      galleryData:  p.galleryData  || defaultConfig.galleryData,
      variousWorks: p.variousWorks || defaultConfig.variousWorks,
      murals:       p.murals       || defaultConfig.murals,
    };
  } catch (err) {
    console.error("loadConfig error:", err);
    return defaultConfig;
  }
}

export async function saveConfig(cfg: GalleryConfig): Promise<void> {
  const { error } = await supabase
    .from("gallery_config")
    .upsert({ id: 1, config: cfg, updated_at: new Date().toISOString() }, { onConflict: "id" }); // ✅ "config" مش "data"

  if (error) throw new Error(error.message);
}

/* ══════════════════════════════════
Image upload to Supabase Storage
══════════════════════════════════ */
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