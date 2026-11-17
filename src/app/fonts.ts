import { Cormorant_Garamond, Geist, Geist_Mono, Pinyon_Script } from "next/font/google";

/**
 * Schriften (alle SIL Open Font License 1.1). next/font lädt sie beim Build herunter und liefert
 * sie von der eigenen Domain aus: Im Browser gibt es keine Anfrage an Google.
 */
export const geistSans = Geist({ display: "swap", subsets: ["latin", "latin-ext"], variable: "--font-geist-sans" });
export const geistMono = Geist_Mono({ display: "swap", subsets: ["latin", "latin-ext"], variable: "--font-geist-mono", weight: ["400", "500"] });
export const serif = Cormorant_Garamond({
  display: "swap",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  weight: ["500", "600"],
});
export const script = Pinyon_Script({ display: "swap", subsets: ["latin", "latin-ext"], variable: "--font-script", weight: "400" });

export const fontVariables = [geistSans.variable, geistMono.variable, serif.variable, script.variable].join(" ");
