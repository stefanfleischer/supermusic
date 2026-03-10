import { useState, useEffect, useCallback } from 'react'
import {
  getAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
} from './server/annotations'
import type { SongAnnotation } from './types'

export function useSongAnnotations(songId: string) {
  const [annotations, setAnnotations] = useState<SongAnnotation[]>([])

  useEffect(() => {
    if (!songId) return
    getAnnotations({ data: { songId } }).then(setAnnotations)
  }, [songId])

  const addNote = useCallback(async () => {
    const ann = await createAnnotation({
      data: { songId, type: 'note', data: { text: '', x: 16, y: 16 } },
    })
    setAnnotations((prev) => [...prev, ann])
  }, [songId])

  const updateNote = useCallback(async (id: string, data: Record<string, unknown>) => {
    // optimistic update
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, data } : a)))
    await updateAnnotation({ data: { id, data } })
  }, [])

  const removeNote = useCallback(async (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id))
    await deleteAnnotation({ data: { id } })
  }, [])

  return { annotations, addNote, updateNote, removeNote }
}
