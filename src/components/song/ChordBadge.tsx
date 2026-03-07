import { useChordFormat } from './ChordFormatContext'

const COLOR_CLASSES: Record<string, string> = {
  default: 'text-white',
  red:     'text-red-400',
  blue:    'text-blue-400',
  green:   'text-green-400',
  cyan:    'text-cyan-400',
  purple:  'text-purple-400',
}

interface ChordBadgeProps {
  chord: string
}

export default function ChordBadge({ chord }: ChordBadgeProps) {
  const { bold, italic, color } = useChordFormat()
  const classes = [
    'text-sm whitespace-pre',
    COLOR_CLASSES[color] ?? 'text-white',
    bold   ? 'font-bold'   : '',
    italic ? 'italic'      : '',
  ].filter(Boolean).join(' ')

  return <span className={classes}>{chord}</span>
}
