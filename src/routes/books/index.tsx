import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Plus } from 'lucide-react'
import { getBooks } from '@/lib/server/books'
import BookCard from '@/components/book/BookCard'
import EmptyState from '@/components/ui/EmptyState'

export const Route = createFileRoute('/books/')({
  loader: async () => {
    const books = await getBooks()
    return { books }
  },
  component: BooksPage,
})

function BooksPage() {
  const { books } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Books</h1>
            <p className="text-gray-400 mt-1">
              {books.length} {books.length === 1 ? 'book' : 'books'}
            </p>
          </div>
          <Link
            to="/books/new"
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors shadow-lg shadow-cyan-500/25"
          >
            <Plus size={18} />
            New Book
          </Link>
        </div>

        {books.length > 0 ? (
          <div className="grid gap-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen size={48} />}
            title="No books yet"
            description="Books let you organize songs into collections, like binders. Create your first book to get started."
            action={
              <Link
                to="/books/new"
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Create Your First Book
              </Link>
            }
          />
        )}
      </div>
    </div>
  )
}
