import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { getSong, deleteSong } from '@/lib/server/songs'
import { parseChordPro } from '@/lib/chordpro/parser'
import SongRenderer from '@/components/song/SongRenderer'
import TransposeControls from '@/components/song/TransposeControls'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Badge from '@/components/ui/Badge'

export const Route = createFileRoute('/songs/$songId')({
  loader: async ({ params }) => {
    const song = await getSong({ data: { id: params.songId } })
    if (!song) throw new Error('Song not found')
    return { song }
  },
  component: SongViewPage,
})

function SongViewPage() {
  const { song } = Route.useLoaderData()
  const navigate = useNavigate()
  const [transposeSemitones, setTransposeSemitones] = useState(0)
  const [capo, setCapo] = useState(song.capo)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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
              to="/songs"
              search={{ q: '', key: '', artist: '', tag: '', sort: 'title' }}
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

        {/* Song metadata badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {song.key && <Badge variant="cyan">Key: {song.key}</Badge>}
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
            onTransposeChange={setTransposeSemitones}
            onCapoChange={setCapo}
          />
        </div>

        {/* Song content */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <SongRenderer
            parsedSong={parsedSong}
            transposeSemitones={transposeSemitones}
          />
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
