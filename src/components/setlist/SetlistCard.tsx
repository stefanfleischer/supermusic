import { Link } from '@tanstack/react-router'
import { ListMusic, Calendar } from 'lucide-react'
import type { Setlist } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface SetlistCardProps {
  setlist: Setlist
}

export default function SetlistCard({ setlist }: SetlistCardProps) {
  return (
    <Link
      to={'/setlists/$setlistId' as '/'}
      params={{ setlistId: setlist.id } as any}
      className="block bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <div className="flex items-start gap-3">
        <ListMusic size={20} className="text-cyan-400 mt-1 shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-semibold truncate">{setlist.name}</h3>
          {setlist.description && (
            <p className="text-gray-400 text-sm truncate mt-1">
              {setlist.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">
              {setlist.songEntries.length}{' '}
              {setlist.songEntries.length === 1 ? 'song' : 'songs'}
            </Badge>
            {setlist.date && (
              <span className="flex items-center gap-1 text-gray-500 text-xs">
                <Calendar size={12} />
                {new Date(setlist.date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
