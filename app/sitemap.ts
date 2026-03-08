export default function sitemap() {
  const base = "https://walid-makram.vercel.app";
  return [
    { url: `${base}/`,                lastModified: new Date() },
    { url: `${base}/gallery/ancient`, lastModified: new Date() },
    { url: `${base}/gallery/coptic`,  lastModified: new Date() },
    { url: `${base}/gallery/oil`,     lastModified: new Date() },
    { url: `${base}/gallery/murals`,  lastModified: new Date() },
    { url: `${base}/gallery/various`, lastModified: new Date() },
  ];
}