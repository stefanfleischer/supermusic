import { Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import type { Book } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link
      to={'/books/$bookId' as '/'}
      params={{ bookId: book.id } as any}
      className="block bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <div className="flex items-start gap-3">
        <BookOpen size={20} className="text-cyan-400 mt-1 shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-semibold truncate">{book.name}</h3>
          {book.description && (
            <p className="text-gray-400 text-sm truncate mt-1">
              {book.description}
            </p>
          )}
          <Badge variant="outline" className="mt-2">
            {book.songIds.length} {book.songIds.length === 1 ? 'song' : 'songs'}
          </Badge>
        </div>
      </div>
    </Link>
  )
}
