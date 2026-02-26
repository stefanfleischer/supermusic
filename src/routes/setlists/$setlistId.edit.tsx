import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { getSetlist, updateSetlist } from '@/lib/server/setlists'
import { getSongs } from '@/lib/server/songs'
import type { SetlistEntry } from '@/lib/types'
import SetlistEditor from '@/components/setlist/SetlistEditor'

export const Route = createFileRoute('/setlists/$setlistId/edit')({
  loader: async ({ params }) => {
    const [setlist, songs] = await Promise.all([
      getSetlist({ data: { id: params.setlistId } }),
      getSongs(),
    ])
    if (!setlist) throw new Error('Setlist not found')
    return { setlist, songs }
  },
  component: EditSetlistPage,
})

function EditSetlistPage() {
  const { setlist, songs } = Route.useLoaderData()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(setlist.name)
  const [description, setDescription] = useState(setlist.description)
  const [date, setDate] = useState(setlist.date || '')
  const [entries, setEntries] = useState<SetlistEntry[]>(setlist.songEntries)

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      await updateSetlist({
        data: {
          id: setlist.id,
          name: name.trim(),
          description: description.trim(),
          date: date || null,
          songEntries: entries,
        },
      })
      navigate({
        to: '/setlists/$setlistId' as '/',
        params: { setlistId: setlist.id } as any,
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
              to={'/setlists/$setlistId' as '/'}
              params={{ setlistId: setlist.id } as any}
              className="p-2 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Edit: {setlist.name}
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
                Setlist Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Setlist name"
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
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Performance Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <SetlistEditor
              entries={entries}
              allSongs={songs}
              onChange={setEntries}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
