/**
 * Scene data for the scroll-scrub journey.
 *
 * One continuous 15 s master film (embers become phoenix wings of light, the
 * wings become hair) is cut into three contiguous segments, so every seam is
 * the next frame of the same take. Each poster is the first frame of the
 * encoded clip beside it.
 *
 * Keep this array a module constant.
 */
import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#e0a526",
  background: "#100e0d",
  ink: "#f4efe8",
  muted: "#b7ada3",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    body: "Echthaar, Haar für Haar von Hand gearbeitet. Für den Morgen, an dem Sie sich im Spiegel wiedererkennen.",
    clip: "/assets/world/scene-01.mp4",
    id: "neubeginn",
    kicker: "Andrea's Fashion Hair",
    label: "Neubeginn",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    mobilePoster: "/assets/world/scene-01-mobile-poster.jpg",
    poster: "/assets/world/scene-01-poster.jpg",
    scroll: 1.5,
    title: "Wie neu geboren.",
  },
  {
    body: "Es ist, wer Sie sind. Wer sein Haar verliert, verliert ein Stück Sicherheit. Der Phönix in unserem Zeichen steht für den Tag, an dem sie zurückkommt.",
    clip: "/assets/world/scene-02.mp4",
    id: "identitaet",
    label: "Identität",
    mobileClip: "/assets/world/scene-02-mobile.mp4",
    mobilePoster: "/assets/world/scene-02-mobile-poster.jpg",
    poster: "/assets/world/scene-02-poster.jpg",
    scroll: 1.5,
    title: "Es ist nicht nur Haar.",
  },
  {
    body: "Hauchdünne Nano-Skin-Basis, jedes Haar einzeln injiziert, freier Scheitel. Sie spüren Ihr Stück kaum. Andere sehen es gar nicht.",
    clip: "/assets/world/scene-03.mp4",
    id: "unsichtbar",
    label: "Unsichtbar",
    mobileClip: "/assets/world/scene-03-mobile.mp4",
    mobilePoster: "/assets/world/scene-03-mobile-poster.jpg",
    poster: "/assets/world/scene-03-poster.jpg",
    scroll: 1.5,
    tags: ["100 % Echthaar", "Freier Scheitel", "In Sekunden aufgesetzt"],
    title: "Niemand sieht einen Übergang.",
  },
];
