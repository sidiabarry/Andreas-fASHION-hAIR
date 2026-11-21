import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#100e0d",
    description: "Echthaar-Topper, Perücken und Haarsysteme aus der HaarManufaktur.",
    display: "browser",
    icons: [
      { sizes: "any", src: "/icon.svg", type: "image/svg+xml" },
      { sizes: "192x192", src: "/icon-192.png", type: "image/png" },
      { sizes: "512x512", src: "/icon-512.png", type: "image/png" },
    ],
    lang: "de",
    name: "Andrea's Fashion Hair",
    short_name: "Andrea's",
    start_url: "/",
    theme_color: "#100e0d",
  };
}
