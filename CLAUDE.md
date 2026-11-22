# Andrea's Fashion Hair – Arbeitsregeln für Claude

Shop der HaarManufaktur von Andreia Pereira Da Costa („Andrea“), Iserlohn: Echthaar-Topper, Perücken, Pony, Haarsysteme, Pflege; Extensions (6 Methoden) nur auf Anfrage. Next.js 16 App Router, React 19, TS, next-intl, Vercel. Ton: ruhig, würdevoll, ehrlich – nie mitleidig, nie marktschreierisch.

Diese Datei lädt **jeder** Agent komplett. Kurz halten; Details stehen in `docs/` und werden nur bei Bedarf gelesen.

## Befehle

- `npm run wt:prepare` – zuerst in jedem frischen Worktree (node_modules per Hardlink, Routentypen, eigener Port)
- `npm run verify` – Lint + Typecheck + Unit-Tests (schnell, vor jedem Commit)
- `npm run build` – Production-Build inkl. `check:launch` (Warnmodus)
- `AFH_DEMO=1 npx next dev -p <PORT>` – Demo-Modus mit Kasse; Port aus `wt:prepare`
- `npm run check:launch` – fehlende Pflichtangaben

## Wo was liegt (Zuständigkeit = Agent in `.claude/agents/`)

| Bereich | Dateien | Agent |
| --- | --- | --- |
| Startseite, „Über Andrea“, Partikel/Film | `src/app/[locale]/page.tsx`, `ueber-andrea/`, `src/components/home/**`, `src/components/fx/**`, `globals.css` (nur `af-home*`/neue Tokens) | `home-design` |
| Kollektion, Produkt, Warenkorb, Kasse, Bestellung | `kollektion/ produkt/ warenkorb/ kasse/ bestellung/`, `src/components/{product,cart}/**`, `src/lib/{cart,order,money}.ts` | `shop-conversion` |
| Rechtstexte, Firmendaten, Launch-Sperre | `src/content/legal/**`, `src/config/**`, `scripts/check-launch.ts`, `docs/COMPLIANCE.md` | `legal-compliance` |
| Übersetzungen | `src/messages/**`, `scripts/catalog-i18n/**`, `src/i18n/**` | `i18n` |
| Plattform, Sicherheit, Server, DB | `next.config.ts`, `src/proxy.ts`, `src/server/**`, `src/app/api/**`, `supabase/**`, `src/lib/{seo,jsonld,validation}.ts` | `platform` |
| Prüfen (Build, Tests, Screenshots, axe) | nur lesen/ausführen | `qa` |
| Code finden, Fragen beantworten | nur lesen | `scout` |

Gemeinsam genutzt (nur ergänzen, nie umbenennen): Tokens in `globals.css` (`docs/DESIGN-TOKENS.md`), `src/data/catalog.ts`-API, `useCart()`, `Link` aus `@/i18n/navigation`. Schnittstellen: `docs/ARCHITEKTUR.md`.

## Harte Regeln

1. **Nichts erfinden.** Keine Fakten, Zahlen, Bewertungen, Zitate, Preise, Rechtsangaben. Unbekanntes bleibt `null` bzw. wird als offene Frage gemeldet. Quelle für Andrea: `docs/ANDREA-GESCHICHTE.md`.
2. Keine Heilversprechen, keine Krankenkassen-Aussagen, keine Countdowns, Streichpreise, Fake-Knappheit (echt ist nur: jedes Stück gibt es einmal).
3. Kein Drittanbieter im Browser (keine CDNs, Fonts, Analytics, Embeds) – sonst wird ein Cookie-Banner nötig. CSP mit Nonce: keine Inline-Skripte.
4. Server Components als Standard; `"use client"` nur wo Interaktion nötig ist. Preise nur serverseitig aus dem Katalog.
5. Jede sichtbare Zeichenkette über `src/messages/<lang>.json` (de, en, fr, es freigeschaltet). Neue Schlüssel immer in **allen** freigeschalteten Sprachen anlegen.
6. Bewegung: transform/opacity, `prefers-reduced-motion` und Pause-Schalter respektieren, Zielgröße ≥ 44 px, Kontrast laut Tokens.
7. Commit-Nachrichten auf Deutsch, kurz, im Stil der bisherigen Historie.

## Arbeitsweise mit Agenten (Token sparen)

- **Orchestrator** (Hauptsitzung) plant, verteilt, merged, pusht. Er liest keine großen Dateien selbst, sondern fragt `scout`.
- Schreibende Agenten arbeiten **im eigenen Worktree** (`isolation: worktree`), committen dort und nennen am Ende den Branch. Der Orchestrator merged in den Arbeitsbranch; nur er pusht.
- **Übergaben über Dateien, nicht über den Chat:** ausführliche Ergebnisse nach `$COORD/findings/<agent>-<thema>.md` im eigenen Worktree (`$COORD` gibt `wt:prepare` aus; Agenten dürfen nicht außerhalb ihres Worktrees schreiben). Antwort an den Orchestrator: höchstens 10 Zeilen – Ergebnis, Branch, Pfad zur Notiz, offene Fragen.
- Gezielt lesen: erst `Grep`/`Glob`, dann `Read` mit `offset/limit`. Nie lesen: `package-lock.json`, `.next/`, Fotos in `public/assets/originals/`, übersetzte Rechtstexte, wenn Deutsch reicht.
- Befehlsausgaben kürzen (`| tail -20`, `grep -E "error|fail"`). Screenshots für eigene Prüfung mit `deviceScaleFactor: 1`.
- Unabhängige Aufgaben parallel starten; nie zwei Agenten auf dieselben Dateien.
