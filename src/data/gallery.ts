export type GalleryCategory = "bilder" | "video";

export const categoryLabels: Record<GalleryCategory, string> = {
  bilder: "Bilder",
  video: "Videos",
};

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  category: GalleryCategory;
  youtubeId?: string;
  startSeconds?: number;
}

export const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/auto.webp", alt: "Rennwagen auf der Strecke", category: "bilder" },
  { src: "/images/gallery/az1.webp", alt: "Ayent-Anzère Bergrennen", category: "bilder" },
  { src: "/images/gallery/az2.webp", alt: "Ayent-Anzère Action", category: "bilder" },
  { src: "/images/gallery/az3.webp", alt: "Ayent-Anzère Kurvenfahrt", category: "bilder" },
  { src: "/images/gallery/az4.webp", alt: "Ayent-Anzère Panorama", category: "bilder" },
  { src: "/images/gallery/dsc00811.webp", alt: "Motorsport Impression", category: "bilder" },
  { src: "/images/gallery/dsc02111.webp", alt: "Rennszene", category: "bilder" },
  { src: "/images/gallery/dsc09743_dxo.webp", alt: "Rennfahrer in Aktion", category: "bilder" },
  { src: "/images/gallery/gg1.webp", alt: "Gurnigel Bergrennen", category: "bilder" },
  { src: "/images/gallery/lr1.webp", alt: "La Roche – La Berra", category: "bilder" },
  { src: "/images/gallery/lr2.webp", alt: "La Roche – La Berra Action", category: "bilder" },
  { src: "/images/gallery/lr3.webp", alt: "La Roche – La Berra Kurve", category: "bilder" },
  { src: "/images/gallery/oh1.webp", alt: "Oberhallau Bergrennen", category: "bilder" },
  { src: "/images/gallery/oh2.webp", alt: "Oberhallau Action", category: "bilder" },
  { src: "/images/gallery/reitnau-1.webp", alt: "Bergrennen Reitnau", category: "bilder" },
  { src: "/images/gallery/reitnau-2.webp", alt: "Bergrennen Reitnau Action", category: "bilder" },
  {
    src: "https://img.youtube.com/vi/4b5yW1kgSTg/maxresdefault.jpg",
    alt: "YouTube Video – Bergrennen",
    category: "video",
    youtubeId: "4b5yW1kgSTg",
  },
  {
    src: "https://img.youtube.com/vi/N1SRVlroKWE/maxresdefault.jpg",
    alt: "YouTube Video – Rennszene",
    category: "video",
    youtubeId: "N1SRVlroKWE",
  },
  {
    src: "https://img.youtube.com/vi/TPiVAVzI2Cs/maxresdefault.jpg",
    alt: "YouTube Video – Motorsport",
    category: "video",
    youtubeId: "TPiVAVzI2Cs",
  },
  {
    src: "https://img.youtube.com/vi/jEnxDvkGf6w/maxresdefault.jpg",
    alt: "YouTube Video – Rennen Highlights",
    category: "video",
    youtubeId: "jEnxDvkGf6w",
    startSeconds: 71,
  },
];
