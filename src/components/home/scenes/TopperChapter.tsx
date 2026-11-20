import type { ReactNode } from "react";

import { Arrow } from "@/components/Arrow";
import type { CategoryId } from "@/data/catalog";
import { Link } from "@/i18n/navigation";

import { Chapter } from "../Chapter";
import { Words } from "../Words";

type TopperTexts = { chapter: string; kicker: string; title: string; lead: string; needsLabel: string; cta: string; consult: string };

/**
 * Kapitel II – Topper und Perücken. Zentrierter Auftakt, darunter eine Reihe echter Einzelstücke
 * (das erste groß), dann die Situationen als ruhige Wegweiser in die Kollektion. Ein Hauptknopf.
 */
export function TopperChapter({ t, cards, needs }: { t: TopperTexts; cards: ReactNode[]; needs: { id: CategoryId; label: string; need: string }[] }) {
  return (
    <section aria-labelledby="topper-title" className="tc" data-fx="halo" data-fx-a="0.3" data-fx-ma="0.18" data-fx-s="0.6" data-fx-x="0" data-fx-y="0.55">
      <div className="af-wrap">
        <header className="tc__head">
          <Chapter label={t.chapter} numeral="II" />
          <p className="h-eyebrow h-in">{t.kicker}</p>
          <h2 className="h-title h-in" id="topper-title">
            <Words text={t.title} />
          </h2>
          <p className="h-lead h-in">{t.lead}</p>
        </header>
        <div className="tc__row">{cards}</div>
        <nav aria-label={t.needsLabel} className="tc__needs h-in">
          <p className="h-micro">{t.needsLabel}</p>
          <ul>
            {needs.map((n) => (
              <li key={n.id}>
                <Link href={{ pathname: "/kollektion", query: { kategorie: n.id } }}>
                  <span className="tc__need">{n.need}</span>
                  <span className="tc__cat">
                    {n.label} <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="tc__cta h-in">
          <Link className="h-btn h-btn--gold" href={{ pathname: "/kollektion", query: { kategorie: "topper" } }}>
            <span>{t.cta}</span> <Arrow />
          </Link>
          <p className="h-note">{t.consult}</p>
        </div>
      </div>
    </section>
  );
}
