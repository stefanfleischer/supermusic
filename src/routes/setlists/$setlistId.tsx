import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { ArrowLeft, Edit, Trash2, X, ChevronLeft, ChevronRight, Clock, Pencil, StickyNote } from 'lucide-react'
import { getSetlist, deleteSetlist, updateSetlist } from '@/lib/server/setlists'
import { getSongs } from '@/lib/server/songs'
import { parseChordPro } from '@/lib/chordpro/parser'
import { useSongSettings } from '@/lib/useSongSettings'
import { useSongAnnotations } from '@/lib/useSongAnnotations'
import SongRenderer from '@/components/song/SongRenderer'
import SongNote from '@/components/song/SongNote'
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
  setlistId,
  onNavSelect,
}: {
  entries: SetlistEntry[]
  currentIndex: number
  songMap: Map<string, Song>
  setlistId: string
  onPrev: () => void
  onNext: () => void
  onRemove: () => void
  onNavSelect: (index: number) => void
}) {
  const entry = entries[currentIndex]
  const song = songMap.get(entry.songId)

  const {
    transposeSemitones, setTransposeSemitones,
    capo, setCapo,
    capoEnabled, setCapoEnabled,
    preferFlats, setPreferFlats,
  } = useSongSettings(song?.id ?? '', song?.key ?? null, song?.capo ?? 0)
  const [navOpen, setNavOpen] = useState(false)
  const [showCommentToolbar, setShowCommentToolbar] = useState(false)
  const { annotations, addNote, updateNote, removeNote } = useSongAnnotations(song?.id ?? '')
  const notes = annotations.filter((a) => a.type === 'note')
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

  // Moment view — same layout structure as Song view to avoid nav jumping
  if (entry.momentTitle !== undefined) {
    const navItemsList = entries.map((e) => e.momentTitle !== undefined ? (e.momentTitle || 'Pause') : (songMap.get(e.songId)?.title ?? '–'))
    const navItemMomentsList = entries.map((e) => e.momentTitle !== undefined)
    return (
      <div>
        {/* Header — same structure as song header */}
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{entry.momentTitle || 'Pause'}</h2>
              {/* invisible artist placeholder — same height as artist line */}
              <p className="text-gray-400 opacity-0 select-none" aria-hidden>A</p>
            </div>
            {/* invisible button placeholders — same width/height as Edit+Remove */}
            <div className="flex items-center gap-2 opacity-0 pointer-events-none" aria-hidden>
              <div className="flex items-center gap-2 px-3 py-2 text-sm">
                <Edit size={16} />
                Edit Song
              </div>
              <div className="p-2">
                <X size={18} />
              </div>
            </div>
          </div>
          {/* invisible badge placeholder — same height as badge row */}
          <div className="flex flex-wrap gap-2 mt-3 opacity-0 pointer-events-none select-none" aria-hidden>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs">placeholder</span>
          </div>
        </div>

        {/* TransposeControls — moment mode: only nav */}
        <div className="mb-6">
          <TransposeControls
            originalKey={null}
            transposeSemitones={0}
            capo={0}
            capoEnabled={false}
            preferFlats={false}
            chordFormat={chordFormat}
            onTransposeChange={() => {}}
            onCapoChange={() => {}}
            onCapoEnabledChange={() => {}}
            onPreferFlatsChange={() => {}}
            onChordFormatChange={handleChordFormatChange}
            onPrev={onPrev}
            onNext={onNext}
            hasPrev={currentIndex > 0}
            hasNext={currentIndex < entries.length - 1}
            navIndex={currentIndex}
            navTotal={entries.length}
            navItems={navItemsList}
            navItemMoments={navItemMomentsList}
            onNavSelect={onNavSelect}
            momentMode
          />
        </div>

        {/* Moment body — same card style as song content */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <span className="text-2xl">⏸</span>
          </div>
          {entry.momentTitle && (
            <p className="text-amber-300 text-sm">{entry.momentTitle}</p>
          )}
        </div>
      </div>
    )
  }

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
          <div className="flex items-center gap-2">
            <Link
              to="/songs/$songId/edit"
              params={{ songId: song.id }}
              search={{ setlistId } as any}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors text-sm"
            >
              <Edit size={16} />
              Edit Song
            </Link>
            <button
              onClick={onRemove}
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Aus Setlist entfernen"
            >
              <X size={18} />
            </button>
          </div>
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
          navItems={entries.map((e) => e.momentTitle !== undefined ? (e.momentTitle || 'Pause') : (songMap.get(e.songId)?.title ?? '–'))}
          navItemMoments={entries.map((e) => e.momentTitle !== undefined)}
          onNavSelect={onNavSelect}
          showCommentToolbar={showCommentToolbar}
          onToggleCommentToolbar={() => setShowCommentToolbar((v) => !v)}
        />
      </div>

      {/* Comment toolbar */}
      {showCommentToolbar && (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg mb-4 text-gray-400">
          <Pencil size={15} />
          <span className="text-sm">Comment</span>
          <div className="flex-1" />
          <button
            onClick={addNote}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 text-xs font-medium transition-colors"
          >
            <StickyNote size={13} />
            + Text
          </button>
        </div>
      )}

      {/* Song content + floating notes */}
      <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <SongRenderer
          parsedSong={parsed}
          transposeSemitones={transposeSemitones - (capoEnabled ? capo : 0)}
          preferFlats={preferFlats}
          chordFormat={chordFormat}
        />
        {notes.map((note) => (
          <SongNote
            key={note.id}
            annotation={note}
            onUpdate={updateNote}
            onDelete={removeNote}
          />
        ))}
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
            setlistId={setlist.id}
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
