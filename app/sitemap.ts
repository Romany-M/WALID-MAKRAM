import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://walid-makram.vercel.app";
  const now  = new Date();

  return [
    {
      url            : `${base}/`,
      lastModified   : now,
      changeFrequency: "monthly",
      priority       : 1.0,
    },
    {
      url            : `${base}/gallery/ancient`,
      lastModified   : now,
      changeFrequency: "weekly",
      priority       : 0.9,
    },
    {
      url            : `${base}/gallery/coptic`,
      lastModified   : now,
      changeFrequency: "weekly",
      priority       : 0.9,
    },
    {
      url            : `${base}/gallery/oil`,
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
      url            : `${base}/gallery/various`,
      lastModified   : now,
      changeFrequency: "weekly",
      priority       : 0.8,
    },
  ];
}