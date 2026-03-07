import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { ArrowLeft, Edit, Trash2, X } from 'lucide-react'
import { getSetlist, deleteSetlist, updateSetlist } from '@/lib/server/setlists'
import { getSongs } from '@/lib/server/songs'
import { parseChordPro } from '@/lib/chordpro/parser'
import { keyUsesFlats } from '@/lib/chordpro/transpose'
import SongRenderer from '@/components/song/SongRenderer'
import TransposeControls from '@/components/song/TransposeControls'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Badge from '@/components/ui/Badge'
import { defaultChordFormat, type ChordFormat } from '@/components/song/ChordFormatContext'

import type { SetlistEntry, Song } from '@/lib/types'

function CurrentSongView({
  entries,
  currentIndex,
  songMap,
  onPrev,
  onNext,
  onRemove,
  onNavSelect,
}: {
  entries: SetlistEntry[]
  currentIndex: number
  songMap: Map<string, Song>
  onPrev: () => void
  onNext: () => void
  onRemove: () => void
  onNavSelect: (index: number) => void
}) {
  const entry = entries[currentIndex]
  const song = songMap.get(entry.songId)

  const [transposeSemitones, setTransposeSemitones] = useState(entry.transposeSemitones)
  const [capo, setCapo] = useState(song?.capo ?? 0)
  const [capoEnabled, setCapoEnabled] = useState((song?.capo ?? 0) > 0)
  const [preferFlats, setPreferFlats] = useState(() => keyUsesFlats(song?.key ?? null))
  const [chordFormat, setChordFormat] = useState<ChordFormat>(() => {
    try {
      const stored = localStorage.getItem('chordFormat')
      return stored ? { ...defaultChordFormat, ...JSON.parse(stored) } : defaultChordFormat
    } catch { return defaultChordFormat }
  })

  function handleChordFormatChange(format: ChordFormat) {
    setChordFormat(format)
    try { localStorage.setItem('chordFormat', JSON.stringify(format)) } catch {}
  }

  const parsed = useMemo(() => song ? parseChordPro(song.content) : null, [song])

  if (!song || !parsed) return null

  return (
    <div>
      {/* Song header */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{song.title}</h2>
            {song.artist && <p className="text-gray-400">{song.artist}</p>}
          </div>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Aus Setlist entfernen"
          >
            <X size={18} />
          </button>
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {song.key && <Badge variant="cyan">Original Key: {song.key}</Badge>}
          {song.tempo && <Badge variant="outline">{song.tempo} BPM</Badge>}
          {song.timeSignature && <Badge variant="outline">{song.timeSignature}</Badge>}
          {song.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>
      </div>

      {/* TransposeControls with prev/next */}
      <div className="mb-6">
        <TransposeControls
          originalKey={song.key}
          transposeSemitones={transposeSemitones}
          capo={capo}
          capoEnabled={capoEnabled}
          preferFlats={preferFlats}
          chordFormat={chordFormat}
          onTransposeChange={setTransposeSemitones}
          onCapoChange={setCapo}
          onCapoEnabledChange={setCapoEnabled}
          onPreferFlatsChange={setPreferFlats}
          onChordFormatChange={handleChordFormatChange}
          onPrev={onPrev}
          onNext={onNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < entries.length - 1}
          navIndex={currentIndex}
          navTotal={entries.length}
          navItems={entries.map((e) => songMap.get(e.songId)?.title ?? '–')}
          onNavSelect={onNavSelect}
        />
      </div>

      {/* Song content */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <SongRenderer
          parsedSong={parsed}
          transposeSemitones={transposeSemitones - (capoEnabled ? capo : 0)}
          preferFlats={preferFlats}
          chordFormat={chordFormat}
        />
      </div>
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
              Edit Setlist
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
            onNavSelect={(i) => setCurrentIndex(i)}
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
