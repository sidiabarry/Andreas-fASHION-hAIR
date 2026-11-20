# Arbeiten mit Agenten und Worktrees

Kurzfassung für Menschen. Die Regeln für Claude selbst stehen in `CLAUDE.md` (wird von jedem Agenten geladen, deshalb knapp).

## Das Team

| Agent | Modell / Aufwand | Worktree | Bereich |
| --- | --- | --- | --- |
| Orchestrator (Hauptsitzung) | wie gewählt | Arbeitsbranch | plant, verteilt, merged, pusht |
| `home-design` | Opus · high | ja | Startseite, „Über Andrea“, Film, WebGL-Partikel, Szenen |
| `legal-compliance` | Opus · medium | ja | Rechtstexte, Firmendaten, `check:launch` |
| `platform` | Sonnet · high | ja | Next-Konfiguration, CSP/Sicherheit, Server, Supabase, Mail, SEO-Technik |
| `shop-conversion` | Sonnet · medium | ja | Kollektion, Produkt, Warenkorb, Kasse, Bestellung |
| `i18n` | Sonnet · medium | ja | Oberflächen- und Produktübersetzungen, neue Sprachen |
| `qa` | Haiku · low | nein, prüft fremde | Lint, Typecheck, Tests, Build, Screenshots, axe |
| `scout` | Haiku · low | nein, nur lesen | Code finden, Fragen beantworten |

Die Logik dahinter (nach den Mustern aus [token-optimizer](https://github.com/alexgreensh/token-optimizer), „agentic systems“): teure Modelle nur, wo Urteilsvermögen zählt (Gestaltung, Recht), mittlere für Umsetzung, das günstigste für Lesen und Prüfen. Lese- und Prüf-Agenten haben keine Schreibwerkzeuge für Code.

## Ablauf einer Runde

1. Orchestrator zerlegt die Aufgabe nach Bereichen und startet **unabhängige** Agenten parallel, nie zwei auf denselben Dateien.
2. Jeder schreibende Agent bekommt einen eigenen Worktree unter `.claude/worktrees/` und führt zuerst `npm run wt:prepare` aus:
   - `node_modules` als **Hardlink-Kopie** aus dem Haupt-Checkout (0,2 s, kein Platzbedarf). Symlinks gehen nicht, weil Turbopack bei `node_modules` außerhalb des Projektordners abbricht (getestet).
   - Routentypen (`next typegen`), eigener Port je Worktree (3600–3899), Pfad zum Übergabeordner.
3. Agent arbeitet, `npm run verify`, committet im eigenen Branch, schreibt die ausführliche Notiz nach `.coordination/findings/` und antwortet in höchstens 10 Zeilen.
4. `qa` prüft den Branch, der Orchestrator merged in den Arbeitsbranch und pusht. Nur der Orchestrator pusht.

`.coordination/` liegt im Haupt-Checkout (auch aus Worktrees erreichbar) und ist in `.gitignore`: Übergaben kosten so keine Tokens im Orchestrator, er liest nur die Kurzantworten.

## Token sparen: was eingebaut ist

- `CLAUDE.md` ist klein gehalten (jeder Agent lädt sie ganz), Details stehen in `docs/` und werden nur bei Bedarf gelesen.
- Zuständigkeiten sind fest: Agenten lesen nur ihren Bereich und die genannten Schnittstellen.
- `npm run verify` bündelt Lint, Typecheck und Tests in einem Befehl; Ausgaben werden gekürzt.
- Keine Skills in den Agenten-Definitionen (Skills im Feld `skills:` würden beim Start komplett geladen).

## Vorschlag: Projekteinstellungen (nicht aktiv)

Claude darf sich Freigaben nicht selbst eintragen. Wenn ihr sie wollt, legt diese Datei als `.claude/settings.json` an: Routinebefehle laufen dann ohne Rückfrage, und große Dateien, die nur Tokens verbrauchen, sind gesperrt.

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run wt:prepare)",
      "Bash(npm run verify:*)",
      "Bash(npm run lint:*)",
      "Bash(npm run typecheck:*)",
      "Bash(npm test:*)",
      "Bash(npm run build:*)",
      "Bash(npm run check:launch:*)",
      "Bash(npx next typegen:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git branch:*)"
    ],
    "deny": [
      "Read(./package-lock.json)",
      "Read(./.next/**)",
      "Read(./public/assets/originals/**)",
      "Read(./public/assets/world/**)",
      "Read(./design-sources/**)"
    ]
  }
}
```

## Das Plugin token-optimizer selbst

Bewusst **nicht** installiert:

- Cloud-Sitzungen (claude.ai/code) laden keine Plugins. Es ginge nur über ein Setup-Skript der Umgebung, das bei jeder Sitzung ein npm-Paket lädt und Hooks auf jeden Werkzeugaufruf legt, also fremden Code mit vollem Zugriff.
- Lizenz: PolyForm Noncommercial. Für Kleinunternehmen (unter 5 Personen und unter 20.000 $ Umsatz im Monat) gibt es eine schriftliche kostenlose Erlaubnis. Andrea's Fashion Hair dürfte darunter fallen; bitte selbst prüfen.

Lokal (Claude Code im Terminal) ist die Installation einfach: `/plugin marketplace add alexgreensh/token-optimizer`, dann `/plugin install token-optimizer@alexgreensh-token-optimizer`.
