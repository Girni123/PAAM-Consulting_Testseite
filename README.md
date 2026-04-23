# PAAM — Krisenvorsorge Website

Statische Landingpage, ehrlich modern, warm-dunkel. Reines HTML/CSS/JS — **keine Build-Tools, keine Abhängigkeiten.**

## Dateien

- `index.html` — Markup & Struktur
- `styles.css` — Designsystem & Layout
- `script.js` — Resilienz-Rechner, PLZ-Risiko-Check, Scroll-Animationen, FAQ, Kontaktformular
- `.nojekyll` — leere Datei, verhindert, dass GitHub Pages Jekyll laufen lässt (sonst werden Dateien/Ordner mit führendem Unterstrich ignoriert)

## Lokal öffnen

Einfach `index.html` in einem Browser öffnen. Fertig.

## GitHub Pages — in 3 Klicks online

1. **Repository erstellen** auf GitHub, diese 4 Dateien hochladen (Root, nicht in Unterordner).
2. Im Repo: **Settings → Pages**.
3. Bei *Source*: `Deploy from a branch` wählen, Branch `main`, Ordner `/ (root)`, *Save* klicken.

Nach ~1 Minute ist die Seite erreichbar unter  
`https://<dein-username>.github.io/<repo-name>/`

> **Wichtig:** Die `.nojekyll`-Datei **muss mit hochgeladen** werden (auch wenn sie leer ist). Sie sorgt dafür, dass GitHub Pages die Dateien unverändert ausliefert — ohne Jekyll, ohne extra Installation.

## Anpassen

- **Texte**: in `index.html` direkt editieren.
- **Farben/Typografie**: die CSS-Variablen am Anfang von `styles.css` (Block `:root`) anpassen — alles andere passt sich automatisch an.
- **Bilder**: die Unsplash-URLs in `index.html` durch eigene ersetzen (Hero, Scenes, About).
- **Kontaktdaten**: im Abschnitt `<!-- KONTAKT -->` in `index.html` sowie im Footer austauschen.
- **Pakete/Preise**: im Abschnitt `<!-- PAKETE -->`.

## Interaktive Elemente

- **Resilienz-Rechner** — Slider 1–6 Personen, berechnet Wasser, Kalorien, Lagerfläche, Energiebedarf für 10 Tage. Live-Animation.
- **Standort-Analyse** — Postleitzahl eingeben, deterministische Dummy-Bewertung für Hochwasser, Strom, Sturm und Industrierisiken. Gleiche PLZ liefert stets dasselbe Ergebnis.
- **FAQ-Accordion**, **Scroll-Reveal-Animationen**, **Parallax im Hero**.

## Browser-Support

Moderne Browser (Chrome/Safari/Firefox/Edge letzte 2 Jahre). Reduced-Motion wird respektiert.
