import { createServerFn } from '@tanstack/react-start'
import { supabase } from '../supabase'
import type { SongAnnotation, SongAnnotationCreate } from '../types'

// ─── Row mapper ───────────────────────────────────────────────────────────

type AnnotationRow = {
  id: string
  song_id: string
  type: string
  data: Record<string, unknown>
  created_at: string
  updated_at: string
}

function fromRow(row: AnnotationRow): SongAnnotation {
  return {
    id: row.id,
    songId: row.song_id,
    type: row.type,
    data: row.data ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ─── Server functions ─────────────────────────────────────────────────────

export const getAnnotations = createServerFn({ method: 'GET' })
  .inputValidator((data: { songId: string }) => data)
  .handler(async ({ data }): Promise<SongAnnotation[]> => {
    const { data: rows, error } = await supabase
      .from('song_annotations')
      .select('*')
      .eq('song_id', data.songId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return (rows as AnnotationRow[]).map(fromRow)
  })

export const createAnnotation = createServerFn({ method: 'POST' })
  .inputValidator((data: SongAnnotationCreate) => data)
  .handler(async ({ data }): Promise<SongAnnotation> => {
    const now = new Date().toISOString()
    const { data: row, error } = await supabase
      .from('song_annotations')
      .insert({
        id: crypto.randomUUID(),
        song_id: data.songId,
        type: data.type,
        data: data.data,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()
    if (error) throw error
    return fromRow(row as AnnotationRow)
  })

export const updateAnnotation = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; data: Record<string, unknown> }) => data)
  .handler(async ({ data }): Promise<SongAnnotation> => {
    const { data: row, error } = await supabase
      .from('song_annotations')
      .update({ data: data.data, updated_at: new Date().toISOString() })
      .eq('id', data.id)
      .select()
      .single()
    if (error) throw error
    return fromRow(row as AnnotationRow)
  })

export const deleteAnnotation = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<void> => {
    const { error } = await supabase
      .from('song_annotations')
      .delete()
      .eq('id', data.id)
    if (error) throw error
  })
