import { createServerFn } from '@tanstack/react-start'
import { getBookStore } from '../db'
import type { Book, BookCreate, BookUpdate } from '../types'

export const getBooks = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Book[]> => {
    const store = getBookStore()
    return store.getAll()
  },
)

export const getBook = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<Book | null> => {
    const store = getBookStore()
    return store.getById(data.id)
  })

export const createBook = createServerFn({ method: 'POST' })
  .inputValidator((data: BookCreate) => data)
  .handler(async ({ data }): Promise<Book> => {
    const store = getBookStore()
    const now = new Date().toISOString()
    const book: Book = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    return store.create(book)
  })

export const updateBook = createServerFn({ method: 'POST' })
  .inputValidator((data: BookUpdate) => data)
  .handler(async ({ data }): Promise<Book> => {
    const store = getBookStore()
    const { id, ...updates } = data
    return store.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  })

export const deleteBook = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<void> => {
    const store = getBookStore()
    await store.delete(data.id)
  })
