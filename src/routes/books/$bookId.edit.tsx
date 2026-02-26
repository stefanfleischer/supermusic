import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { getBook, updateBook } from '@/lib/server/books'
import { getSongs } from '@/lib/server/songs'
import BookEditor from '@/components/book/BookEditor'

export const Route = createFileRoute('/books/$bookId/edit')({
  loader: async ({ params }) => {
    const [book, songs] = await Promise.all([
      getBook({ data: { id: params.bookId } }),
      getSongs(),
    ])
    if (!book) throw new Error('Book not found')
    return { book, songs }
  },
  component: EditBookPage,
})

function EditBookPage() {
  const { book, songs } = Route.useLoaderData()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(book.name)
  const [description, setDescription] = useState(book.description)
  const [songIds, setSongIds] = useState(book.songIds)

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      await updateBook({
        data: {
          id: book.id,
          name: name.trim(),
          description: description.trim(),
          songIds,
        },
      })
      navigate({
        to: '/books/$bookId' as '/',
        params: { bookId: book.id } as any,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to={'/books/$bookId' as '/'}
              params={{ bookId: book.id } as any}
              className="p-2 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Edit: {book.name}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Book Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Book name"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description"
                    rows={3}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <BookEditor
              songIds={songIds}
              allSongs={songs}
              onChange={setSongIds}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
