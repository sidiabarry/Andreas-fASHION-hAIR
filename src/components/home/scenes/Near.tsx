import { Arrow } from "@/components/Arrow";
import { Link } from "@/i18n/navigation";

import { RealCycler, type Shot } from "../RealCycler";
import { Words } from "../Words";

/**
 * „Kommen Sie näher“: Kinoformat mit langsamer Kamerafahrt über die Detailaufnahmen (Clip, Tresse,
 * Tape). Läuft von selbst, hält bei Zeiger/Fokus und mit dem Pause-Schalter.
 */
export function Near({ t, shots, progress }: { t: { kicker: string; title: string; lead: string; cta: string }; shots: Shot[]; progress: string[] }) {
  return (
    <section aria-labelledby="near-title" className="near" data-fx="dust" data-fx-a="0.3" data-fx-s="1">
      <div className="af-wrap">
        <header className="near__head">
          <div>
            <p className="h-eyebrow h-in">{t.kicker}</p>
            <h2 className="h-title h-in" id="near-title">
              <Words text={t.title} />
            </h2>
          </div>
          <div className="near__aside h-in">
            <p className="h-lead">{t.lead}</p>
            <Link className="h-link" href="/extensions">
              {t.cta} <Arrow />
            </Link>
          </div>
        </header>
        <div className="h-in">
          <RealCycler progress={progress} shots={shots} />
        </div>
      </div>
    </section>
  );
}
