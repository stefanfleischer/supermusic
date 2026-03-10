import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { SongAnnotation } from '@/lib/types'

interface NoteData {
  text: string
  x: number
  y: number
}

interface SongNoteProps {
  annotation: SongAnnotation
  onUpdate: (id: string, data: Record<string, unknown>) => void
  onDelete: (id: string) => void
}

export default function SongNote({ annotation, onUpdate, onDelete }: SongNoteProps) {
  const raw = annotation.data as NoteData

  const posRef = useRef({ x: raw.x, y: raw.y })
  const textRef = useRef(raw.text)
  const [pos, setPos] = useState({ x: raw.x, y: raw.y })
  const [text, setText] = useState(raw.text)
  const dragStart = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 })

  function handleDragStart(e: React.MouseEvent) {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return
    e.preventDefault()
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: posRef.current.x,
      posY: posRef.current.y,
    }

    function onMove(e: MouseEvent) {
      const newPos = {
        x: Math.max(0, dragStart.current.posX + e.clientX - dragStart.current.mouseX),
        y: Math.max(0, dragStart.current.posY + e.clientY - dragStart.current.mouseY),
      }
      posRef.current = newPos
      setPos(newPos)
    }

    function onUp() {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      onUpdate(annotation.id, { text: textRef.current, ...posRef.current })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  function handleTextChange(value: string) {
    textRef.current = value
    setText(value)
  }

  function handleBlur() {
    onUpdate(annotation.id, { text: textRef.current, ...posRef.current })
  }

  return (
    <div
      style={{ left: pos.x, top: pos.y }}
      className="absolute z-20 w-52 shadow-xl shadow-black/30 rounded-lg flex"
    >
      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Text..."
        rows={5}
        className="flex-1 bg-amber-50 text-amber-950 text-sm px-3 py-2 rounded-l-lg resize-none focus:outline-none placeholder-amber-300 leading-snug min-w-0"
      />

      {/* Right strip: drag handle + delete */}
      <div
        onMouseDown={handleDragStart}
        className="cursor-grab active:cursor-grabbing bg-amber-200 hover:bg-amber-300 rounded-r-lg flex flex-col items-center justify-between py-1.5 px-1 select-none transition-colors"
        style={{ width: 24 }}
      >
        <span className="text-amber-700 text-xs leading-none">⠿</span>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(annotation.id)}
          className="text-amber-700 hover:text-amber-950 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
