import { useMemo } from 'react'
import type { ParsedSong } from '@/lib/types'
import { transposeParsedSong, keyUsesFlats } from '@/lib/chordpro/transpose'
import SongSection from './SongSection'

interface SongRendererProps {
  parsedSong: ParsedSong
  transposeSemitones?: number
}

export default function SongRenderer({
  parsedSong,
  transposeSemitones = 0,
}: SongRendererProps) {
  const displaySong = useMemo(() => {
    const preferFlats = keyUsesFlats(parsedSong.metadata.key)
    return transposeParsedSong(parsedSong, transposeSemitones, preferFlats)
  }, [parsedSong, transposeSemitones])

  return (
    <div className="font-sans text-base">
      {displaySong.sections.map((section, i) => (
        <SongSection key={i} section={section} />
      ))}
      {displaySong.sections.length === 0 && (
        <p className="text-gray-500 italic">No content to display</p>
      )}
    </div>
  )
}
