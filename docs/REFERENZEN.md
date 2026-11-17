# Referenzen für Startseite und „Über Andrea“

Recherche November 2026 (WebSearch, Playwright-Screenshots Desktop 1440×900 und Handy 390×844, abgelegt im Scratchpad des Design-Agenten unter `afh-refs/`). Übernommen wird nur das **Prinzip**, nie Texte, Bilder, Code oder Markenzeichen.

Ehrliche Einschränkung: Mehrere Luxusseiten (Hermès, Aesop, Daniel Alain/Follea) blockieren automatisierte Browser mit Bot-Schutz, WebGL-Studios (Lusion, Igloo Inc.) rendern im Headless-Chromium ohne GPU nur Ladebildschirme. Ihre Beschreibung stützt sich deshalb teils auf Fallstudien, Award-Einträge und eigene Kenntnis der Seiten.

| Referenz | Was sie stark macht | Was wir als Prinzip übernehmen |
| --- | --- | --- |
| **Cartier „365 – A Year of Cartier“** (365ayearof.cartier.com, Awwwards Site of the Day; Agentur 14islands) | Versal-Antiqua und kursive Kleinbuchstaben in einer Zeile („LOVE *that* SETS…“), Film als Bühne, automatisch weiterlaufende Kapitel mit feinen Fortschrittsstrichen, sehr viel Dunkel und Ruhe | Gemischte Display-Zeile (Antiqua aufrecht + kursiv) für die Schlagzeilen, Kapitel-Striche mit Laufbalken im Hero, Film nur als Lichtquelle hinter der Typografie |
| **Cartier Watches & Wonders 2025** (Awwwards Site of the Month 08/2025) | Produkt als Juwel im Lichtkegel, langsame Kamerafahrten, keine Hast | Produktfotos im Lichtkegel mit Goldkante; Ken-Burns-Fahrten über Scheitel und Ansatz statt Karussell |
| **Igloo Inc.** (igloo.inc, Awwwards Site of the Year 2024) | Partikel-/Eiswelt, in der Form aus Teilchen entsteht und wieder zerfällt; Übergänge sind Materialverwandlungen | Partikel sammeln sich zu einer Form (Phönix) und zerfallen in eine nächste (Strähnen, Tresse, Spiegelring) – Übergang als Verwandlung, nicht als Schnitt |
| **Lusion** (lusion.co, mehrfach Awwwards) | Ein durchgehendes WebGL-Feld hinter der ganzen Seite, das auf Zeiger reagiert | Ein einziges seitenweites Feld mit sanfter Zeiger-Verdrängung, gesteuert über `data-fx` je Szene |
| **Aesop** (aesop.com) | Material und Licht statt Farbe, ruhige Serifen, viel Abstand, Produktseiten mit Anwendung/Gefühl/Inhalt nebeneinander | „Wie es hält und sich anfühlt“ als ruhige Dreiteilung, Papier-/Körnungs-Material, keine Knallfarben |
| **Byredo** (byredo.com) | Große zentrierte Marke, Bilder randlos, Warenkorb immer sichtbar, sehr wenig Text | Klare Wortmarke über dem Film, Warenkorb des Fundaments bleibt sichtbar, wenig Text pro Bildschirm |
| **Hermès** (hermes.com) | Handwerk als Erzählung („les mains“), Illustration statt Stock | Handwerk als Kapitel mit echten Werkstattbegriffen aus dem Katalog (Nano-Skin, von Hand injiziert, freier Scheitel) |
| **Follea / Daniel Alain** (danielalain.com) | Haarersatz als Luxus statt Hilfsmittel; Beratung („consultation“) immer sichtbar; würdevolle Sprache ohne Krankheitsbilder | Beratung per WhatsApp als ständige, leise Option; Sprache: Situation benennen, nie „behandeln“ |
| **Vorlage BP Agentics** (bp-agentics-site-…vercel.app; Code `src/signal/**`) | Partikel-Engine in reinem WebGL2, ein Draw-Call, Formwechsel mit Spiralwirbel und Stagger; Kapitel-Tabs mit Pause-Knopf; Serifen-Schlagzeile | Gleiche technische Disziplin (ein Draw-Call, zeitbasierter Morph, Pause bei Tab-Wechsel), aber: dunkles Atelier statt Creme, additives Gold-Licht mit Tiefenunschärfe statt Tech-Punktwolke, automatischer Ablauf statt Scroll-Kopplung, mehr Ruhe |

## Conversion und Vertrauen (Quellen und Prinzipien)

- **Baymard Institute, Luxury E-Commerce Benchmark** (baymard.com/research-articles/2021-luxury-ecommerce-benchmark): Luxus-Startseiten und Produktseiten schneiden gut ab, wenn Bildwelt und Produktinformation zusammenkommen; Schwächen liegen bei Suche/Filter. → Bedarfs-Einstieg („Was fehlt Ihnen gerade?“) statt Suchfeld.
- **Rückgabe und Kosten vor dem Kauf sichtbar**: Häufig zitierte Baymard-Befunde (unerwartete Kosten als häufigster Abbruchgrund, Rückgabe-Regel als Abbruchgrund) – nur sekundär belegt. → Versandkosten, Lieferzeit und 14 Tage Rückgabe stehen neben jedem Kauf- und Anfrageknopf, Werte aus `src/config/shipping.ts`.
- **Sensible Käufe (Haarersatz)**: Vertrauen entsteht durch eine echte Person, eigene Betroffenheit, Beratung vor dem Kauf und kein Risiko beim Bezahlen. → Andrea mit eigener Geschichte, „Sie bezahlen erst nach persönlicher Bestätigung“, Foto-Beratung per WhatsApp.
- Bewusst **nicht** übernommen: Bewertungs-Sterne, Kundenzahlen, Countdown, Streichpreise, „nur noch X“ (außer echter Einzelstück-Hinweis), Pop-ups, Exit-Intents.

## Quellen

- https://www.14islands.com/work/cartier365
- https://365ayearof.cartier.com/
- https://www.awwwards.com/ (Einträge Cartier 365, Cartier Watches & Wonders 2025, Igloo Inc.)
- https://baymard.com/research-articles/2021-luxury-ecommerce-benchmark
- https://baymard.com/ux-benchmark/collections/luxury-goods
- https://www.aesop.com/de/ · https://www.byredo.com/ · https://www.hermes.com/de/de/ · https://www.danielalain.com/ · https://lusion.co/ · https://www.igloo.inc/
