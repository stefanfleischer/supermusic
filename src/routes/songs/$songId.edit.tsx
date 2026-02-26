import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { getSong, updateSong } from '@/lib/server/songs'
import SongEditor from '@/components/song/SongEditor'
import SongMetadataForm from '@/components/song/SongMetadataForm'
import type { SongMetadata } from '@/components/song/SongMetadataForm'

export const Route = createFileRoute('/songs/$songId/edit')({
  loader: async ({ params }) => {
    const song = await getSong({ data: { id: params.songId } })
    if (!song) throw new Error('Song not found')
    return { song }
  },
  component: EditSongPage,
})

function EditSongPage() {
  const { song } = Route.useLoaderData()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const [metadata, setMetadata] = useState<SongMetadata>({
    title: song.title,
    artist: song.artist,
    key: song.key || '',
    tempo: song.tempo?.toString() || '',
    timeSignature: song.timeSignature || '',
    capo: song.capo,
    tags: song.tags.join(', '),
    ccli: song.ccli || '',
    copyright: song.copyright || '',
  })

  const [content, setContent] = useState(song.content)

  async function handleSave() {
    if (!metadata.title.trim()) return
    setSaving(true)
    try {
      await updateSong({
        data: {
          id: song.id,
          title: metadata.title.trim(),
          artist: metadata.artist.trim(),
          key: metadata.key || null,
          tempo: metadata.tempo ? Number(metadata.tempo) : null,
          timeSignature: metadata.timeSignature || null,
          capo: metadata.capo,
          tags: metadata.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          ccli: metadata.ccli || null,
          copyright: metadata.copyright || null,
          content,
        },
      })
      navigate({ to: '/songs/$songId', params: { songId: song.id } })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/songs/$songId"
              params={{ songId: song.id }}
              className="p-2 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Edit: {song.title}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !metadata.title.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Song Details
              </h2>
              <SongMetadataForm metadata={metadata} onChange={setMetadata} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <SongEditor content={content} onChange={setContent} />
          </div>
        </div>
      </div>
    </div>
  )
}
