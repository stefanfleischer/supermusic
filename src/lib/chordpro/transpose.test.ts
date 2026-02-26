import { describe, it, expect } from 'vitest'
import {
  transposeChord,
  transposeKey,
  getCapoKey,
  transposeParsedSong,
  keyUsesFlats,
} from './transpose'
import { parseChordPro } from './parser'

describe('transposeChord', () => {
  it('transposes up by semitones', () => {
    expect(transposeChord('C', 2)).toBe('D')
    expect(transposeChord('G', 2)).toBe('A')
    expect(transposeChord('A', 3)).toBe('C')
  })

  it('transposes down by semitones', () => {
    expect(transposeChord('D', -2)).toBe('C')
    expect(transposeChord('C', -1)).toBe('B')
    expect(transposeChord('A', -3)).toBe('F#')
  })

  it('wraps around the chromatic scale', () => {
    expect(transposeChord('B', 1)).toBe('C')
    expect(transposeChord('C', -1)).toBe('B')
    expect(transposeChord('G', 12)).toBe('G')
  })

  it('preserves chord quality', () => {
    expect(transposeChord('Am', 2)).toBe('Bm')
    expect(transposeChord('G7', 5)).toBe('C7')
    expect(transposeChord('Cmaj7', 4)).toBe('Emaj7')
    expect(transposeChord('Dsus4', 2)).toBe('Esus4')
    expect(transposeChord('Fdim', 1)).toBe('Gbdim')
    expect(transposeChord('Fdim', 1, false)).toBe('F#dim')
  })

  it('handles flat notes', () => {
    expect(transposeChord('Bb', 2, true)).toBe('C')
    expect(transposeChord('Eb', 2, true)).toBe('F')
    expect(transposeChord('Ab', -1, true)).toBe('G')
  })

  it('respects preferFlats parameter', () => {
    expect(transposeChord('C', 1, true)).toBe('Db')
    expect(transposeChord('C', 1, false)).toBe('C#')
    expect(transposeChord('D', 1, true)).toBe('Eb')
    expect(transposeChord('D', 1, false)).toBe('D#')
  })

  it('handles slash chords', () => {
    expect(transposeChord('G/B', 2)).toBe('A/C#')
    expect(transposeChord('C/E', 5)).toBe('F/A')
    expect(transposeChord('Am/G', 2)).toBe('Bm/A')
  })

  it('returns unparseable chords as-is', () => {
    expect(transposeChord('N.C.', 2)).toBe('N.C.')
    expect(transposeChord('', 2)).toBe('')
  })
})

describe('transposeKey', () => {
  it('transposes a key', () => {
    expect(transposeKey('G', 2)).toBe('A')
    expect(transposeKey('C', 5)).toBe('F')
    expect(transposeKey('A', -2)).toBe('G')
  })
})

describe('getCapoKey', () => {
  it('returns the chord shapes to play with a capo', () => {
    // Song in G, capo 3 -> play E shapes
    expect(getCapoKey('G', 3)).toBe('E')
    // Song in A, capo 2 -> play G shapes
    expect(getCapoKey('A', 2)).toBe('G')
    // Song in C, capo 0 -> play C
    expect(getCapoKey('C', 0)).toBe('C')
  })
})

describe('keyUsesFlats', () => {
  it('returns true for flat keys', () => {
    expect(keyUsesFlats('F')).toBe(true)
    expect(keyUsesFlats('Bb')).toBe(true)
    expect(keyUsesFlats('Eb')).toBe(true)
    expect(keyUsesFlats('Dm')).toBe(true)
  })

  it('returns false for sharp keys', () => {
    expect(keyUsesFlats('G')).toBe(false)
    expect(keyUsesFlats('D')).toBe(false)
    expect(keyUsesFlats('A')).toBe(false)
    expect(keyUsesFlats('C')).toBe(false)
  })

  it('returns false for null', () => {
    expect(keyUsesFlats(null)).toBe(false)
  })
})

describe('transposeParsedSong', () => {
  it('transposes all chords in a parsed song', () => {
    const song = parseChordPro(`{title: Test}
{key: G}

{start_of_verse}
[G]Amazing [C]grace
{end_of_verse}`)

    const transposed = transposeParsedSong(song, 2)
    expect(transposed.metadata.key).toBe('A')

    const segments = transposed.sections[0].lines[0].segments
    expect(segments[0].chord).toBe('A')
    expect(segments[0].lyrics).toBe('Amazing ')
    expect(segments[1].chord).toBe('D')
    expect(segments[1].lyrics).toBe('grace')
  })

  it('returns the same song for 0 semitones', () => {
    const song = parseChordPro(`{key: G}
[G]Test`)

    const result = transposeParsedSong(song, 0)
    expect(result).toBe(song) // same reference
  })

  it('preserves lyrics when transposing', () => {
    const song = parseChordPro('[G]Hello [Am]world')
    const transposed = transposeParsedSong(song, 5)
    const segments = transposed.sections[0].lines[0].segments
    expect(segments[0].lyrics).toBe('Hello ')
    expect(segments[1].lyrics).toBe('world')
  })
})
