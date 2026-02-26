import type { SectionType } from '../types'

// Chromatic scale in sharps and flats
export const SHARP_NOTES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const

export const FLAT_NOTES = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
] as const

// Map any note name to its semitone index (0-11)
export const NOTE_TO_INDEX: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  'E#': 5,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11,
  'B#': 0,
}

// Keys that conventionally use flats
export const FLAT_KEYS = new Set([
  'F',
  'Bb',
  'Eb',
  'Ab',
  'Db',
  'Gb',
  'Dm',
  'Gm',
  'Cm',
  'Fm',
  'Bbm',
  'Ebm',
])

// All 12 major key names for UI dropdowns
export const ALL_KEYS = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
]

// Map ChordPro section directive names to SectionType
export const SECTION_DIRECTIVES: Record<string, SectionType> = {
  // Long form
  start_of_verse: 'verse',
  start_of_chorus: 'chorus',
  start_of_bridge: 'bridge',
  start_of_tab: 'instrumental',
  start_of_grid: 'instrumental',
  // Short form
  sov: 'verse',
  soc: 'chorus',
  sob: 'bridge',
  sot: 'instrumental',
  sog: 'instrumental',
}

export const END_SECTION_DIRECTIVES = new Set([
  'end_of_verse',
  'end_of_chorus',
  'end_of_bridge',
  'end_of_tab',
  'end_of_grid',
  'eov',
  'eoc',
  'eob',
  'eot',
  'eog',
])

// Metadata directives (key -> canonical name)
export const METADATA_DIRECTIVES: Record<string, string> = {
  title: 'title',
  t: 'title',
  subtitle: 'artist',
  st: 'artist',
  artist: 'artist',
  key: 'key',
  tempo: 'tempo',
  time: 'timeSignature',
  capo: 'capo',
  copyright: 'copyright',
  ccli: 'ccli',
}
