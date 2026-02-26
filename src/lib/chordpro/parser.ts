import type {
  LineSegment,
  ParsedSong,
  SongLine,
  SongSection,
  SectionType,
} from '../types'
import {
  SECTION_DIRECTIVES,
  END_SECTION_DIRECTIVES,
  METADATA_DIRECTIVES,
} from './constants'

const DIRECTIVE_RE = /^\{(\w+)(?::\s*(.+))?\}$/
const CHORD_RE = /\[([^\]]+)\]/g

/**
 * Parse a ChordPro source string into a structured ParsedSong.
 */
export function parseChordPro(source: string): ParsedSong {
  const lines = source.split('\n')
  const metadata: Record<string, string> = {}
  const sections: SongSection[] = []
  let currentSection: SongSection | null = null

  function ensureSection(): SongSection {
    if (!currentSection) {
      currentSection = { type: 'unknown', label: '', lines: [] }
    }
    return currentSection
  }

  function pushCurrentSection() {
    if (currentSection && currentSection.lines.length > 0) {
      sections.push(currentSection)
    }
    currentSection = null
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()

    // Empty line
    if (trimmed === '') {
      if (currentSection && currentSection.lines.length > 0) {
        // Preserve empty lines within sections as empty SongLines
        currentSection.lines.push({ segments: [] })
      }
      continue
    }

    // Directive line
    const directiveMatch = trimmed.match(DIRECTIVE_RE)
    if (directiveMatch) {
      const key = directiveMatch[1].toLowerCase()
      const value = directiveMatch[2]?.trim() ?? ''

      // Section start
      if (key in SECTION_DIRECTIVES) {
        pushCurrentSection()
        const type = SECTION_DIRECTIVES[key]
        const label = value || defaultSectionLabel(type)
        currentSection = { type, label, lines: [] }
        continue
      }

      // Section end
      if (END_SECTION_DIRECTIVES.has(key)) {
        pushCurrentSection()
        continue
      }

      // Comment directive — treat as section label
      if (key === 'comment' || key === 'c') {
        pushCurrentSection()
        const type = guessSectionType(value)
        currentSection = { type, label: value, lines: [] }
        continue
      }

      // Metadata directive
      if (key in METADATA_DIRECTIVES) {
        metadata[METADATA_DIRECTIVES[key]] = value
        continue
      }

      // Unknown directive — store as metadata
      metadata[key] = value
      continue
    }

    // Chord-lyric line
    const section = ensureSection()
    section.lines.push(parseChordLine(trimmed))
  }

  // Push final section
  pushCurrentSection()

  return { metadata, sections }
}

/**
 * Parse a single line containing [Chord] markers mixed with lyrics.
 */
export function parseChordLine(line: string): SongLine {
  const segments: LineSegment[] = []
  let lastIndex = 0

  CHORD_RE.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = CHORD_RE.exec(line)) !== null) {
    // Text before this chord
    const textBefore = line.slice(lastIndex, match.index)
    if (textBefore) {
      if (segments.length === 0) {
        segments.push({ chord: null, lyrics: textBefore })
      } else {
        segments[segments.length - 1].lyrics += textBefore
      }
    }

    // New chord segment
    segments.push({ chord: match[1], lyrics: '' })
    lastIndex = match.index + match[0].length
  }

  // Remaining text after last chord
  const remaining = line.slice(lastIndex)
  if (segments.length > 0) {
    segments[segments.length - 1].lyrics += remaining
  } else {
    // No chords found — plain lyrics line
    segments.push({ chord: null, lyrics: remaining })
  }

  return { segments }
}

function defaultSectionLabel(type: SectionType): string {
  switch (type) {
    case 'verse':
      return 'Verse'
    case 'chorus':
      return 'Chorus'
    case 'bridge':
      return 'Bridge'
    case 'intro':
      return 'Intro'
    case 'outro':
      return 'Outro'
    case 'instrumental':
      return 'Instrumental'
    case 'tag':
      return 'Tag'
    default:
      return ''
  }
}

/**
 * Guess section type from a comment label like "Verse 1", "Chorus", etc.
 */
function guessSectionType(label: string): SectionType {
  const lower = label.toLowerCase()
  if (lower.startsWith('verse')) return 'verse'
  if (lower.startsWith('chorus')) return 'chorus'
  if (lower.startsWith('bridge')) return 'bridge'
  if (lower.startsWith('intro')) return 'intro'
  if (lower.startsWith('outro')) return 'outro'
  if (lower.startsWith('instrumental') || lower.startsWith('solo'))
    return 'instrumental'
  if (lower.startsWith('tag')) return 'tag'
  return 'unknown'
}
