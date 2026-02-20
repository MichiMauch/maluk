export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  youtubeId?: string;
  startSeconds?: number;
}

export const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/auto.webp", alt: "Rennwagen auf der Strecke" },
  { src: "/images/gallery/az1.webp", alt: "Ayent-Anzère Bergrennen" },
  { src: "/images/gallery/az2.webp", alt: "Ayent-Anzère Action" },
  { src: "/images/gallery/az3.webp", alt: "Ayent-Anzère Kurvenfahrt" },
  { src: "/images/gallery/az4.webp", alt: "Ayent-Anzère Panorama" },
  { src: "/images/gallery/dsc00811.webp", alt: "Motorsport Impression" },
  { src: "/images/gallery/dsc02111.webp", alt: "Rennszene" },
  { src: "/images/gallery/dsc09743_dxo.webp", alt: "Rennfahrer in Aktion" },
  { src: "/images/gallery/gg1.webp", alt: "Gurnigel Bergrennen" },
  { src: "/images/gallery/lr1.webp", alt: "La Roche – La Berra" },
  { src: "/images/gallery/lr2.webp", alt: "La Roche – La Berra Action" },
  { src: "/images/gallery/lr3.webp", alt: "La Roche – La Berra Kurve" },
  { src: "/images/gallery/oh1.webp", alt: "Oberhallau Bergrennen" },
  { src: "/images/gallery/oh2.webp", alt: "Oberhallau Action" },
  { src: "/images/gallery/reitnau-1.webp", alt: "Bergrennen Reitnau" },
  { src: "/images/gallery/reitnau-2.webp", alt: "Bergrennen Reitnau Action" },
  {
    src: "https://img.youtube.com/vi/4b5yW1kgSTg/maxresdefault.jpg",
    alt: "YouTube Video – Bergrennen",
    youtubeId: "4b5yW1kgSTg",
  },
  {
    src: "https://img.youtube.com/vi/N1SRVlroKWE/maxresdefault.jpg",
    alt: "YouTube Video – Rennszene",
    youtubeId: "N1SRVlroKWE",
  },
  {
    src: "https://img.youtube.com/vi/TPiVAVzI2Cs/maxresdefault.jpg",
    alt: "YouTube Video – Motorsport",
    youtubeId: "TPiVAVzI2Cs",
  },
  {
    src: "https://img.youtube.com/vi/jEnxDvkGf6w/maxresdefault.jpg",
    alt: "YouTube Video – Rennen Highlights",
    youtubeId: "jEnxDvkGf6w",
    startSeconds: 71,
  },
];
