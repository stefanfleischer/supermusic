import { Minus, Plus } from 'lucide-react'
import { transposeKey, getCapoKey, keyUsesFlats } from '@/lib/chordpro/transpose'
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

  return (
    <div className="flex flex-wrap items-center gap-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
      {/* Transpose */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          Transpose
        </span>
        <button
          onClick={() => onTransposeChange(transposeSemitones - 1)}
          className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
        >
          <Minus size={16} />
        </button>
        <span className="text-white font-mono text-sm min-w-[2ch] text-center">
          {transposeSemitones > 0 ? '+' : ''}
          {transposeSemitones}
        </span>
        <button
          onClick={() => onTransposeChange(transposeSemitones + 1)}
          className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Key display */}
      {currentKey && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Key
          </span>
          <Badge variant="cyan">{currentKey}</Badge>
        </div>
      )}

      {/* Capo */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          Capo
        </span>
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
