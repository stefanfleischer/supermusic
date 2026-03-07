import { Minus, Plus } from 'lucide-react'
import { transposeKey, getCapoKey, keyUsesFlats } from '@/lib/chordpro/transpose'
import { ALL_KEYS } from '@/lib/chordpro/constants'
import { NOTE_TO_INDEX } from '@/lib/chordpro/constants'
import Badge from '@/components/ui/Badge'

interface TransposeControlsProps {
  originalKey: string | null
  transposeSemitones: number
  capo: number
  onTransposeChange: (semitones: number) => void
  onCapoChange: (capo: number) => void
}

export default function TransposeControls({
  originalKey,
  transposeSemitones,
  capo,
  onTransposeChange,
  onCapoChange,
}: TransposeControlsProps) {
  const currentKey = originalKey
    ? transposeKey(originalKey, transposeSemitones, keyUsesFlats(originalKey))
    : null

  const capoKey = currentKey && capo > 0 ? getCapoKey(currentKey, capo) : null

  function handleKeySelect(newKey: string) {
    if (!originalKey) return
    const originalIndex = NOTE_TO_INDEX[originalKey] ?? 0
    const newIndex = NOTE_TO_INDEX[newKey] ?? 0
    const diff = ((newIndex - originalIndex) % 12 + 12) % 12
    // Prefer the shorter path (e.g. -1 instead of +11)
    const semitones = diff > 6 ? diff - 12 : diff
    onTransposeChange(semitones)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
      {/* Transpose: Key − [Key Dropdown] + */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400 uppercase tracking-wider mr-1">
          Key
        </span>
        <button
          onClick={() => onTransposeChange(transposeSemitones - 1)}
          className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
        >
          <Minus size={16} />
        </button>
        {currentKey ? (
          <select
            value={currentKey}
            onChange={(e) => handleKeySelect(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white text-sm rounded px-2 py-1 focus:outline-none focus:border-cyan-500 font-mono font-bold"
          >
            {ALL_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-gray-500 text-sm px-2">–</span>
        )}
        <button
          onClick={() => onTransposeChange(transposeSemitones + 1)}
          className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Capo */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400 uppercase tracking-wider mr-1">
          Capo
        </span>
        <button
          onClick={() => onCapoChange(Math.max(0, capo - 1))}
          className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
        >
          <Minus size={16} />
        </button>
        <select
          value={capo}
          onChange={(e) => onCapoChange(Number(e.target.value))}
          className="bg-slate-700 border border-slate-600 text-white text-sm rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
        >
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={i}>
              {i === 0 ? 'None' : i}
            </option>
          ))}
        </select>
        <button
          onClick={() => onCapoChange(Math.min(12, capo + 1))}
          className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Capo key */}
      {capoKey && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Play
          </span>
          <Badge variant="outline">{capoKey}</Badge>
        </div>
      )}
    </div>
  )
}
