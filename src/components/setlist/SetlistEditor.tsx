import { useState } from 'react'
import { Plus, Search, Clock } from 'lucide-react'
import type { Song, SetlistEntry } from '@/lib/types'
import SetlistSongRow from './SetlistSongRow'

interface SetlistEditorProps {
  entries: SetlistEntry[]
  allSongs: Song[]
  onChange: (entries: SetlistEntry[]) => void
}

export default function SetlistEditor({
  entries,
  allSongs,
  onChange,
}: SetlistEditorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const entryIds = new Set(entries.map((e) => e.songId))
  const availableSongs = allSongs.filter((s) => !entryIds.has(s.id))
  const filteredAvailable = searchQuery
    ? availableSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.artist.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : availableSongs

  function addSong(songId: string) {
    onChange([
      ...entries,
      { songId, transposeSemitones: 0, capo: 0, notes: '' },
    ])
  }

  function addMoment() {
    onChange([
      ...entries,
      { songId: '', momentTitle: 'Pause', transposeSemitones: 0, capo: 0, notes: '' },
    ])
  }

  function removeSong(index: number) {
    onChange(entries.filter((_, i) => i !== index))
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return
    const newEntries = [...entries]
    const [moved] = newEntries.splice(dragIndex, 1)
    newEntries.splice(targetIndex, 0, moved)
    onChange(newEntries)
    setDragIndex(null)
    setDragOverIndex(null)
  }

  function updateEntry(index: number, updates: Partial<SetlistEntry>) {
    const newEntries = [...entries]
    newEntries[index] = { ...newEntries[index], ...updates }
    onChange(newEntries)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Songs ({entries.length})
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={addMoment}
            className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Clock size={16} />
            Add Moment
          </button>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Plus size={16} />
            Add Song
          </button>
        </div>
      </div>

      {/* Song picker */}
      {showPicker && (
        <div className="mb-4 bg-slate-900 border border-slate-600 rounded-lg p-3">
          <div className="relative mb-2">
            <Search
              size={16}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs to add..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {filteredAvailable.length === 0 ? (
              <p className="text-gray-500 text-sm py-2 text-center">
                {availableSongs.length === 0
                  ? 'All songs already in setlist'
                  : 'No matching songs'}
              </p>
            ) : (
              filteredAvailable.map((song) => (
                <button
                  key={song.id}
                  onClick={() => addSong(song.id)}
                  className="w-full text-left px-2 py-1.5 rounded text-sm text-gray-300 hover:bg-slate-800 transition-colors flex items-center justify-between"
                >
                  <span className="truncate">
                    {song.title}
                    {song.artist && (
                      <span className="text-gray-500"> - {song.artist}</span>
                    )}
                  </span>
                  <Plus size={14} className="shrink-0 text-cyan-400" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Setlist entries */}
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            No songs in this setlist yet. Click "Add Song" to get started.
          </p>
        ) : (
          entries.map((entry, index) => (
            <SetlistSongRow
              key={`${entry.songId}-${index}`}
              entry={entry}
              song={allSongs.find((s) => s.id === entry.songId)}
              index={index}
              isDragging={dragIndex === index}
              isDragOver={dragOverIndex === index && dragIndex !== index}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index) }}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null) }}
              onRemove={() => removeSong(index)}
              onUpdate={(updates) => updateEntry(index, updates)}
            />
          ))
        )}
      </div>
    </div>
  )
}
