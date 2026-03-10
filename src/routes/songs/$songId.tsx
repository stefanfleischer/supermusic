import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { ArrowLeft, Edit, Trash2, Pencil, StickyNote } from 'lucide-react'
import { getSong, deleteSong } from '@/lib/server/songs'
import { parseChordPro } from '@/lib/chordpro/parser'
import { keyUsesFlats } from '@/lib/chordpro/transpose'
import { defaultChordFormat, type ChordFormat } from '@/components/song/ChordFormatContext'
import { useSongSettings } from '@/lib/useSongSettings'
import { useSongAnnotations } from '@/lib/useSongAnnotations'
import SongRenderer from '@/components/song/SongRenderer'
import SongNote from '@/components/song/SongNote'
import TransposeControls from '@/components/song/TransposeControls'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Badge from '@/components/ui/Badge'

export const Route = createFileRoute('/songs/$songId')({
  validateSearch: (search: Record<string, unknown>) => ({
    bookId: (search.bookId as string) || '',
  }),
  loader: async ({ params }) => {
    const song = await getSong({ data: { id: params.songId } })
    if (!song) throw new Error('Song not found')
    return { song }
  },
  component: SongViewPage,
})

function SongViewPage() {
  const { song } = Route.useLoaderData()
  const { bookId } = Route.useSearch()
  const navigate = useNavigate()

  const backLink = bookId
    ? { to: '/books/$bookId' as '/', params: { bookId } as any, search: undefined }
    : { to: '/songs' as '/', params: {} as any, search: { q: '', key: '', artist: '', tag: '', sort: 'title' } }
  const {
    transposeSemitones, setTransposeSemitones,
    capo, setCapo,
    capoEnabled, setCapoEnabled,
    preferFlats, setPreferFlats,
  } = useSongSettings(song.id, song.key, song.capo)
  const [chordFormat, setChordFormat] = useState<ChordFormat>(() => {
    try {
      const stored = localStorage.getItem('chordFormat')
      return stored ? { ...defaultChordFormat, ...JSON.parse(stored) } : defaultChordFormat
    } catch {
      return defaultChordFormat
    }
  })

  function handleChordFormatChange(format: ChordFormat) {
    setChordFormat(format)
    try { localStorage.setItem('chordFormat', JSON.stringify(format)) } catch {}
  }
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCommentToolbar, setShowCommentToolbar] = useState(false)
  const { annotations, addNote, updateNote, removeNote } = useSongAnnotations(song.id)
  const notes = annotations.filter((a) => a.type === 'note')

  const parsedSong = useMemo(() => parseChordPro(song.content), [song.content])

  async function handleDelete() {
    await deleteSong({ data: { id: song.id } })
    navigate({ to: '/songs', search: { q: '', key: '', artist: '', tag: '', sort: 'title' } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to={backLink.to}
              params={backLink.params}
              search={backLink.search as any}
              className="p-2 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {song.title || 'Untitled'}
              </h1>
              {song.artist && (
                <p className="text-gray-400">{song.artist}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/songs/$songId/edit"
              params={{ songId: song.id }}
              search={bookId ? { bookId } as any : undefined}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
            >
              <Edit size={16} />
              Edit Song
            </Link>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Song metadata badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {song.key && <Badge variant="cyan">Original Key: {song.key}</Badge>}
          {song.tempo && <Badge variant="outline">{song.tempo} BPM</Badge>}
          {song.timeSignature && (
            <Badge variant="outline">{song.timeSignature}</Badge>
          )}
          {song.capo > 0 && <Badge variant="outline">Capo {song.capo}</Badge>}
          {song.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        {/* Transpose controls */}
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
              + Notiz
            </button>
          </div>
        )}

        {/* Song content + floating notes */}
        <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <SongRenderer
            parsedSong={parsedSong}
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

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Song"
        message={`Are you sure you want to delete "${song.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
