import { useState } from 'react'
import { keyUsesFlats } from './chordpro/transpose'

interface SongSettings {
  transposeSemitones: number
  capo: number
  capoEnabled: boolean
  preferFlats: boolean
}

function storageKey(songId: string) {
  return `song-settings-${songId}`
}

function load(songId: string, defaults: SongSettings): SongSettings {
  try {
    const raw = localStorage.getItem(storageKey(songId))
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch {
    return defaults
  }
}

function save(songId: string, settings: SongSettings) {
  try {
    localStorage.setItem(storageKey(songId), JSON.stringify(settings))
  } catch {}
}

export function useSongSettings(songId: string, originalKey: string | null, defaultCapo: number) {
  const defaults: SongSettings = {
    transposeSemitones: 0,
    capo: defaultCapo,
    capoEnabled: defaultCapo > 0,
    preferFlats: keyUsesFlats(originalKey),
  }

  const initial = load(songId, defaults)

  const [transposeSemitones, _setTranspose] = useState(initial.transposeSemitones)
  const [capo, _setCapo] = useState(initial.capo)
  const [capoEnabled, _setCapoEnabled] = useState(initial.capoEnabled)
  const [preferFlats, _setPreferFlats] = useState(initial.preferFlats)

  function persist(patch: Partial<SongSettings>) {
    const current = load(songId, defaults)
    save(songId, { ...current, ...patch })
  }

  function setTransposeSemitones(v: number) {
    _setTranspose(v)
    persist({ transposeSemitones: v })
  }
  function setCapo(v: number) {
    _setCapo(v)
    persist({ capo: v })
  }
  function setCapoEnabled(v: boolean) {
    _setCapoEnabled(v)
    persist({ capoEnabled: v })
  }
  function setPreferFlats(v: boolean) {
    _setPreferFlats(v)
    persist({ preferFlats: v })
  }

  return {
    transposeSemitones, setTransposeSemitones,
    capo, setCapo,
    capoEnabled, setCapoEnabled,
    preferFlats, setPreferFlats,
  }
}
