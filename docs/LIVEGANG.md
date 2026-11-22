# Livegang – Schritt für Schritt

Stand: 22.11.2026. Ergänzt `docs/CHECKLISTE-LAUNCH.md` (was rechtlich und inhaltlich noch zu klären ist) um die **technische Reihenfolge**: welches Konto, welcher Wert, wohin.

**Grundsatz: erst testen, dann live.** Bisher läuft die Seite nur als Vorschau im Demo-Modus (Bestellungen im Arbeitsspeicher, keine echten Daten, keine echten Mails). In Production öffnet sich die Online-Kasse nur, wenn **Datenbank und E-Mail** eingerichtet sind; sonst bleibt es bei der Anfrage (`src/server/mode.ts`). Das ist Absicht.

## Überblick

| # | Schritt | Wer | Ergebnis |
| --- | --- | --- | --- |
| 1 | Vorschau abnehmen | Auftraggeber | Testkauf im Demo-Modus gesehen |
| 2 | Rechtstexte freigeben | Auftraggeber + Rechtsberatung | geänderte Texte bestätigt |
| 3 | Datenbank anlegen (Supabase) | Auftraggeber | `SUPABASE_URL` + geheimer Schlüssel |
| 4 | E-Mail anlegen (Resend) | Auftraggeber | `RESEND_API_KEY`, verifizierte Absender-Domain |
| 5 | Variablen in Vercel setzen | Auftraggeber | 7 Variablen im Bereich *Production* |
| 6 | PR #5 mergen, Production-Deploy | Auftraggeber, dann Claude | Production-URL läuft |
| 7 | Testbestellung auf der Production-URL | Claude + Auftraggeber | Mails, GiroCode, Datenbankzeile geprüft |
| 8 | Domain umstellen | Auftraggeber | `andreasfashionhair.de` zeigt auf die neue Seite |

Schritt 7 kommt bewusst **vor** 8: Die echte Kasse wird getestet, bevor Kundinnen sie sehen.

## 1. Vorschau abnehmen (nichts wird gespeichert)

Die Vorschau zeigt oben einen Demo-Hinweis; Bestellungen verschwinden wieder. Sicher zum Ausprobieren.

- [ ] Startseite am Handy und am Rechner: Film läuft, Pause-Knopf, nichts verschoben oder abgeschnitten
- [ ] „Kommen Sie näher“: Reiter schalten die Extensions um, die Bilder zeigen das ganze Produkt
- [ ] Kollektion: Filter, Vergleich, Farbabgleich (das Foto wird nur im Browser ausgewertet)
- [ ] Produktseite: Lupe, Größenrechner; die WhatsApp-Frage öffnet einen Chat mit **+49 176 23681585**
- [ ] Warenkorb → Kasse → Bestellung abschicken (Pflichtfelder, statt AGB-Häkchen ein Hinweis)
- [ ] Bestellseite: GiroCode mit der Banking-App **scannen, nicht abschicken**. Prüfen: Empfängerin, IBAN (stimmt mit der Bankkarte überein), Betrag, Verwendungszweck = Bestellnummer `AF-…`
- [ ] Kopierknöpfe (IBAN, Betrag, Verwendungszweck) und PayPal-Hinweis
- [ ] Seitenübergänge und Sprachwechsel (de, en, fr, es)

## 2. Rechtstexte freigeben

Diese Änderungen haben Rechtswirkung. Bitte von fachkundiger Stelle (Anwalt oder Rechtstexte-Dienst) ansehen lassen, bevor Kundinnen bestellen. Claude ersetzt keine Rechtsberatung.

1. **Zahlungszeitpunkt:** sofort nach der Bestellung *oder* nach der Auftragsbestätigung, spätestens 7 Tage danach; bei Nichtverfügbarkeit Erstattung (`src/content/legal/versand-zahlung.tsx`, `agb.tsx`, `checkout-texts.ts`, in allen vier Sprachen).
2. **Kein AGB-Häkchen mehr**, stattdessen ein Hinweis (`checkout.agbNotice`). Das senkt die Hürde. Bitte zusammen mit der Beschriftung des Bestell-Buttons (§ 312j Abs. 3 BGB) bestätigen lassen.
3. **Packvideo** (Auswahlfeld in der Kasse): Andrea muss das Versprechen wirklich einhalten wollen.
4. **Löschfristen:** `orders.delete_after` steht auf 10 Jahre nach Jahresende, die Datenschutzerklärung nennt 8 Jahre (Buchungsbelege) bzw. 6 Jahre (Geschäftsbriefe). Mit der Steuerberatung abstimmen, danach den Spaltenstandard in `0001_init.sql` anpassen.

Weitere Hinweise von `npm run check:launch` (blockieren nicht, aber entscheiden): USt-IdNr. vorhanden?, Werbeaussagen in 36 Produkttexten prüfen (§ 5 UWG), Verfügbarkeit der Stücke mit Andrea abgleichen. Der Rest steht in `docs/CHECKLISTE-LAUNCH.md`.

## 3. Datenbank (Supabase)

1. supabase.com → Konto → **New project**. Region **Central EU (Frankfurt)**, damit die Daten in der EU bleiben. Datenbankpasswort im Passwortmanager ablegen (die Seite braucht es nicht).
2. **SQL Editor** → New query → den gesamten Inhalt von `supabase/migrations/0001_init.sql` einfügen → Run. **Nur einmal ausführen**: die Datei legt Typen und Tabellen an und lässt sich nicht wiederholen. `0000_export_d1_reference.sql` ist nur Referenz und wird **nicht** ausgeführt.
3. Prüfen: Der Table Editor zeigt sieben Tabellen (`orders`, `order_items`, `piece_reservations`, `inquiries`, `withdrawals`, `newsletter_subscribers`, `rate_limits`). Keine davon darf als „Unrestricted“ bzw. „RLS disabled“ gekennzeichnet sein; die Datei schaltet die Zeilensicherheit für alle ein, Zugriff hat nur der geheime Schlüssel.
4. **Project Settings → API** (bzw. API Keys):
   - **Project URL** wird `SUPABASE_URL`
   - der **geheime Schlüssel** (`service_role` bzw. „secret key“) wird `SUPABASE_SERVICE_ROLE_KEY`. Er umgeht die Zeilensicherheit: **nie** in Chat, E-Mail, Repository oder Browser, nur in Vercel (Schritt 5). Der öffentliche Schlüssel (anon/publishable) wird nicht gebraucht.
5. Auftragsverarbeitungsvertrag (AVV) mit Supabase abschließen und die Angaben in `src/config/legal-company.ts` mit dem Vertrag abgleichen.

Hinweis zum Tarif: Nach meinem Wissensstand kann Supabase auf dem kostenlosen Tarif Projekte bei längerer Inaktivität pausieren. Das bitte in den Plan-Details prüfen; ein pausiertes Projekt ist für die Seite nicht erreichbar.

## 4. E-Mail (Resend)

1. resend.com → Konto → **Domains → Add Domain** mit `andreasfashionhair.de` (Region EU wählen, falls angeboten).
2. Die angezeigten DNS-Einträge (SPF/DKIM) genau so beim Domain-Anbieter eintragen, dann in Resend **Verify**. Das dauert von Minuten bis zu Stunden und betrifft nur den Mailversand, nicht die Website.
3. **API Keys → Create API Key** mit Berechtigung *Sending access* → wird `RESEND_API_KEY` (wird nur einmal angezeigt).
4. Zwei Adressen festlegen:
   - `MAIL_FROM`: Absender an der verifizierten Domain, z. B. `Andrea's Fashion Hair <bestellung@andreasfashionhair.de>` (Beispiel; die Domain muss die verifizierte sein)
   - `MAIL_TO_OWNER`: das Postfach, in dem Andrea die Bestellungen erhält (naheliegend: die Adresse aus dem Impressum)
5. AVV mit Resend abschließen. Aktuelle Grenzen des kostenlosen Tarifs auf resend.com/pricing nachsehen.

## 5. Variablen in Vercel

Vercel → Projekt → **Settings → Environment Variables**. Je Variable nur **Production** anhaken, Geheimwerte als **Sensitive** markieren.

| Name | Wert | Sensitive |
| --- | --- | --- |
| `SITE_URL` | `https://www.andreasfashionhair.de` (muss zur Hauptadresse aus Schritt 8 passen: Canonical, Sitemap, Links in Mails) | nein |
| `SUPABASE_URL` | Project URL aus Schritt 3 | nein |
| `SUPABASE_SERVICE_ROLE_KEY` | geheimer Schlüssel aus Schritt 3 | ja |
| `RESEND_API_KEY` | aus Schritt 4 | ja |
| `MAIL_FROM` | aus Schritt 4 | nein |
| `MAIL_TO_OWNER` | aus Schritt 4 | nein |
| `IP_HASH_SECRET` | lange Zufallszeichenkette: im Terminal `openssl rand -hex 32` oder 40+ Zeichen aus dem Passwortmanager. Ohne ihn wechselt der Schlüssel des Rate-Limits mit jedem Serverstart | ja |

- `AFH_DEMO` auf Vercel **nie** setzen.
- Optional: `CHECKOUT_CLOSED` = `1` ist die Notbremse (siehe unten) und im Normalbetrieb nicht gesetzt.
- Vorschau-Deployments laufen immer im Demo-Modus mit Arbeitsspeicher, auch wenn dort Variablen stehen (`src/server/db.ts`). Production-Daten sind davon getrennt.
- Variablen gelten erst für **neue** Deployments.
- Die Werte gehören nicht in den Chat; Claude braucht sie nicht.

## 6. PR #5 mergen, Production-Deploy

1. GitHub → PR #5: Vorschau-Build grün und „mergeable“ → **Merge**.
2. Vercel → Settings → Git → **Production Branch = `main`**.
3. Production-Deploy: automatisch durch Vercel, wenn das Projekt mit GitHub verbunden ist, sonst auf Zuruf durch Claude.
4. Der Production-Build führt `check:launch` aus und **bricht ab**, solange die drei Resend-Variablen fehlen. Das ist der Schutz vor einem halben Livegang, kein Fehler. Fehlende Supabase-Variablen bremsen den Build nicht, halten aber die Kasse geschlossen (Bestellung dann per Anfrage).
5. Fragt die Production-URL (`…vercel.app`) nach einem Vercel-Login, ist der Deployment-Schutz aktiv. Claude kann einen Freigabelink erzeugen.

## 7. Testbestellung auf der Production-URL (vor dem Domain-Umzug)

- [ ] Kein Demo-Hinweis, die Kasse ist offen
- [ ] Testbestellung mit der **eigenen** E-Mail-Adresse und einem Stück, das kurz gesperrt sein darf (ein Einzelstück ist bis zum Storno für alle vergeben)
- [ ] Mail an die Kundin (Bestellnummer, Zahlungsangaben) und Mail an Andrea (`MAIL_TO_OWNER`) sind angekommen; auch den Spam-Ordner prüfen
- [ ] Bestellseite über den Link aus der Mail öffnen; GiroCode scannen, **nicht überweisen**
- [ ] Supabase Table Editor: neue Zeilen in `orders`, `order_items`, `piece_reservations`; `mail_customer` und `mail_owner` stehen auf `gesendet`
- [ ] Anfrageformular und Widerrufsformular je einmal absenden: die Mail kommt an
- [ ] Doppelverkauf-Schutz: dasselbe Einzelstück vor dem Storno ein zweites Mal bestellen, die Seite meldet es als vergeben
- [ ] Testbestellung stornieren (SQL unten): das Stück ist nach dem Neuladen wieder bestellbar

## 8. Domain umstellen

1. Einen Tag vorher beim DNS-Anbieter die TTL der bisherigen Einträge senken und die alten Werte notieren (Rückweg).
2. Vercel → Settings → **Domains**: `www.andreasfashionhair.de` (Hauptadresse) und `andreasfashionhair.de` (Weiterleitung auf www) hinzufügen; DNS genau so setzen, wie Vercel es anzeigt. Soll stattdessen die Adresse ohne www die Hauptadresse sein, muss `SITE_URL` dazu passen.
3. Warten, bis Vercel die Konfiguration und das Zertifikat als gültig zeigt; die Seite über die Domain öffnen.
4. Stichprobe: eine alte Produkt-URL leitet mit 308 auf die neue Adresse (siehe `CHECKLISTE-LAUNCH.md`).
5. Google Search Console: `/sitemap.xml` einreichen.

## Alltag: Bestellungen bearbeiten

Es gibt **keine Verwaltungsoberfläche**. Andrea sieht Bestellungen in der Mail an `MAIL_TO_OWNER`; bearbeitet wird im Supabase **SQL Editor** (oder Table Editor).

- Die Kundin überweist mit dem **Verwendungszweck = Bestellnummer `AF-XXXXXX`**; auf dem Kontoauszug daran zuordnen.
- Ablauf laut Rechtstexten: Andrea bestätigt, Zahlung spätestens 7 Tage danach, Versand nach Zahlungseingang (DHL).
- Wünscht die Kundin PayPal, sendet Andrea nach der Bestätigung eine Zahlungsaufforderung vom PayPal-Konto.

```sql
-- Letzte Bestellungen inkl. Mail-Status
select id, created_at, status, total_cents / 100.0 as euro, customer_name, mail_customer, mail_owner
from orders order by created_at desc limit 20;

-- Status setzen (immer mit WHERE, sonst sind alle Bestellungen betroffen)
update orders set status = 'bestaetigt' where id = 'AF-XXXXXX';
update orders set status = 'versendet'  where id = 'AF-XXXXXX';

-- Stornieren (gibt das Einzelstück wieder frei)
select cancel_order('AF-XXXXXX');

-- Aufräumen: Anfragen nach Ablauf der Frist (Datenschutzerklärung: spätestens 12 Monate)
delete from inquiries where delete_after < current_date;
```

- Eine unbezahlte Bestellung hält ihr Einzelstück **gesperrt, bis sie storniert wird**. Es gibt keine automatische Freigabe nach 7 Tagen.
- Das Aufräumen der Anfragen ist nicht automatisiert; ein fester Termin (z. B. quartalsweise) genügt.

## Notbremse

| Maßnahme | Folge |
| --- | --- |
| `CHECKOUT_CLOSED` = `1` in Vercel (Production) setzen, neu deployen | **Empfohlen.** Kasse zu, Bestellung nur per Anfrage. Formulare, Mails und die Anzeige „vergeben“ bleiben unverändert. Zum Wiederöffnen die Variable entfernen und neu deployen. |
| `SUPABASE_SERVICE_ROLE_KEY` in Vercel entfernen, neu deployen | Kasse zu, Bestellung nur per Anfrage (Formulare gehen weiter). Vergebene Stücke werden danach nicht mehr als vergeben angezeigt, und zum Wiederöffnen muss der Schlüssel erneut aus Supabase kopiert werden. |
| `MAIL_TO_OWNER` in Vercel entfernen, neu deployen | Kasse zu, Anfrage- und Widerrufsformular aus (Telefon und WhatsApp bleiben sichtbar). Die Anzeige „vergeben“ bleibt korrekt. |
| Letzte gute Version | Vercel → Deployments → frühere Production-Version → *Promote to Production* (Instant Rollback) |
| Domain zurück | DNS-Einträge auf die in Schritt 8 notierten alten Werte setzen |

## Wenn etwas hakt

| Beobachtung | Ursache | Abhilfe |
| --- | --- | --- |
| Production-Build bricht bei `check:launch` ab | `RESEND_API_KEY`, `MAIL_FROM` oder `MAIL_TO_OWNER` fehlen im Bereich *Production* | Variablen setzen, neu deployen |
| Production zeigt „Bestellung per Anfrage“ statt der Kasse | Eine der fünf Variablen für Datenbank oder Mail fehlt oder ist falsch geschrieben | Namen und Werte prüfen, neu deployen |
| Production zeigt den Demo-Hinweis | Es ist ein Vorschau-Deployment oder `AFH_DEMO` ist gesetzt | Production-URL öffnen; `AFH_DEMO` entfernen |
| Keine Mails, `mail_customer` = `fehlgeschlagen` | Domain in Resend nicht verifiziert oder `MAIL_FROM` nicht an der verifizierten Domain | Resend → Domains und Logs prüfen |
| Keine Mails, `mail_customer` = `nicht_konfiguriert` | Resend-Variablen fehlen in Production | Variablen setzen, neu deployen |
| „Stück bereits vergeben“, obwohl es frei sein sollte | Eine Testbestellung oder unbezahlte Bestellung hält die Reservierung | `select cancel_order('AF-XXXXXX');` |
| Seiten laden etwa 3 Sekunden langsamer, die Kasse meldet „konnte nicht gesendet werden“ | Die Datenbank antwortet nicht (z. B. Supabase-Projekt pausiert oder gestört) | Projektstatus in Supabase prüfen und ggf. fortsetzen; bis dahin `CHECKOUT_CLOSED` = `1`. Die Seiten bleiben erreichbar, nur „vergeben“ wird solange nicht angezeigt. |

## Vorab lokal geprüft

Schema und Kauflogik wurden ohne echte Konten durchgespielt: das SQL gegen Postgres (PGlite, mit den Rollen von Supabase) und der Shop als Production-Build (`VERCEL_ENV=production`) gegen eine Nachbildung der Datenbank-Schnittstelle. Mails gingen an einen Ersatz, nichts verließ den Rechner.

- **Datenbank:** Schema läuft durch; nur `service_role` kommt an Tabellen und Funktionen; Doppelverkauf-Schutz (auch alles-oder-nichts im gemischten Warenkorb); Wiederholung und Doppelklick; Stornierung; Ratenlimit; Grenzen der Eingaben; Typen des Codes entsprechen den Enums der Datenbank.
- **Shop im Production-Modus:** Kauf mit Reservierung und beiden Mails inklusive Zahlungsangaben; Zugangsschutz der Bestellseite; „vergeben“ sofort sichtbar; gleichzeitiger Kauf desselben Stücks; Mailversand fällt aus (Bestellung geht trotzdem durch); Datenbank fällt aus oder antwortet nicht (Seiten bleiben erreichbar, Kasse meldet es freundlich); Anfrage; Widerruf; Ratenlimit; alle drei Varianten der Notbremse.
- **Nicht abgedeckt** (erst mit den echten Diensten prüfbar): das Verhalten von Supabase selbst (Schlüssel, Region, Pausierung), Zustellung und Spam-Einstufung bei Resend, DNS und Zertifikat, die Vercel-Laufzeit. Deshalb bleibt Schritt 7 nötig.

## Bewusst noch nicht gebaut

- Verwaltungsoberfläche für Bestellungen (würde einen geschützten Zugang brauchen); bis dahin SQL wie oben
- automatische Freigabe unbezahlter Bestellungen und automatische Löschung nach Fristen
- Newsletter (im Livebetrieb nicht aktiv), automatischer PayPal-Checkout (PayPal läuft per Zahlungsaufforderung)

## Was Claude übernimmt

Sobald „Schlüssel sind in Vercel“ (Schritt 5 erledigt) gesagt wird: Production-Deploy auslösen bzw. prüfen, Build-Log und Laufzeit-Logs lesen, die Production-URL stichprobenartig prüfen (Kasse offen, kein Demo-Hinweis, Seiten laden) und das Ergebnis berichten. Postfach- und Banking-App-Prüfungen aus Schritt 7 bleiben beim Auftraggeber. Gemergt, live geschaltet oder angelegt wird nichts ohne ausdrückliches Wort.
