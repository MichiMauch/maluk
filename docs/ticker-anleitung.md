# MALUK Racing Ticker — Anleitung

## Vorbereitung (einmalig)

### Bot starten
1. Suche in Telegram nach dem MALUK Racing Ticker Bot
2. Tippe auf **Start**
3. Der Bot zeigt dir alle verfügbaren Befehle

### Teammitglieder einladen
Nur der Hauptadmin kann weitere Personen freischalten:

1. Die neue Person schreibt dem Bot eine beliebige Nachricht
2. Der Bot antwortet: *"Du bist nicht berechtigt. Deine Chat-ID: 123456789"*
3. Die Person teilt dir diese Chat-ID
4. Du schickst dem Bot: `/invite 123456789 Max Mustermann`
5. Ab sofort kann die Person den Ticker bedienen

**Entfernen:** `/remove 123456789`

---

## Renntag

### 1. Rennen starten
```
/rennen reitnau-2026
```
Der Bot bestätigt und der Live-Ticker auf der Website wird aktiv. Besucher sehen automatisch den roten **LIVE**-Button im Header.

### 2. Ticker-Sponsor setzen (optional)
```
/tickersponsor braichet
```
Der Sponsor wird oben und unten im Ticker-Modal angezeigt mit Logo und Link. Entfernen mit `/tickersponsor off`.

### 3. Nachrichten posten

| Was | Wie |
|-----|-----|
| **Text** | Einfach eine Nachricht schreiben |
| **Foto** | Foto senden (optional mit Text als Bildunterschrift) |
| **Video** | Video senden (max. 8 MB) |
| **Ergebnis** | `/ergebnis P3 1:43.25` |
| **Status** | `/status live` oder `/status pause` oder `/status ende` |

Alles erscheint gleichzeitig auf:
- der **Website** (Live-Ticker Modal)
- dem **Telegram-Kanal** (t.me/maluk_racing_fans)
- der **Diskussionsgruppe** (automatisch via Kanal)

### 4. Sponsor erwähnen
```
/sponsor braichet
/sponsor hess-uhren Danke für die Unterstützung!
```
Postet eine Sponsor-Nachricht mit Logo und Link im Ticker und Kanal.

**Verfügbare Slugs:** braichet, bewa-technik, hess-uhren, garage-friedli, schorno, mueller-baustoffe, leuko, huwyler-klima, marti, wirz-schriften

### 5. Fan-Inhalte übernehmen
Wenn ein Fan in der Telegram-Gruppe etwas Spannendes postet:

1. Auf die Fan-Nachricht **antworten** (wischen)
2. `/fan` schreiben — oder `/fan Toller Schnappschuss!` mit eigenem Text
3. Das Foto/Video/Text des Fans erscheint im Website-Ticker

Fan-Beiträge werden im Ticker farblich abgehoben (cyan) und im Rennbericht separat unter "Fan-Galerie" aufgeführt.

### 6. Nachrichten bearbeiten oder löschen

| Aktion | Wie |
|--------|-----|
| **Bearbeiten** | Nachricht in Telegram bearbeiten — Ticker wird automatisch aktualisiert |
| **Löschen** | Auf die Nachricht antworten mit `/delete` |

### 7. Rennen beenden
```
/rennen ende
```
Der Bot erstellt automatisch eine **AI-Zusammenfassung** des Rennens. Diese wird im Rennkalender als "Rennbericht" angezeigt.

---

## Alle Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `/start` | Hilfe anzeigen |
| `/id` | Eigene Chat-ID anzeigen |
| `/rennen <slug>` | Rennen starten |
| `/rennen status` | Aktives Rennen anzeigen |
| `/rennen ende` | Rennen beenden + AI-Zusammenfassung |
| `/status live\|pause\|ende` | Rennstatus ändern |
| `/ergebnis P3 1:43.25` | Ergebnis posten |
| `/tickersponsor <slug>` | Ticker-Sponsor setzen |
| `/tickersponsor off` | Ticker-Sponsor entfernen |
| `/sponsor <slug> [Text]` | Sponsor-Shoutout |
| `/fan` | Fan-Inhalt in Ticker übernehmen (als Antwort) |
| `/delete` | Ticker-Eintrag löschen (als Antwort) |
| `/clear` | Gesamten Ticker leeren |
| `/invite <id> <name>` | Teammitglied hinzufügen (nur Hauptadmin) |
| `/remove <id>` | Teammitglied entfernen (nur Hauptadmin) |

---

## Tipps

- **Fotos mit Text:** In Telegram kannst du beim Foto-Versand eine Bildunterschrift eingeben — diese wird als Text im Ticker angezeigt.
- **Kein Text nötig:** Fotos/Videos ohne Bildunterschrift werden nur als Bild angezeigt.
- **Reihenfolge:** Neueste Nachrichten stehen oben im Ticker.
- **Polling:** Der Ticker auf der Website aktualisiert sich alle 15 Sekunden.
- **Erster Besuch:** Bei einem Live-Rennen öffnet sich das Ticker-Modal automatisch beim ersten Seitenbesuch.
