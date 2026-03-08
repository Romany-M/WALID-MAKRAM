import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://walid-makram.vercel.app";
  return [
    { url: base,                          lastModified: new Date(), priority: 1.0   },
    { url: `${base}/gallery/ancient`,     lastModified: new Date(), priority: 0.9   },
    { url: `${base}/gallery/coptic`,      lastModified: new Date(), priority: 0.9   },
    { url: `${base}/gallery/oil`,         lastModified: new Date(), priority: 0.9   },
    { url: `${base}/gallery/murals`,      lastModified: new Date(), priority: 0.9   },
    { url: `${base}/gallery/various`,     lastModified: new Date(), priority: 0.8   },
  ];
}