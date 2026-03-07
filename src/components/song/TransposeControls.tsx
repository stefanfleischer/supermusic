import { Minus, Plus, Type, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { transposeKey, keyUsesFlats } from '@/lib/chordpro/transpose'
import { ALL_KEYS, NOTE_TO_INDEX } from '@/lib/chordpro/constants'
import type { ChordFormat, ChordColor } from './ChordFormatContext'

const COLOR_OPTIONS: { value: ChordColor; label: string; cls: string }[] = [
  { value: 'default', label: 'Standard', cls: 'bg-white' },
  { value: 'red',     label: 'Rot',      cls: 'bg-red-400' },
  { value: 'blue',    label: 'Blau',     cls: 'bg-blue-400' },
  { value: 'green',   label: 'Grün',     cls: 'bg-green-400' },
  { value: 'cyan',    label: 'Cyan',     cls: 'bg-cyan-400' },
  { value: 'purple',  label: 'Violett',  cls: 'bg-purple-400' },
]

interface TransposeControlsProps {
  originalKey: string | null
  transposeSemitones: number
  capo: number
  capoEnabled: boolean
  preferFlats: boolean
  chordFormat: ChordFormat
  onTransposeChange: (semitones: number) => void
  onCapoChange: (capo: number) => void
  onCapoEnabledChange: (enabled: boolean) => void
  onPreferFlatsChange: (preferFlats: boolean) => void
  onChordFormatChange: (format: ChordFormat) => void
  // Optional prev/next navigation (for setlist view)
  onPrev?: () => void
  onNext?: () => void
  hasPrev?: boolean
  hasNext?: boolean
  navIndex?: number     // 0-based current index
  navTotal?: number     // total entries
  navItems?: string[]         // song titles for dropdown
  navItemMoments?: boolean[]  // true = moment entry
  onNavSelect?: (index: number) => void
}

export default function TransposeControls({
  originalKey,
  transposeSemitones,
  capo,
  capoEnabled,
  preferFlats,
  chordFormat,
  onTransposeChange,
  onCapoChange,
  onCapoEnabledChange,
  onPreferFlatsChange,
  onChordFormatChange,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  navIndex,
  navTotal,
  navItems,
  navItemMoments,
  onNavSelect,
}: TransposeControlsProps) {
  const [formatOpen, setFormatOpen] = useState(false)
  const formatRef = useRef<HTMLDivElement>(null)
  const [navOpen, setNavOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Close overlays on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (formatRef.current && !formatRef.current.contains(e.target as Node)) {
        setFormatOpen(false)
      }
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavOpen(false)
      }
    }
    if (formatOpen || navOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [formatOpen, navOpen])
  // Effective capo: only applied when enabled
  const effectiveCapo = capoEnabled ? capo : 0

  // Key display is independent of capo — always shows originalKey + transposeSemitones
  const currentKey = originalKey
    ? transposeKey(originalKey, transposeSemitones, preferFlats)
    : null

  function handleKeySelect(newKey: string) {
    if (!originalKey) return
    // Propagate flat/sharp preference from user's selection
    onPreferFlatsChange(keyUsesFlats(newKey))
    const originalIndex = NOTE_TO_INDEX[originalKey] ?? 0
    const newIndex = NOTE_TO_INDEX[newKey] ?? 0
    const diff = ((newIndex - originalIndex) % 12 + 12) % 12
    const rawSemitones = diff > 6 ? diff - 12 : diff
    onTransposeChange(rawSemitones)
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
        {/* Toggle */}
        <button
          onClick={() => onCapoEnabledChange(!capoEnabled)}
          className={`text-xs uppercase tracking-wider mr-1 px-1 py-0.5 rounded transition-colors ${
            capoEnabled
              ? 'text-white font-semibold'
              : 'text-gray-500 hover:text-gray-300'
          }`}
          title={capoEnabled ? 'Capo aktiv – klicken zum Deaktivieren' : 'Capo inaktiv – klicken zum Aktivieren'}
        >
          Capo
        </button>
        <div className={`flex items-center gap-1 transition-opacity ${capoEnabled ? 'opacity-100' : 'opacity-40'}`}>
          <button
            onClick={() => { onCapoEnabledChange(true); onCapoChange(Math.max(0, capo - 1)) }}
            className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
          >
            <Minus size={16} />
          </button>
          <select
            value={capo}
            onChange={(e) => { onCapoEnabledChange(true); onCapoChange(Number(e.target.value)) }}
            className="bg-slate-700 border border-slate-600 text-white text-sm rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
          >
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <button
            onClick={() => { onCapoEnabledChange(true); onCapoChange(Math.min(12, capo + 1)) }}
            className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>


      {/* Prev / Next navigation (setlist) — centered between Capo and Chord Format */}
      {(onPrev || onNext) && (
        <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          {navTotal !== undefined && navIndex !== undefined && (
            <div className="relative" ref={navRef}>
              <button
                onClick={() => setNavOpen((o) => !o)}
                className="text-gray-400 hover:text-white text-sm font-mono px-2 py-0.5 rounded hover:bg-slate-700 transition-colors"
              >
                {navIndex + 1}/{navTotal}
              </button>
              {navOpen && navItems && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 bg-slate-800 border border-slate-600 rounded-xl shadow-xl py-1 min-w-48 max-h-64 overflow-y-auto">
                  {navItems.map((title, i) => {
                    const isMoment = navItemMoments?.[i] ?? false
                    return (
                      <button
                        key={i}
                        onClick={() => { onNavSelect?.(i); setNavOpen(false) }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                          i === navIndex
                            ? 'bg-cyan-600 text-white'
                            : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <span className="text-gray-500 font-mono text-xs w-5 shrink-0">{i + 1}.</span>
                        {isMoment && <Clock size={12} className="text-amber-400 shrink-0" />}
                        <span className={`truncate ${isMoment ? 'italic text-amber-300' : ''}`}>{title}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        </div>
      )}

      {/* Chord Format */}
      <div className="relative ml-auto" ref={formatRef}>
        <button
          onClick={() => setFormatOpen((o) => !o)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs uppercase tracking-wider transition-colors ${
            formatOpen ? 'bg-slate-600 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Type size={14} />
          Chord Format
        </button>

        {formatOpen && (
          <div className="absolute right-0 top-full mt-2 z-50 bg-slate-800 border border-slate-600 rounded-xl shadow-xl p-4 w-56">
            {/* Bold / Italic */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => onChordFormatChange({ ...chordFormat, bold: !chordFormat.bold })}
                className={`flex-1 py-1.5 rounded text-sm font-bold transition-colors ${
                  chordFormat.bold ? 'bg-slate-500 text-white' : 'bg-slate-700 text-gray-400 hover:text-white'
                }`}
              >
                B
              </button>
              <button
                onClick={() => onChordFormatChange({ ...chordFormat, italic: !chordFormat.italic })}
                className={`flex-1 py-1.5 rounded text-sm italic transition-colors ${
                  chordFormat.italic ? 'bg-slate-500 text-white' : 'bg-slate-700 text-gray-400 hover:text-white'
                }`}
              >
                I
              </button>
            </div>

            {/* Color */}
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Farbe</div>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_OPTIONS.map(({ value, label, cls }) => (
                <button
                  key={value}
                  onClick={() => onChordFormatChange({ ...chordFormat, color: value })}
                  className={`flex flex-col items-center gap-1 py-1.5 px-1 rounded transition-colors ${
                    chordFormat.color === value ? 'bg-slate-600 ring-1 ring-white/30' : 'hover:bg-slate-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${cls}`} />
                  <span className="text-xs text-gray-300">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
