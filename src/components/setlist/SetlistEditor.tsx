import { useState } from 'react'
import { Plus, Search, Clock } from 'lucide-react'
import type { Song, SetlistEntry, Book } from '@/lib/types'
import SetlistSongRow from './SetlistSongRow'

interface SetlistEditorProps {
  entries: SetlistEntry[]
  allSongs: Song[]
  books?: Book[]
  onChange: (entries: SetlistEntry[]) => void
}

export default function SetlistEditor({
  entries,
  allSongs,
  books = [],
  onChange,
}: SetlistEditorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const entryIds = new Set(entries.map((e) => e.songId))

  const bookSongIds = selectedBook
    ? new Set(books.find((b) => b.name === selectedBook)?.songIds ?? [])
    : null

  const filteredAvailable = allSongs.filter((s) => {
    if (bookSongIds && !bookSongIds.has(s.id)) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q)
      )
    }
    return true
  })

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

          {/* Book filter buttons */}
          {books.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {books.map((book) => (
                <button
                  key={book.id}
                  onClick={() =>
                    setSelectedBook(selectedBook === book.name ? null : book.name)
                  }
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                    selectedBook === book.name
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-gray-400 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  {book.name}
                </button>
              ))}
            </div>
          )}
          <div className="max-h-40 overflow-y-auto space-y-1">
            {filteredAvailable.length === 0 ? (
              <p className="text-gray-500 text-sm py-2 text-center">
                No matching songs
              </p>
            ) : (
              filteredAvailable.map((song) => (
                <button
                  key={song.id}
                  onClick={() => addSong(song.id)}
                  className="w-full text-left px-2 py-1.5 rounded text-sm text-gray-300 hover:bg-slate-800 transition-colors flex items-center justify-between gap-2"
                >
                  <span className="truncate flex-1">
                    {song.title}
                    {song.artist && (
                      <span className="text-gray-500"> - {song.artist}</span>
                    )}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {entryIds.has(song.id) && (
                      <span className="text-xs text-gray-500">already in</span>
                    )}
                    <Plus size={14} className="text-cyan-400" />
                  </div>
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
