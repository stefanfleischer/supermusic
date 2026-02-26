import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Music, Plus } from 'lucide-react'
import { getSongs } from '@/lib/server/songs'
import type { Song } from '@/lib/types'
import SongList from '@/components/library/SongList'
import SearchBar from '@/components/library/SearchBar'
import FilterPanel from '@/components/library/FilterPanel'
import EmptyState from '@/components/ui/EmptyState'

export const Route = createFileRoute('/songs/')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) || '',
    key: (search.key as string) || '',
    artist: (search.artist as string) || '',
    tag: (search.tag as string) || '',
    sort: (search.sort as string) || 'title',
  }),
  loader: async () => {
    const songs = await getSongs()
    return { songs }
  },
  component: SongsPage,
})

function filterAndSortSongs(
  songs: Song[],
  q: string,
  key: string,
  artist: string,
  tag: string,
  sort: string,
): Song[] {
  let results = songs

  if (q.trim()) {
    const query = q.toLowerCase()
    results = results.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.content.toLowerCase().includes(query) ||
        song.tags.some((t) => t.toLowerCase().includes(query)),
    )
  }

  if (key) {
    results = results.filter((song) => song.key === key)
  }

  if (artist) {
    results = results.filter((song) => song.artist === artist)
  }

  if (tag) {
    results = results.filter((song) => song.tags.includes(tag))
  }

  results.sort((a, b) => {
    switch (sort) {
      case 'artist':
        return a.artist.localeCompare(b.artist)
      case 'recent':
        return b.updatedAt.localeCompare(a.updatedAt)
      default:
        return a.title.localeCompare(b.title)
    }
  })

  return results
}

function SongsPage() {
  const { songs } = Route.useLoaderData()
  const { q, key, artist, tag, sort } = Route.useSearch()
  const navigate = useNavigate()

  const filteredSongs = useMemo(
    () => filterAndSortSongs(songs, q, key, artist, tag, sort),
    [songs, q, key, artist, tag, sort],
  )

  function updateSearch(updates: Record<string, string>) {
    navigate({
      to: '/songs',
      search: { q, key, artist, tag, sort, ...updates },
      replace: true,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Songs</h1>
            <p className="text-gray-400 mt-1">
              {songs.length} {songs.length === 1 ? 'song' : 'songs'} in your
              library
            </p>
          </div>
          <Link
            to="/songs/new"
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors shadow-lg shadow-cyan-500/25"
          >
            <Plus size={18} />
            New Song
          </Link>
        </div>

        {/* Search & Filter */}
        {songs.length > 0 && (
          <div className="space-y-3 mb-6">
            <SearchBar
              value={q}
              onChange={(value) => updateSearch({ q: value })}
            />
            <FilterPanel
              songs={songs}
              selectedKey={key}
              selectedArtist={artist}
              selectedTag={tag}
              sortBy={sort}
              onKeyChange={(value) => updateSearch({ key: value })}
              onArtistChange={(value) => updateSearch({ artist: value })}
              onTagChange={(value) => updateSearch({ tag: value })}
              onSortChange={(value) => updateSearch({ sort: value })}
            />
            {q || key || artist || tag ? (
              <p className="text-sm text-gray-500">
                Showing {filteredSongs.length} of {songs.length} songs
              </p>
            ) : null}
          </div>
        )}

        {/* Song list or empty state */}
        {songs.length === 0 ? (
          <EmptyState
            icon={<Music size={48} />}
            title="No songs yet"
            description="Create your first song to get started. Songs use ChordPro format for easy chord notation."
            action={
              <Link
                to="/songs/new"
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Create Your First Song
              </Link>
            }
          />
        ) : filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No songs match your search. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <SongList songs={filteredSongs} />
        )}
      </div>
    </div>
  )
}
