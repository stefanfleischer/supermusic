interface ChordBadgeProps {
  chord: string
}

export default function ChordBadge({ chord }: ChordBadgeProps) {
  return (
    <span className="text-white text-sm whitespace-pre">
      {chord}
    </span>
  )
}
