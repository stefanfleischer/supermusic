import type { SongSection as SongSectionType } from '@/lib/types'
import SongLine from './SongLine'

interface SongSectionProps {
  section: SongSectionType
}

export default function SongSection({ section }: SongSectionProps) {
  const isChorus = section.type === 'chorus'
  const isBridge = section.type === 'bridge'

  return (
    <div
      className={`mb-6 ${
        isChorus
          ? 'border-l-2 border-cyan-500 pl-4'
          : isBridge
            ? 'border-l-2 border-purple-500 pl-4'
            : ''
      }`}
    >
      {section.label && (
        <div
          className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
            isChorus
              ? 'text-cyan-400'
              : isBridge
                ? 'text-purple-400'
                : 'text-gray-500'
          }`}
        >
          {section.label}
        </div>
      )}
      {section.lines.map((line, i) => (
        <SongLine key={i} line={line} />
      ))}
    </div>
  )
}
