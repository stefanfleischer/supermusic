import { describe, it, expect } from 'vitest'
import { parseChordPro, parseChordLine } from './parser'

describe('parseChordLine', () => {
  it('parses a line with chords and lyrics', () => {
    const result = parseChordLine('[G]Amazing [G7]grace how [C]sweet the [G]sound')
    expect(result.segments).toEqual([
      { chord: 'G', lyrics: 'Amazing ' },
      { chord: 'G7', lyrics: 'grace how ' },
      { chord: 'C', lyrics: 'sweet the ' },
      { chord: 'G', lyrics: 'sound' },
    ])
  })

  it('handles lyrics before the first chord', () => {
    const result = parseChordLine('Oh [G]Amazing grace')
    expect(result.segments).toEqual([
      { chord: null, lyrics: 'Oh ' },
      { chord: 'G', lyrics: 'Amazing grace' },
    ])
  })

  it('handles a plain lyrics line with no chords', () => {
    const result = parseChordLine('Just some lyrics here')
    expect(result.segments).toEqual([
      { chord: null, lyrics: 'Just some lyrics here' },
    ])
  })

  it('handles chords with no lyrics after them', () => {
    const result = parseChordLine('[Am] [C] [G]')
    expect(result.segments).toEqual([
      { chord: 'Am', lyrics: ' ' },
      { chord: 'C', lyrics: ' ' },
      { chord: 'G', lyrics: '' },
    ])
  })

  it('handles complex chord names', () => {
    const result = parseChordLine('[Bbm7]text [F#sus4]more [G/B]end')
    expect(result.segments).toEqual([
      { chord: 'Bbm7', lyrics: 'text ' },
      { chord: 'F#sus4', lyrics: 'more ' },
      { chord: 'G/B', lyrics: 'end' },
    ])
  })
})

describe('parseChordPro', () => {
  it('parses metadata directives', () => {
    const source = `{title: Amazing Grace}
{artist: John Newton}
{key: G}
{tempo: 72}
{time: 3/4}`

    const result = parseChordPro(source)
    expect(result.metadata).toEqual({
      title: 'Amazing Grace',
      artist: 'John Newton',
      key: 'G',
      tempo: '72',
      timeSignature: '3/4',
    })
  })

  it('parses shorthand metadata directives', () => {
    const source = `{t: Amazing Grace}
{st: John Newton}`

    const result = parseChordPro(source)
    expect(result.metadata.title).toBe('Amazing Grace')
    expect(result.metadata.artist).toBe('John Newton')
  })

  it('parses sections with start/end directives', () => {
    const source = `{start_of_verse}
[G]Amazing [G7]grace how [C]sweet the [G]sound
That [G]saved a [Em]wretch like [D]me
{end_of_verse}

{start_of_chorus}
[C]How sweet [G]the sound
{end_of_chorus}`

    const result = parseChordPro(source)
    expect(result.sections).toHaveLength(2)
    expect(result.sections[0].type).toBe('verse')
    expect(result.sections[0].label).toBe('Verse')
    expect(result.sections[0].lines).toHaveLength(2)
    expect(result.sections[1].type).toBe('chorus')
    expect(result.sections[1].label).toBe('Chorus')
    expect(result.sections[1].lines).toHaveLength(1)
  })

  it('parses shorthand section directives', () => {
    const source = `{sov}
[G]Line one
{eov}
{soc}
[C]Chorus line
{eoc}`

    const result = parseChordPro(source)
    expect(result.sections).toHaveLength(2)
    expect(result.sections[0].type).toBe('verse')
    expect(result.sections[1].type).toBe('chorus')
  })

  it('parses comment directives as section labels', () => {
    const source = `{comment: Verse 1}
[G]Amazing grace
{comment: Chorus}
[C]How sweet`

    const result = parseChordPro(source)
    expect(result.sections).toHaveLength(2)
    expect(result.sections[0].type).toBe('verse')
    expect(result.sections[0].label).toBe('Verse 1')
    expect(result.sections[1].type).toBe('chorus')
    expect(result.sections[1].label).toBe('Chorus')
  })

  it('handles lines without explicit sections', () => {
    const source = `{title: Test Song}
[G]First line
[C]Second line`

    const result = parseChordPro(source)
    expect(result.metadata.title).toBe('Test Song')
    expect(result.sections).toHaveLength(1)
    expect(result.sections[0].type).toBe('unknown')
    expect(result.sections[0].lines).toHaveLength(2)
  })

  it('preserves empty lines within sections', () => {
    const source = `{start_of_verse}
[G]Line one

[C]Line after blank
{end_of_verse}`

    const result = parseChordPro(source)
    expect(result.sections[0].lines).toHaveLength(3)
    expect(result.sections[0].lines[1].segments).toEqual([])
  })

  it('handles named sections with custom labels', () => {
    const source = `{start_of_verse: Verse 2}
[Am]Second verse
{end_of_verse}`

    const result = parseChordPro(source)
    expect(result.sections[0].type).toBe('verse')
    expect(result.sections[0].label).toBe('Verse 2')
  })

  it('parses a full realistic song', () => {
    const source = `{title: Amazing Grace}
{artist: John Newton}
{key: G}

{start_of_verse: Verse 1}
[G]Amazing [G7]grace how [C]sweet the [G]sound
That [G]saved a [Em]wretch like [D]me
[G]I once was [G7]lost but [C]now am [G]found
Was [G]blind but [Em]now [D]I [G]see
{end_of_verse}

{start_of_verse: Verse 2}
[G]'Twas grace that [G7]taught my [C]heart to [G]fear
And [G]grace my [Em]fears re[D]lieved
{end_of_verse}`

    const result = parseChordPro(source)
    expect(result.metadata.title).toBe('Amazing Grace')
    expect(result.metadata.artist).toBe('John Newton')
    expect(result.metadata.key).toBe('G')
    expect(result.sections).toHaveLength(2)
    expect(result.sections[0].label).toBe('Verse 1')
    expect(result.sections[0].lines).toHaveLength(4)
    expect(result.sections[1].label).toBe('Verse 2')
    expect(result.sections[1].lines).toHaveLength(2)
  })
})
