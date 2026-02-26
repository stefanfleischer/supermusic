import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { ArrowLeft, Edit, Trash2, Music } from 'lucide-react'
import { getSetlist, deleteSetlist } from '@/lib/server/setlists'
import { getSongs } from '@/lib/server/songs'
import { parseChordPro } from '@/lib/chordpro/parser'
import SongRenderer from '@/components/song/SongRenderer'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Badge from '@/components/ui/Badge'

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

  const songMap = useMemo(() => {
    const map = new Map(songs.map((s) => [s.id, s]))
    return map
  }, [songs])

  async function handleDelete() {
    await deleteSetlist({ data: { id: setlist.id } })
    navigate({ to: '/setlists' as '/' })
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
        {setlist.songEntries.length > 0 ? (
          <div className="space-y-8">
            {setlist.songEntries.map((entry, index) => {
              const song = songMap.get(entry.songId)
              if (!song) return null
              const parsed = parseChordPro(song.content)

              return (
                <div
                  key={`${entry.songId}-${index}`}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-700">
                    <span className="text-gray-500 text-sm font-mono">
                      {index + 1}.
                    </span>
                    <Music size={16} className="text-cyan-400" />
                    <Link
                      to="/songs/$songId"
                      params={{ songId: song.id }}
                      className="text-white font-semibold hover:text-cyan-400 transition-colors"
                    >
                      {song.title}
                    </Link>
                    {song.artist && (
                      <span className="text-gray-400 text-sm">
                        {song.artist}
                      </span>
                    )}
                    {song.key && (
                      <Badge variant="cyan">
                        {entry.transposeSemitones !== 0
                          ? `${song.key} (+${entry.transposeSemitones})`
                          : song.key}
                      </Badge>
                    )}
                  </div>
                  <SongRenderer
                    parsedSong={parsed}
                    transposeSemitones={entry.transposeSemitones}
                  />
                </div>
              )
            })}
          </div>
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
