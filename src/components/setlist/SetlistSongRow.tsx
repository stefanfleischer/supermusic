import { ChevronUp, ChevronDown, X, Minus, Plus } from 'lucide-react'
import type { Song, SetlistEntry } from '@/lib/types'
import { transposeKey, keyUsesFlats } from '@/lib/chordpro/transpose'
import Badge from '@/components/ui/Badge'

interface SetlistSongRowProps {
  entry: SetlistEntry
  song: Song | undefined
  index: number
  total: number
  onMove: (direction: 'up' | 'down') => void
  onRemove: () => void
  onUpdate: (updates: Partial<SetlistEntry>) => void
}

export default function SetlistSongRow({
  entry,
  song,
  index,
  total,
  onMove,
  onRemove,
  onUpdate,
}: SetlistSongRowProps) {
  if (!song) return null

  const transposedKey =
    song.key && entry.transposeSemitones !== 0
      ? transposeKey(song.key, entry.transposeSemitones, keyUsesFlats(song.key))
      : song.key

  return (
    <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
      {/* Order number */}
      <span className="text-gray-500 text-sm w-6 text-center shrink-0">
        {index + 1}
      </span>

      {/* Move buttons */}
      <div className="flex flex-col shrink-0">
        <button
          onClick={() => onMove('up')}
          disabled={index === 0}
          className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
        >
          <ChevronUp size={14} />
        </button>
        <button
          onClick={() => onMove('down')}
          disabled={index === total - 1}
          className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Song info */}
      <div className="min-w-0 flex-1">
        <span className="text-white text-sm font-medium truncate block">
          {song.title}
        </span>
        {song.artist && (
          <span className="text-gray-400 text-xs">{song.artist}</span>
        )}
      </div>

      {/* Transpose controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() =>
            onUpdate({ transposeSemitones: entry.transposeSemitones - 1 })
          }
          className="p-1 text-gray-500 hover:text-white transition-colors"
        >
          <Minus size={12} />
        </button>
        {transposedKey && <Badge variant="cyan">{transposedKey}</Badge>}
        {!transposedKey && (
          <span className="text-xs text-gray-500 min-w-[2ch] text-center">
            {entry.transposeSemitones > 0 ? '+' : ''}
            {entry.transposeSemitones}
          </span>
        )}
        <button
          onClick={() =>
            onUpdate({ transposeSemitones: entry.transposeSemitones + 1 })
          }
          className="p-1 text-gray-500 hover:text-white transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="p-1 text-gray-500 hover:text-red-400 transition-colors shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  )
}
