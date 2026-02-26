import { createServerFn } from '@tanstack/react-start'
import { getSetlistStore } from '../db'
import type { Setlist, SetlistCreate, SetlistUpdate } from '../types'

export const getSetlists = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Setlist[]> => {
    const store = getSetlistStore()
    return store.getAll()
  },
)

export const getSetlist = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<Setlist | null> => {
    const store = getSetlistStore()
    return store.getById(data.id)
  })

export const createSetlist = createServerFn({ method: 'POST' })
  .inputValidator((data: SetlistCreate) => data)
  .handler(async ({ data }): Promise<Setlist> => {
    const store = getSetlistStore()
    const now = new Date().toISOString()
    const setlist: Setlist = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    return store.create(setlist)
  })

export const updateSetlist = createServerFn({ method: 'POST' })
  .inputValidator((data: SetlistUpdate) => data)
  .handler(async ({ data }): Promise<Setlist> => {
    const store = getSetlistStore()
    const { id, ...updates } = data
    return store.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  })

export const deleteSetlist = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<void> => {
    const store = getSetlistStore()
    await store.delete(data.id)
  })
