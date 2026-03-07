import type { SongLine as SongLineType } from '@/lib/types'
import ChordBadge from './ChordBadge'

interface SongLineProps {
  line: SongLineType
}

export default function SongLine({ line }: SongLineProps) {
  // Empty line (section separator)
  if (line.segments.length === 0) {
    return <div className="h-4" />
  }

  const hasChords = line.segments.some((seg) => seg.chord !== null)

  return (
    <div className="leading-relaxed">
      {line.segments.map((segment, i) => (
        <span key={i} className="inline-block align-bottom">
          {hasChords && (
            <span className="block h-5 leading-5 whitespace-pre">
              {segment.chord ? (
                <>
                  <ChordBadge chord={segment.chord} />
                  {/* invisible spacer so column width = chord + trailing spaces */}
                  {!segment.lyrics?.trim() && (
                    <span className="opacity-0 select-none text-sm">
                      {segment.lyrics || '  '}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm">&nbsp;</span>
              )}
            </span>
          )}
          <span className="block text-white whitespace-pre-wrap">
            {segment.lyrics || (segment.chord ? '\u00A0\u00A0' : '')}
          </span>
        </span>
      ))}
    </div>
  )
}
