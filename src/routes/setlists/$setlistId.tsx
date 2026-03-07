import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Edit, Trash2, Music, X } from 'lucide-react'
import { getSetlist, deleteSetlist, updateSetlist } from '@/lib/server/setlists'
import { getSongs } from '@/lib/server/songs'
import { parseChordPro } from '@/lib/chordpro/parser'
import SongRenderer from '@/components/song/SongRenderer'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Badge from '@/components/ui/Badge'

import type { SetlistEntry, Song } from '@/lib/types'

function CurrentSongView({
  entries,
  currentIndex,
  songMap,
  onPrev,
  onNext,
  onRemove,
}: {
  entries: SetlistEntry[]
  currentIndex: number
  songMap: Map<string, Song>
  onPrev: () => void
  onNext: () => void
  onRemove: () => void
}) {
  const entry = entries[currentIndex]
  const song = songMap.get(entry.songId)
  const parsed = song ? parseChordPro(song.content) : null

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-gray-500 text-sm font-mono shrink-0">
          {currentIndex + 1} / {entries.length}
        </span>
        <button
          onClick={onNext}
          disabled={currentIndex === entries.length - 1}
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
        <Music size={16} className="text-cyan-400 shrink-0" />
        {song && (
          <Link
            to="/songs/$songId"
            params={{ songId: song.id }}
            className="text-white font-semibold hover:text-cyan-400 transition-colors flex-1 truncate"
          >
            {song.title}
          </Link>
        )}
        {song?.artist && (
          <span className="text-gray-400 text-sm shrink-0">{song.artist}</span>
        )}
        {song?.key && (
          <Badge variant="cyan">
            {entry.transposeSemitones !== 0
              ? `${song.key} (+${entry.transposeSemitones})`
              : song.key}
          </Badge>
        )}
        <button
          onClick={onRemove}
          className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
          title="Aus Setlist entfernen"
        >
          <X size={16} />
        </button>
      </div>
      {parsed && song && (
        <SongRenderer parsedSong={parsed} transposeSemitones={entry.transposeSemitones} />
      )}
    </div>
  )
}

export const Route = createFileRoute('/setlists/$setlistId')({
  loader: async ({ params }) => {
    const [setlist, songs] = await Promise.all([
      getSetlist({ data: { id: params.setlistId } }),
      getSongs(),
    ])
    if (!setlist) throw new Error('Setlist not found')
    return { setlist, songs }
  },
  component: SetlistViewPage,
})

function SetlistViewPage() {
  const { setlist, songs } = Route.useLoaderData()
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [entries, setEntries] = useState(setlist.songEntries)
  const [currentIndex, setCurrentIndex] = useState(0)

  const songMap = useMemo(() => {
    const map = new Map(songs.map((s) => [s.id, s]))
    return map
  }, [songs])

  async function handleDelete() {
    await deleteSetlist({ data: { id: setlist.id } })
    navigate({ to: '/setlists' as '/' })
  }

  async function handleRemoveEntry(index: number) {
    const updated = entries.filter((_, i) => i !== index)
    setEntries(updated)
    if (currentIndex >= updated.length) setCurrentIndex(Math.max(0, updated.length - 1))
    await updateSetlist({ data: { id: setlist.id, songEntries: updated } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/setlists"
              className="p-2 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{setlist.name}</h1>
              {setlist.description && (
                <p className="text-gray-400">{setlist.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={'/setlists/$setlistId/edit' as '/'}
              params={{ setlistId: setlist.id } as any}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
            >
              <Edit size={16} />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline">
            {setlist.songEntries.length}{' '}
            {setlist.songEntries.length === 1 ? 'song' : 'songs'}
          </Badge>
          {setlist.date && (
            <Badge variant="outline">
              {new Date(setlist.date).toLocaleDateString()}
            </Badge>
          )}
        </div>

        {/* Setlist songs rendered sequentially */}
        {entries.length > 0 ? (
          <CurrentSongView
            entries={entries}
            currentIndex={currentIndex}
            songMap={songMap}
            onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            onNext={() => setCurrentIndex((i) => Math.min(entries.length - 1, i + 1))}
            onRemove={() => handleRemoveEntry(currentIndex)}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              This setlist has no songs yet. Edit it to add some.
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Setlist"
        message={`Are you sure you want to delete "${setlist.name}"? The songs themselves will not be deleted.`}
      />
    </div>
  )
}
