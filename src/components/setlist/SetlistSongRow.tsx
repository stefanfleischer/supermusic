import { GripVertical, X, Minus, Plus } from 'lucide-react'
import type { Song, SetlistEntry } from '@/lib/types'
import { transposeKey, keyUsesFlats } from '@/lib/chordpro/transpose'
import Badge from '@/components/ui/Badge'

interface SetlistSongRowProps {
  entry: SetlistEntry
  song: Song | undefined
  index: number
  isDragging: boolean
  isDragOver: boolean
  onRemove: () => void
  onUpdate: (updates: Partial<SetlistEntry>) => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: () => void
  onDragEnd: () => void
}

export default function SetlistSongRow({
  entry,
  song,
  index,
  isDragging,
  isDragOver,
  onRemove,
  onUpdate,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: SetlistSongRowProps) {
  if (!song) return null

  const transposedKey =
    song.key && entry.transposeSemitones !== 0
      ? transposeKey(song.key, entry.transposeSemitones, keyUsesFlats(song.key))
      : song.key

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
        isDragging
          ? 'opacity-40 border-cyan-500 bg-slate-700/50'
          : isDragOver
            ? 'border-cyan-400 bg-cyan-900/20 scale-[1.01]'
            : 'bg-slate-800/50 border-slate-700'
      }`}
    >
      {/* Drag handle */}
      <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 shrink-0 touch-none">
        <GripVertical size={18} />
      </div>

      {/* Order number */}
      <span className="text-gray-500 text-sm w-5 text-center shrink-0">
        {index + 1}
      </span>

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
