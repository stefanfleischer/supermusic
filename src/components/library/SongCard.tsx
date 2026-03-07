import { useRef, useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { ListPlus, Check } from 'lucide-react'
import type { Song, Setlist } from '@/lib/types'
import { updateSetlist } from '@/lib/server/setlists'
import Badge from '@/components/ui/Badge'

interface SongCardProps {
  song: Song
  setlists?: Setlist[]
}

export default function SongCard({ song, setlists = [] }: SongCardProps) {
  const [open, setOpen] = useState(false)
  const [added, setAdded] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const firstLine = song.content
    .split('\n')
    .find((line) => line.trim() && !line.trim().startsWith('{'))
    ?.replace(/\[.*?\]/g, '')
    ?.trim()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  async function handleAddToSetlist(setlist: Setlist) {
    await updateSetlist({
      data: {
        id: setlist.id,
        songEntries: [...setlist.songEntries, { songId: song.id, transposeSemitones: 0, capo: 0, notes: '' }],
      },
    })
    setAdded(setlist.id)
    setTimeout(() => {
      setAdded(null)
      setOpen(false)
    }, 1200)
  }

  return (
    <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
      <Link
        to="/songs/$songId"
        params={{ songId: song.id }}
        className="block"
      >
        <div className="flex items-start justify-between gap-3 pr-10">
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold truncate">{song.title || 'Untitled'}</h3>
            {song.artist && (
              <p className="text-gray-400 text-sm truncate">{song.artist}</p>
            )}
            {firstLine && (
              <p className="text-gray-500 text-sm mt-1 truncate italic">{firstLine}</p>
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

      {/* Add to setlist */}
      {setlists.length > 0 && (
        <div ref={dropdownRef} className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.preventDefault(); setOpen((o) => !o) }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
            title="Add to Setlist"
          >
            <ListPlus size={16} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-slate-800 border border-slate-600 rounded-xl shadow-xl py-1 min-w-48 max-h-64 overflow-y-auto">
              <p className="px-3 py-1.5 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Add to Setlist
              </p>
              {setlists.map((setlist) => {
                const isAdded = added === setlist.id
                const alreadyIn = setlist.songEntries.some((e) => e.songId === song.id)
                return (
                  <button
                    key={setlist.id}
                    onClick={(e) => { e.preventDefault(); handleAddToSetlist(setlist) }}
                    className="w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 text-gray-300 hover:bg-slate-700 hover:text-white"
                  >
                    {isAdded ? (
                      <Check size={14} className="text-green-400 shrink-0" />
                    ) : (
                      <div className="w-3.5 shrink-0" />
                    )}
                    <span className="truncate flex-1">{setlist.name}</span>
                    {alreadyIn && !isAdded && (
                      <span className="text-xs text-gray-500 shrink-0">already in</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
