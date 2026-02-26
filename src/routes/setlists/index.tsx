import { createFileRoute, Link } from '@tanstack/react-router'
import { ListMusic, Plus } from 'lucide-react'
import { getSetlists } from '@/lib/server/setlists'
import SetlistCard from '@/components/setlist/SetlistCard'
import EmptyState from '@/components/ui/EmptyState'

export const Route = createFileRoute('/setlists/')({
  loader: async () => {
    const setlists = await getSetlists()
    return { setlists }
  },
  component: SetlistsPage,
})

function SetlistsPage() {
  const { setlists } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Setlists</h1>
            <p className="text-gray-400 mt-1">
              {setlists.length} {setlists.length === 1 ? 'setlist' : 'setlists'}
            </p>
          </div>
          <Link
            to="/setlists/new"
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors shadow-lg shadow-cyan-500/25"
          >
            <Plus size={18} />
            New Setlist
          </Link>
        </div>

        {setlists.length > 0 ? (
          <div className="grid gap-3">
            {setlists.map((setlist) => (
              <SetlistCard key={setlist.id} setlist={setlist} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ListMusic size={48} />}
            title="No setlists yet"
            description="Setlists let you organize songs in order for live performance. Create your first setlist to get started."
            action={
              <Link
                to="/setlists/new"
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Create Your First Setlist
              </Link>
            }
          />
        )}
      </div>
    </div>
  )
}
