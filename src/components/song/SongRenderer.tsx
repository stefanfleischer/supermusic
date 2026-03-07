import { useMemo } from 'react'
import type { ParsedSong } from '@/lib/types'
import { transposeParsedSong, keyUsesFlats } from '@/lib/chordpro/transpose'
import { ChordFormatContext, defaultChordFormat, type ChordFormat } from './ChordFormatContext'
import SongSection from './SongSection'

interface SongRendererProps {
  parsedSong: ParsedSong
  transposeSemitones?: number
  preferFlats?: boolean
  chordFormat?: ChordFormat
}

export default function SongRenderer({
  parsedSong,
  transposeSemitones = 0,
  preferFlats,
  chordFormat,
}: SongRendererProps) {
  const displaySong = useMemo(() => {
    const flats = preferFlats !== undefined ? preferFlats : keyUsesFlats(parsedSong.metadata.key)
    return transposeParsedSong(parsedSong, transposeSemitones, flats)
  }, [parsedSong, transposeSemitones, preferFlats])

  return (
    <ChordFormatContext.Provider value={chordFormat ?? defaultChordFormat}>
      <div className="font-sans text-base">
        {displaySong.sections.map((section, i) => (
          <SongSection key={i} section={section} />
        ))}
        {displaySong.sections.length === 0 && (
          <p className="text-gray-500 italic">No content to display</p>
        )}
      </div>
    </ChordFormatContext.Provider>
  )
}
