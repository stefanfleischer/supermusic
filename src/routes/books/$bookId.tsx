import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Edit, Trash2, Music } from 'lucide-react'
import { getBook, deleteBook } from '@/lib/server/books'
import { getSongs } from '@/lib/server/songs'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Badge from '@/components/ui/Badge'

export const Route = createFileRoute('/books/$bookId')({
  loader: async ({ params }) => {
    const [book, songs] = await Promise.all([
      getBook({ data: { id: params.bookId } }),
      getSongs(),
    ])
    if (!book) throw new Error('Book not found')
    return { book, songs }
  },
  component: BookViewPage,
})

function BookViewPage() {
  const { book, songs } = Route.useLoaderData()
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const bookSongs = songs.filter((s) => book.songIds.includes(s.id))

  async function handleDelete() {
    await deleteBook({ data: { id: book.id } })
    navigate({ to: '/books' as '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/books"
              className="p-2 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{book.name}</h1>
              {book.description && (
                <p className="text-gray-400">{book.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={'/books/$bookId/edit' as '/'}
              params={{ bookId: book.id } as any}
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

        <Badge variant="outline" className="mb-6">
          {bookSongs.length} {bookSongs.length === 1 ? 'song' : 'songs'}
        </Badge>

        {bookSongs.length > 0 ? (
          <div className="space-y-2">
            {bookSongs.map((song) => (
              <Link
                key={song.id}
                to="/songs/$songId"
                params={{ songId: song.id }}
                className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all"
              >
                <Music size={16} className="text-cyan-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-white text-sm">{song.title}</span>
                  {song.artist && (
                    <span className="text-gray-400 text-sm ml-2">
                      {song.artist}
                    </span>
                  )}
                </div>
                {song.key && <Badge variant="cyan">{song.key}</Badge>}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              This book has no songs yet. Edit it to add some.
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Book"
        message={`Are you sure you want to delete "${book.name}"? The songs themselves will not be deleted.`}
      />
    </div>
  )
}
