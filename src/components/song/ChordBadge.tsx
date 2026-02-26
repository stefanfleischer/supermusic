interface ChordBadgeProps {
  chord: string
}

export default function ChordBadge({ chord }: ChordBadgeProps) {
  return (
    <span className="text-cyan-400 text-sm font-mono font-bold whitespace-pre">
      {chord}
    </span>
  )
}
