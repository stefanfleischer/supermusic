// ─── Note Types ─────────────────────────────────────────────────────────

export type NoteName = string // e.g. "G", "Bb", "F#"

// ─── Song ───────────────────────────────────────────────────────────────

export interface Song {
  id: string
  title: string
  artist: string
  key: NoteName | null
  tempo: number | null
  timeSignature: string | null
  tags: string[]
  ccli: string | null
  copyright: string | null
  content: string // raw ChordPro source text
  capo: number // 0 = no capo
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

export type SongCreate = Omit<Song, 'id' | 'createdAt' | 'updatedAt'>
export type SongUpdate = Partial<SongCreate> & { id: string }

// ─── Book ───────────────────────────────────────────────────────────────

export interface Book {
  id: string
  name: string
  description: string
  songIds: string[] // unordered collection
  createdAt: string
  updatedAt: string
}

export type BookCreate = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>
export type BookUpdate = Partial<BookCreate> & { id: string }

// ─── Setlist ────────────────────────────────────────────────────────────

export interface Setlist {
  id: string
  name: string
  description: string
  date: string | null // performance date
  songEntries: SetlistEntry[] // ordered
  createdAt: string
  updatedAt: string
}

export interface SetlistEntry {
  songId: string
  transposeSemitones: number // per-setlist key override (0 = original)
  capo: number // per-setlist capo override
  notes: string // performance notes
}

export type SetlistCreate = Omit<Setlist, 'id' | 'createdAt' | 'updatedAt'>
export type SetlistUpdate = Partial<SetlistCreate> & { id: string }

// ─── ChordPro Parser Output ────────────────────────────────────────────

export interface ParsedSong {
  metadata: Record<string, string>
  sections: SongSection[]
}

export type SectionType =
  | 'verse'
  | 'chorus'
  | 'bridge'
  | 'tag'
  | 'intro'
  | 'outro'
  | 'instrumental'
  | 'unknown'

export interface SongSection {
  type: SectionType
  label: string
  lines: SongLine[]
}

export interface SongLine {
  segments: LineSegment[]
}

export interface LineSegment {
  chord: string | null
  lyrics: string
}
