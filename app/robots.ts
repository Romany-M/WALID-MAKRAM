import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://walid-makram.vercel.app/sitemap.xml",
    host: "https://walid-makram.vercel.app",
  };
}