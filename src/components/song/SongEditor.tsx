import { useState, useMemo } from 'react'
import { parseChordPro } from '@/lib/chordpro/parser'
import SongRenderer from './SongRenderer'

interface SongEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function SongEditor({ content, onChange }: SongEditorProps) {
  const [showPreview, setShowPreview] = useState(true)

  const parsedSong = useMemo(() => parseChordPro(content), [content])

  return (
    <div className="flex flex-col h-full">
      {/* Toggle for mobile */}
      <div className="flex gap-2 mb-3 md:hidden">
        <button
          onClick={() => setShowPreview(false)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            !showPreview
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-700 text-gray-400'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            showPreview
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-700 text-gray-400'
          }`}
        >
          Preview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Editor */}
        <div className={`flex flex-col ${showPreview ? 'hidden md:flex' : ''}`}>
          <label className="block text-sm text-gray-400 mb-1">
            ChordPro Source
          </label>
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`{title: My Song}\n{artist: Artist Name}\n{key: G}\n\n{start_of_verse: Verse 1}\n[G]Type your [C]lyrics with [D]chords\n{end_of_verse}`}
            spellCheck={false}
            className="flex-1 min-h-[300px] bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-sm resize-none focus:outline-none focus:border-cyan-500 placeholder-gray-600"
          />
        </div>

        {/* Preview */}
        <div className={`flex flex-col ${!showPreview ? 'hidden md:flex' : ''}`}>
          <label className="block text-sm text-gray-400 mb-1">Preview</label>
          <div className="flex-1 min-h-[300px] bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 overflow-y-auto">
            <SongRenderer parsedSong={parsedSong} />
          </div>
        </div>
      </div>
    </div>
  )
}
