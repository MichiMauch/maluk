# MALUK Racing Ticker — Architektur-Übersicht

## Systemübersicht

```
┌─────────────────────────────────────────────────────────────────┐
│                        TELEGRAM                                  │
│                                                                  │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────────────┐  │
│  │ Admin     │    │ Kanal        │    │ Diskussionsgruppe     │  │
│  │ (privat)  │    │ @maluk_      │    │ MALUK Racing Fans     │  │
│  │           │    │ racing_fans  │    │                       │  │
│  │ Befehle:  │    │              │    │ Fans diskutieren      │  │
│  │ /rennen   │    │ Nur lesen    │◄───│ Kommentare zu         │  │
│  │ /status   │    │ Ticker-Feed  │    │ Kanal-Nachrichten     │  │
│  │ /ergebnis │    │              │    │                       │  │
│  │ /sponsor  │    └──────▲───────┘    │ Fan postet Foto ──┐  │  │
│  │ /fan      │           │            │                   │  │  │
│  │ /delete   │           │            └───────────────────│──┘  │
│  │ Text/Foto │           │                                │     │
│  └─────┬─────┘           │                                │     │
│        │                 │                                │     │
└────────│─────────────────│────────────────────────────────│─────┘
         │                 │                                │
         ▼                 │                                │
┌─────────────────────────────────────────────────────────────────┐
│                     MALUK RACING SERVER                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 Telegram Webhook                          │   │
│  │                 /api/telegram-webhook                     │   │
│  │                                                           │   │
│  │  Nachricht empfangen                                      │   │
│  │       │                                                   │   │
│  │       ├── Text/Foto/Video ──► Ticker speichern            │   │
│  │       │                       + Kanal weiterleiten ───────│───┼──► Kanal
│  │       │                                                   │   │
│  │       ├── /fan (Antwort) ──► Fan-Inhalt speichern         │   │
│  │       │                      (is_fan = true)              │   │
│  │       │                                                   │   │
│  │       ├── /sponsor ────────► Sponsor-Post speichern       │   │
│  │       │                      (type = "sponsor")           │   │
│  │       │                      + Logo als Base64            │   │
│  │       │                      + Kanal weiterleiten ────────│───┼──► Kanal
│  │       │                                                   │   │
│  │       ├── /tickersponsor ──► active_race.ticker_sponsor   │   │
│  │       │                                                   │   │
│  │       ├── Editiert ────────► UPDATE by telegram_msg_id    │   │
│  │       │                                                   │   │
│  │       └── /delete ─────────► DELETE by telegram_msg_id    │   │
│  │                                                           │   │
│  │       Nach jeder Änderung: Redis Cache invalidieren       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────┐    ┌────────────┐    ┌────────────────────┐     │
│  │ Turso DB   │    │ Upstash    │    │ Ticker API         │     │
│  │ (SQLite)   │    │ Redis      │    │ /api/ticker        │     │
│  │            │    │            │    │                    │     │
│  │ ticker_    │◄───│ Cache      │◄───│ Browser pollt     │     │
│  │ messages   │    │ TTL: 10s   │    │ alle 15s          │     │
│  │            │    │            │    │                    │     │
│  │ active_    │    │ 1 DB-Query │    │ Liefert:          │     │
│  │ race       │    │ pro 10s    │    │ - messages        │     │
│  │            │    │ statt pro  │    │ - status          │     │
│  │ race_      │    │ Request    │    │ - activeRaceName  │     │
│  │ summaries  │    │            │    │ - tickerSponsor   │     │
│  └────────────┘    └────────────┘    └─────────▲──────────┘     │
│                                                │                 │
└────────────────────────────────────────────────│─────────────────┘
                                                 │
                                                 │ fetch /api/ticker
                                                 │
┌────────────────────────────────────────────────│─────────────────┐
│                      WEBSITE                   │                  │
│                   malukracing.ch               │                  │
│                                                │                  │
│  ┌─────────────────────────────────────────────┴──────────────┐  │
│  │                        Header                              │  │
│  │                                                            │  │
│  │  [Logo]  [Nav]           [🔴 LIVE Bergrennen Reitnau]     │  │
│  │                          (nur sichtbar wenn live)          │  │
│  │                          Klick öffnet Modal                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                  Live-Ticker Modal                         │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  🤝 Ticker präsentiert von [Logo] Partner-Name       │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─ Nachrichten ───────────────────────────────────────┐  │  │
│  │  │                                                      │  │  │
│  │  │  🟤 Admin-Nachricht (gold)          22:06           │  │  │
│  │  │  🟦 Fan-Nachricht (cyan)            22:05           │  │  │
│  │  │  🟢 Sponsor-Shoutout (grün)         22:04           │  │  │
│  │  │  🟡 Ergebnis (gold, fett)           22:03           │  │  │
│  │  │  🔴 Status (rot)                    22:02           │  │  │
│  │  │                                                      │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  🤝 Ticker präsentiert von [Logo] Partner-Name       │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                  Rennbericht Modal                         │  │
│  │  (nach Rennende im Kalender verfügbar)                    │  │
│  │                                                            │  │
│  │  ┌─ AI-Zusammenfassung ────────────────────────────────┐  │  │
│  │  │  Automatisch generiert bei /rennen ende              │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─ Impressionen ──────────────────────────────────────┐  │  │
│  │  │  [Foto] [Foto] [Foto]  ← Team-Fotos                │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─ Fan-Galerie ───────────────────────────────────────┐  │  │
│  │  │  [Foto] [Foto]          ← via /fan übernommen       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─ Live-Ticker Verlauf ───────────────────────────────┐  │  │
│  │  │  Chronologisch alle Nachrichten                      │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

## Datenfluss

### Nachricht posten (Admin → Ticker)
```
Admin tippt in Telegram
    ↓
Telegram sendet Webhook → /api/telegram-webhook
    ↓
Bot speichert in Turso DB (ticker_messages)
    ↓
Redis Cache wird invalidiert
    ↓
Nachricht wird an Telegram-Kanal weitergeleitet
    ↓
Website pollt /api/ticker (alle 15s wenn Modal offen)
    ↓
Redis Cache vorhanden?
    ├── JA → Sofort zurück (< 10ms)
    └── NEIN → DB Query → in Redis speichern (TTL 10s) → zurück
    ↓
Browser zeigt neue Nachricht im Modal
```

### Fan-Foto übernehmen
```
Fan postet Foto in Telegram-Gruppe
    ↓
Admin antwortet mit /fan
    ↓
Bot speichert Foto in DB (is_fan = true)
    ↓
Redis Cache invalidiert
    ↓
Foto erscheint im Ticker (cyan hinterlegt)
Foto erscheint im Rennbericht unter "Fan-Galerie"
```

## Datenbank-Tabellen

### ticker_messages
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | INTEGER | Auto-increment |
| telegram_message_id | INTEGER | Für Edit/Delete Zuordnung |
| text | TEXT | Nachrichtentext |
| image_url | TEXT | Base64-kodiertes Bild/Video |
| type | TEXT | text, photo, video, result, status, sponsor |
| race_status | TEXT | live, pause, ende |
| race_id | TEXT | Zuordnung zum Rennen |
| is_fan | INTEGER | 0 = Team, 1 = Fan-Content |
| created_at | DATETIME | Zeitstempel |

### active_race
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | INTEGER | Immer 1 (Singleton) |
| race_id | TEXT | Slug des aktiven Rennens |
| ticker_sponsor_slug | TEXT | Partner-Slug des Ticker-Sponsors |

### race_summaries
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| race_id | TEXT | Primary Key |
| summary | TEXT | AI-generierte Zusammenfassung |
| created_at | DATETIME | Zeitstempel |

## Nachrichtentypen im Ticker

| Typ | Farbe | Icon | Beschreibung |
|-----|-------|------|-------------|
| text | Gold | Chat-Blase | Normale Nachricht |
| photo | Gold | Kamera | Foto mit optionalem Text |
| video | Gold | Videokamera | Video mit optionalem Text |
| result | Gold (fett) | Pokal | Ergebnis (/ergebnis) |
| status | Rot | Flagge | Statusänderung (/status) |
| sponsor | Grün | Handshake | Sponsor-Shoutout mit Logo |
| *is_fan* | Cyan | Personen-Gruppe | Fan-Content (beliebiger Typ) |

## Technologie-Stack

| Komponente | Technologie |
|------------|------------|
| Website | Next.js 16, React 19, Tailwind CSS 4 |
| Datenbank | Turso (LibSQL/SQLite) |
| Cache | Upstash Redis (TTL 10s) |
| Bot | Telegram Bot API (Webhook) |
| AI Summary | Anthropic Claude Sonnet 4 |
| E-Mail | Resend |
| Analytics | Matomo |
