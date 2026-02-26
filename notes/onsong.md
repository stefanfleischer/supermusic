# OnSong – Feature Research & Clone Roadmap

> Source: https://onsongapp.com/features/
> Goal: Clone OnSong as a web-based alternative called **SuperMusic**

---

## What is OnSong?

OnSong is an iPad/iPhone app for musicians, worship leaders, entertainers and music therapists.
It replaces physical binders and sheet music with a digital, connected, live-performance-ready system.
The core idea: store all your songs in one place, organize them into setlists, and perform them live with powerful automation.

---

## Core Feature Areas

### 1. 📂 ORGANIZE — Store and Sort Your Music

| Feature | Description |
|---|---|
| **Library Management** | Central song library with sync, reporting, and personalization |
| **Books & Sets** | Group songs into books (binders), sets (setlists), and collections |
| **Web Console** | View and edit your library from any browser |
| **Sharing** | Backup, email, export, print, open in other apps |
| **Search & Filter** | Find songs by title, key, tags, author, genre |
| **Tags & Metadata** | Custom tags, BPM, key, author, CCLI number, copyright |

---

### 2. ✍️ CREATE — Edit and Format Your Charts

| Feature | Description |
|---|---|
| **Song Editor** | Write and edit lyrics + chords in plain text (ChordPro format) |
| **Attachments** | Manage multiple file versions per song (PDF, audio, video, images) |
| **Annotations** | Sticky notes, drawn annotations, clips on songs |
| **Style Preferences** | Font size, colors, margins, column layout per song |
| **Transpose** | Transpose songs up/down in semitones |
| **Capo Support** | Set capo position, display chords accordingly |
| **Chord Diagrams** | Visual chord fingering diagrams (guitar, ukulele, etc.) |
| **Number Systems** | Nashville Number System, Solfège, Roman Numerals |
| **Metronome** | Audio click track and visual metronome |
| **MIDI Integration** | Send MIDI program changes, control lights, pedal boards, backing tracks |

---

### 3. 🎤 PERFORM — Live Performance Tools

| Feature | Description |
|---|---|
| **Autoscroll** | Auto-scrolls lyrics at a configurable speed during performance |
| **Timeline** | Cue-based timeline tied to song sections |
| **Quick Pick** | Fast song switching during a live set |
| **Scenes** | Assign motion video backgrounds and stage lighting per song/section |
| **Actions** | Foot pedal support, navigation zones, hot corners, audio triggers |
| **Lyrics Projection** | External display for congregational singing / audience |
| **Stage Monitor** | Separate view for band members on additional screens |
| **Google Cast** | Wirelessly cast lyrics to Chromecast |
| **Backing Tracks** | Link to Apple Music, Spotify, or import own audio files |
| **DMX Lighting** | Control DMX stage lighting directly from the app |

---

### 4. 🔗 CONNECT — Collaborate and Share

| Feature | Description |
|---|---|
| **OnCue** | Control other devices in the room (send lyrics/chords to bandmates' devices) |
| **Band Sync** | Real-time sync of setlists and song changes to band members |
| **Chord Sheet Sharing** | Share songs or sets via AirDrop, email, or link |
| **Cloud Backup** | Sync library to cloud for use across devices |
| **Import Formats** | ChordPro (.cho), OpenSong, Ultimate Guitar, PDF, Word, plain text |
| **Export Formats** | PDF, ChordPro, email, print |

---

## Format: ChordPro

OnSong uses **ChordPro** as its primary song format. It's a plain text format where chords are embedded inline with the lyrics:

```
{title: Amazing Grace}
{key: G}

[G]Amazing [G7]grace how [C]sweet the [G]sound
That [G]saved a [Em]wretch like [D]me
```

This format is key to clone — all songs are stored and rendered from ChordPro.

---

## Pricing Tiers (2026)

| Tier | Key Features |
|---|---|
| **Essentials** | Basic organize, create, perform, sharing |
| **Premium** | Everything + MIDI, Scenes, Device control, Library sync, Autoscroll |
| **Console** | Web-based library access and management |

---

## Target Users

- 🎸 Singer/Songwriters — personal songbook & setlist manager
- ⛪ Worship Musicians — projection, band sync, CCLI tracking
- 🎤 Entertainers / Cover Bands — quick-access setlists, key transposing
- 🏥 Music Therapists — simple, organized songbook for sessions

---

## Clone Priorities for SuperMusic

### Phase 1 — Core (MVP)
- [ ] ChordPro parser and renderer
- [ ] Song library (CRUD)
- [ ] Transpose / Capo
- [ ] Books & Sets (setlist management)
- [ ] Search & Filter

### Phase 2 — Performance
- [ ] Autoscroll
- [ ] Full-screen performance view
- [ ] Chord diagrams
- [ ] Metronome

### Phase 3 — Collaboration
- [ ] User accounts & cloud sync
- [ ] Share songs/sets via link
- [ ] Real-time band sync (WebSockets)
- [ ] Lyrics projection (external display / second screen)

### Phase 4 — Pro Features
- [ ] PDF import (convert to ChordPro)
- [ ] MIDI support
- [ ] Backing track integration
- [ ] Mobile (PWA or React Native)

---

## Key Technical Decisions

- **Song Format:** ChordPro (open standard, widely supported)
- **Parser:** Build custom ChordPro parser or use `chordpro-parser` npm package
- **Rendering:** React component that renders chords above lyrics inline
- **Database:** Postgres via Supabase (songs, sets, users)
- **Real-time sync:** Supabase Realtime or WebSockets for band mode
- **Projection:** Second window/tab with separate minimalist view

---

## Competitive Advantages to build in

- **Web-first** (OnSong is iPad-only → huge gap in the market)
- **Collaborative editing** (Google Docs-style)
- **Open source** song format (ChordPro)
- **No iPad required** — works on any device/browser
