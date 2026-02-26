import { useState } from 'react'
import { Plus, X, Search } from 'lucide-react'
import type { Song } from '@/lib/types'

interface BookEditorProps {
  songIds: string[]
  allSongs: Song[]
  onChange: (songIds: string[]) => void
}

export default function BookEditor({
  songIds,
  allSongs,
  onChange,
}: BookEditorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const songsInBook = allSongs.filter((s) => songIds.includes(s.id))
  const availableSongs = allSongs.filter((s) => !songIds.includes(s.id))
  const filteredAvailable = searchQuery
    ? availableSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.artist.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : availableSongs

  function addSong(songId: string) {
    onChange([...songIds, songId])
  }

  function removeSong(songId: string) {
    onChange(songIds.filter((id) => id !== songId))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Songs ({songsInBook.length})
        </h3>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Plus size={16} />
          Add Song
        </button>
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
                  ? 'All songs already in this book'
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

      {/* Songs in book */}
      <div className="space-y-1">
        {songsInBook.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            No songs in this book yet. Click "Add Song" to get started.
          </p>
        ) : (
          songsInBook.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-lg"
            >
              <span className="text-white text-sm truncate">
                {song.title}
                {song.artist && (
                  <span className="text-gray-400"> - {song.artist}</span>
                )}
              </span>
              <button
                onClick={() => removeSong(song.id)}
                className="p-1 text-gray-500 hover:text-red-400 transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
