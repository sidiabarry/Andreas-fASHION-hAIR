# shop-conversion: Effekte im Shop (shop-fx)

## Geändert
- Formulare: `af-ui-field` (Input/Textarea/Select), `af-ui-select`, `af-ui-check` (Checkbox/Radio) in forms/*, Checkout, CartView (Menge), SortSelect, NewsletterForm. `af-ui-loading` an den Absende-Knöpfen (Anfrage, Widerruf, Kasse, Newsletter), zusätzlich `aria-busy`.
- Galerie: `data-lens` am Hauptbild; Karten: `data-tilt` am Kartenbild plus Glanzlicht (CSS an `--rx/--ry`). `data-magnetic` an AddToCart, StickyBuyBar, Kasse-Knopf.
- 404: dunkle Bühne mit `HairStage`, Hauptknopf Kollektion (magnetisch), Nebenlink Extensions. Neuer Schlüssel `notFound.extensions` in de/en/fr/es (fr/es von mir übersetzt, bitte i18n prüfen).
- CSS am Ende von globals.css ("Shop-Effekte"): Spezifität-Korrekturen, weil `.af-body input/select` die af-ui-Klassen überstimmte (Pfeil der Auswahl, Größe der Radios).
- Seitenübergang: `<ViewTransition default="af-page">` um `{children}` im Layout (React 19.3.1 exportiert es stabil, Typen ok, Build ok).

## Nicht umgesetzt / Begründung
- `experimental.viewTransition: true`: In Next 16.4.6 nicht in der Config bekannt (TS-Fehler, nicht im Schema), darum weggelassen. Ob die Animation im Browser tatsächlich läuft, habe ich in Headless nicht prüfen können; ohne Support bleibt es ein harmloser Durchlauf ohne Animation. CSS in globals.css zielt auf `root`, nicht auf `af-page`; bei Bedarf home-design anpassen.
- 404 zeigt den Phönix (Morph beim Eintritt), nicht den Vorhang: HairStage hat keinen Morph-Parameter, die Datei gehört home-design. Wunsch: Prop `morph={0}`.

## Prüfung
verify grün (44 Tests), build grün. Screenshots Kollektion, Produkt (genius-weft-...-425), Kasse mit Warenkorb, 404 in 1440 und 390 angesehen. Tastatur: Fokus-Stile unverändert, Zielgrößen ≥ 44 px (Links der 404 min-height 44). Reduzierte Bewegung: Neigung/Glanz/Ladeanimation aus (globale Regeln, Glanz explizit).

## Offen
- Echte Touch-/Tastaturprüfung der Lupe und Neigung nur per Code (FxUi, nur pointer: fine).
- Kasse-Knopf ist weiß statt Gold; unverändert gelassen.
