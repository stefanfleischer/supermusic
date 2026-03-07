import { createContext, useContext } from 'react'

export type ChordColor = 'default' | 'red' | 'blue' | 'green' | 'cyan' | 'purple'

export interface ChordFormat {
  bold: boolean
  italic: boolean
  color: ChordColor
}

export const defaultChordFormat: ChordFormat = {
  bold: false,
  italic: false,
  color: 'default',
}

export const ChordFormatContext = createContext<ChordFormat>(defaultChordFormat)

export function useChordFormat() {
  return useContext(ChordFormatContext)
}
