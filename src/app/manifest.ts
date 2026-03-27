import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MALUK Racing",
    short_name: "MALUK",
    description: "Bergrennen-Pilot Lukas Maurer und sein Opel Kadett C GT/E",
    start_url: "/",
    display: "browser",
    background_color: "#0f0506",
    theme_color: "#FFD600",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
