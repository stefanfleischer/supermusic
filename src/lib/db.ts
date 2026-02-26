import { supabase } from './supabase'
import type { Song, Book, Setlist, SetlistEntry } from './types'

export interface Store<T extends { id: string }> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | null>
  create(item: T): Promise<T>
  update(id: string, partial: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
  search(predicate: (item: T) => boolean): Promise<T[]>
}

// ─── snake_case <-> camelCase mappers ─────────────────────────────────────

type SongRow = {
  id: string
  title: string
  artist: string
  key: string | null
  tempo: number | null
  time_signature: string | null
  tags: string[] | null
  ccli: string | null
  copyright: string | null
  content: string
  capo: number
  created_at: string
  updated_at: string
}

function songFromRow(row: SongRow): Song {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    key: row.key,
    tempo: row.tempo,
    timeSignature: row.time_signature,
    tags: row.tags ?? [],
    ccli: row.ccli,
    copyright: row.copyright,
    content: row.content,
    capo: row.capo,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function songToRow(song: Partial<Song>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (song.id !== undefined) row.id = song.id
  if (song.title !== undefined) row.title = song.title
  if (song.artist !== undefined) row.artist = song.artist
  if (song.key !== undefined) row.key = song.key
  if (song.tempo !== undefined) row.tempo = song.tempo
  if (song.timeSignature !== undefined) row.time_signature = song.timeSignature
  if (song.tags !== undefined) row.tags = song.tags
  if (song.ccli !== undefined) row.ccli = song.ccli
  if (song.copyright !== undefined) row.copyright = song.copyright
  if (song.content !== undefined) row.content = song.content
  if (song.capo !== undefined) row.capo = song.capo
  if (song.createdAt !== undefined) row.created_at = song.createdAt
  if (song.updatedAt !== undefined) row.updated_at = song.updatedAt
  return row
}

type BookRow = {
  id: string
  name: string
  description: string
  song_ids: string[] | null
  created_at: string
  updated_at: string
}

function bookFromRow(row: BookRow): Book {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    songIds: row.song_ids ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function bookToRow(book: Partial<Book>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (book.id !== undefined) row.id = book.id
  if (book.name !== undefined) row.name = book.name
  if (book.description !== undefined) row.description = book.description
  if (book.songIds !== undefined) row.song_ids = book.songIds
  if (book.createdAt !== undefined) row.created_at = book.createdAt
  if (book.updatedAt !== undefined) row.updated_at = book.updatedAt
  return row
}

type SetlistRow = {
  id: string
  name: string
  description: string
  date: string | null
  song_entries: unknown
  created_at: string
  updated_at: string
}

function setlistFromRow(row: SetlistRow): Setlist {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    date: row.date,
    songEntries: (row.song_entries ?? []) as SetlistEntry[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function setlistToRow(setlist: Partial<Setlist>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (setlist.id !== undefined) row.id = setlist.id
  if (setlist.name !== undefined) row.name = setlist.name
  if (setlist.description !== undefined) row.description = setlist.description
  if (setlist.date !== undefined) row.date = setlist.date
  if (setlist.songEntries !== undefined) row.song_entries = setlist.songEntries
  if (setlist.createdAt !== undefined) row.created_at = setlist.createdAt
  if (setlist.updatedAt !== undefined) row.updated_at = setlist.updatedAt
  return row
}

// ─── Generic Supabase store factory ───────────────────────────────────────

type TableName = 'songs' | 'books' | 'setlists'

function createSupabaseStore<T extends { id: string }>(
  table: TableName,
  fromRow: (row: any) => T,
  toRow: (item: Partial<T>) => Record<string, unknown>,
): Store<T> {
  // Use a loosely-typed reference so the generic factory compiles.
  // Each store is constructed with a concrete table name, so queries are safe.
  const from = () => supabase.from(table) as any

  return {
    async getAll() {
      const { data, error } = await from().select('*')
      if (error) throw error
      return (data as any[]).map(fromRow)
    },

    async getById(id: string) {
      const { data, error } = await from()
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      return data ? fromRow(data) : null
    },

    async create(item: T) {
      const row = toRow(item)
      const { data, error } = await from()
        .insert(row)
        .select()
        .single()
      if (error) throw error
      return fromRow(data)
    },

    async update(id: string, partial: Partial<T>) {
      const row = toRow(partial)
      const { data, error } = await from()
        .update(row)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return fromRow(data)
    },

    async delete(id: string) {
      const { error } = await from().delete().eq('id', id)
      if (error) throw error
    },

    async search(predicate: (item: T) => boolean) {
      const all = await this.getAll()
      return all.filter(predicate)
    },
  }
}

// ─── Store singletons ─────────────────────────────────────────────────────

let songStore: Store<Song> | null = null
let bookStore: Store<Book> | null = null
let setlistStore: Store<Setlist> | null = null

export function getSongStore(): Store<Song> {
  if (!songStore) songStore = createSupabaseStore<Song>('songs', songFromRow, songToRow)
  return songStore
}

export function getBookStore(): Store<Book> {
  if (!bookStore) bookStore = createSupabaseStore<Book>('books', bookFromRow, bookToRow)
  return bookStore
}

export function getSetlistStore(): Store<Setlist> {
  if (!setlistStore) setlistStore = createSupabaseStore<Setlist>('setlists', setlistFromRow, setlistToRow)
  return setlistStore
}
