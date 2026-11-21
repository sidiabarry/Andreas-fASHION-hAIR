# i18n-overhaul

- Basis: Worktree war auf altem main; per ff-merge auf claude/friendly-hopper-ktjxqu gebracht.
- fr/es.json: ca. 308/309 Platzhalter (hero, home, about, custom, extensions, collection, product.spec/copy, nav, footer, objections) übersetzt. en war bis auf Eigennamen/Lehnwörter bereits übersetzt (keine deutschen Reste gefunden).
- src/components/home/i18n/fr.mjs und es.mjs waren Platzhalter (export * from de) und hätten per apply.mjs alles auf Deutsch zurückgesetzt. Jetzt echte Quellen, identisch zu den JSON (hero/home/about). en.mjs war bereits identisch.
- catalog-copy/{en,fr,es}.json: 422-428 vollständig; Zahlen gegen Deutsch geprüft, Listenlängen gleich.
- scripts/catalog-i18n: neue Vorlagen (Namen, Beschreibungen, Specs, Farben, "Naturlockig") in de/en/fr/es; generate.mjs übersetzt jetzt {color}/{texture} auch in einfachen Beschreibungen. Katalog neu erzeugt (57 Produkte, Rundlauf ok). TRANSLATION_PENDING geleert.
- Begriffe: fr "trames", "paquets"; es "cortinas", "paquetes"; en "wefts", "packs".
- Offen/Risiko: Slogan "Wie neu geboren" fr "Comme une renaissance", es "Como volver a nacer" (bitte Muttersprachler/Andrea prüfen). es "Tupé en V" für V-Toupet. Rechtstexte nicht angefasst.
- Stichprobe 1440 (fr/es: Start, Produkt 425, /extensions): 200, keine deutschen Reste sichtbar; npm run verify grün.
