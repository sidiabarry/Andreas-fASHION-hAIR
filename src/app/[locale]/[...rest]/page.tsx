import { notFound } from "next/navigation";

/** Alles, was es unter /<sprache>/ nicht gibt, bekommt die gestaltete 404-Seite. */
export default function CatchAll() {
  notFound();
}
