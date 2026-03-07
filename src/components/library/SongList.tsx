import type { Song, Setlist } from '@/lib/types'
import SongCard from './SongCard'

interface SongListProps {
  songs: Song[]
  setlists?: Setlist[]
}

export default function SongList({ songs, setlists = [] }: SongListProps) {
  return (
    <div className="grid gap-3">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} setlists={setlists} />
      ))}
    </div>
  )
}
