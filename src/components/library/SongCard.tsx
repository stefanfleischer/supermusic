import { Link } from '@tanstack/react-router'
import type { Song } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface SongCardProps {
  song: Song
}

export default function SongCard({ song }: SongCardProps) {
  // Extract first line of lyrics from content
  const firstLine = song.content
    .split('\n')
    .find((line) => line.trim() && !line.trim().startsWith('{'))
    ?.replace(/\[.*?\]/g, '') // strip chord markers
    ?.trim()

  return (
    <Link
      to="/songs/$songId"
      params={{ songId: song.id }}
      className="block bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-semibold truncate">{song.title || 'Untitled'}</h3>
          {song.artist && (
            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          )}
          {firstLine && (
            <p className="text-gray-500 text-sm mt-1 truncate italic">
              {firstLine}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {song.key && <Badge variant="cyan">{song.key}</Badge>}
          {song.tempo && <Badge variant="outline">{song.tempo} bpm</Badge>}
        </div>
      </div>
      {song.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {song.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}
    </Link>
  )
}
