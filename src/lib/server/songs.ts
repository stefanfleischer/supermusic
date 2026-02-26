import { createServerFn } from '@tanstack/react-start'
import { getSongStore } from '../db'
import type { Song, SongCreate, SongUpdate } from '../types'

export const getSongs = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Song[]> => {
    const store = getSongStore()
    return store.getAll()
  },
)

export const getSong = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<Song | null> => {
    const store = getSongStore()
    return store.getById(data.id)
  })

export const createSong = createServerFn({ method: 'POST' })
  .inputValidator((data: SongCreate) => data)
  .handler(async ({ data }): Promise<Song> => {
    const store = getSongStore()
    const now = new Date().toISOString()
    const song: Song = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    return store.create(song)
  })

export const updateSong = createServerFn({ method: 'POST' })
  .inputValidator((data: SongUpdate) => data)
  .handler(async ({ data }): Promise<Song> => {
    const store = getSongStore()
    const { id, ...updates } = data
    return store.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  })

export const deleteSong = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<void> => {
    const store = getSongStore()
    await store.delete(data.id)
  })
