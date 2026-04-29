import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://walidmakram.art";
  const now  = new Date();

  return [
    {
      url            : `${base}/`,
      lastModified   : now,
      changeFrequency: "monthly",
      priority       : 1.0,
    },
    {
      url            : `${base}/gallery/icons`,
      lastModified   : now,
      changeFrequency: "weekly",
      priority       : 0.9,
    },
    {
      url            : `${base}/gallery/gilding`,
      lastModified   : now,
      changeFrequency: "weekly",
      priority       : 0.9,
    },
    {
      url            : `${base}/gallery/mosaic`,
      lastModified   : now,
      changeFrequency: "weekly",
      priority       : 0.9,
    },
    {
      url            : `${base}/gallery/murals`,
      lastModified   : now,
      changeFrequency: "weekly",
      priority       : 0.9,
    },
    {
      url            : `${base}/gallery/exhibitions`,
      lastModified   : now,
      changeFrequency: "weekly",
      priority       : 0.8,
    },
  ];
}