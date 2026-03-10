import { Filter } from 'lucide-react'
import { ALL_KEYS } from '@/lib/chordpro/constants'
import type { Song } from '@/lib/types'

interface FilterPanelProps {
  songs: Song[] // full unfiltered list, to derive filter options
  selectedKey: string
  selectedArtist: string
  selectedTag: string
  selectedBook: string
  sortBy: string
  bookOptions?: string[] // if provided, use instead of deriving from song.books
  onKeyChange: (key: string) => void
  onArtistChange: (artist: string) => void
  onTagChange: (tag: string) => void
  onBookChange: (book: string) => void
  onSortChange: (sort: string) => void
}

export default function FilterPanel({
  songs,
  selectedKey,
  selectedArtist,
  selectedTag,
  selectedBook,
  sortBy,
  bookOptions,
  onKeyChange,
  onArtistChange,
  onTagChange,
  onBookChange,
  onSortChange,
}: FilterPanelProps) {
  // Derive unique artists and tags from the song library
  const artists = [...new Set(songs.map((s) => s.artist).filter(Boolean))].sort()
  const tags = [...new Set(songs.flatMap((s) => s.tags).filter(Boolean))].sort()
  const books = bookOptions ?? [...new Set(songs.flatMap((s) => s.books).filter(Boolean))].sort()

  const selectClass =
    'bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 transition-colors'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Filter size={16} className="text-gray-500 shrink-0" />

      <select
        value={selectedKey}
        onChange={(e) => onKeyChange(e.target.value)}
        className={selectClass}
      >
        <option value="">All Keys</option>
        {ALL_KEYS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>

      {artists.length > 0 && (
        <select
          value={selectedArtist}
          onChange={(e) => onArtistChange(e.target.value)}
          className={selectClass}
        >
          <option value="">All Artists</option>
          {artists.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      )}

      {tags.length > 0 && (
        <select
          value={selectedTag}
          onChange={(e) => onTagChange(e.target.value)}
          className={selectClass}
        >
          <option value="">All Tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}

      {books.length > 0 && (
        <select
          value={selectedBook}
          onChange={(e) => onBookChange(e.target.value)}
          className={selectClass}
        >
          <option value="">All Books</option>
          {books.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      )}

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className={selectClass}
      >
        <option value="title">Sort: Title</option>
        <option value="artist">Sort: Artist</option>
        <option value="recent">Sort: Recent</option>
      </select>
    </div>
  )
}
