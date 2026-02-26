import { NOTE_TO_INDEX, SHARP_NOTES, FLAT_NOTES, FLAT_KEYS } from './constants'
import type { ParsedSong, SongSection, SongLine, LineSegment } from '../types'

const CHORD_ROOT_RE = /^([A-G][#b]?)(.*)$/

/**
 * Transpose a single chord string by the given number of semitones.
 * Preserves chord quality (m, 7, maj7, dim, sus4, etc.).
 * Uses flat notation for flat keys, sharp notation otherwise.
 */
export function transposeChord(
  chord: string,
  semitones: number,
  preferFlats?: boolean,
): string {
  // Handle slash chords like "G/B"
  const slashIndex = chord.indexOf('/')
  if (slashIndex > 0) {
    const main = chord.slice(0, slashIndex)
    const bass = chord.slice(slashIndex + 1)
    return (
      transposeChord(main, semitones, preferFlats) +
      '/' +
      transposeChord(bass, semitones, preferFlats)
    )
  }

  const match = chord.match(CHORD_ROOT_RE)
  if (!match) return chord // can't parse, return as-is

  const root = match[1]
  const quality = match[2]

  const index = NOTE_TO_INDEX[root]
  if (index === undefined) return chord // unknown note

  const newIndex = ((index + semitones) % 12 + 12) % 12

  // Determine sharp vs flat preference
  const useFlats =
    preferFlats !== undefined
      ? preferFlats
      : root.includes('b') || FLAT_KEYS.has(root)

  const scale = useFlats ? FLAT_NOTES : SHARP_NOTES
  return scale[newIndex] + quality
}

/**
 * Determine whether a key conventionally uses flats.
 */
export function keyUsesFlats(key: string | null): boolean {
  if (!key) return false
  return FLAT_KEYS.has(key)
}

/**
 * Get the new key after transposing.
 */
export function transposeKey(
  key: string,
  semitones: number,
  preferFlats?: boolean,
): string {
  return transposeChord(key, semitones, preferFlats)
}

/**
 * Get the "capo key" — what chord shapes to play with a capo.
 * If the song is in G and capo is at fret 3, you play E shapes.
 */
export function getCapoKey(key: string, capo: number): string {
  return transposeChord(key, -capo, keyUsesFlats(key))
}

/**
 * Transpose all chords in a ParsedSong (returns a new object).
 */
export function transposeParsedSong(
  song: ParsedSong,
  semitones: number,
  preferFlats?: boolean,
): ParsedSong {
  if (semitones === 0) return song

  return {
    metadata: {
      ...song.metadata,
      ...(song.metadata.key
        ? { key: transposeKey(song.metadata.key, semitones, preferFlats) }
        : {}),
    },
    sections: song.sections.map(
      (section): SongSection => ({
        ...section,
        lines: section.lines.map(
          (line): SongLine => ({
            segments: line.segments.map(
              (seg): LineSegment => ({
                chord: seg.chord
                  ? transposeChord(seg.chord, semitones, preferFlats)
                  : null,
                lyrics: seg.lyrics,
              }),
            ),
          }),
        ),
      }),
    ),
  }
}
