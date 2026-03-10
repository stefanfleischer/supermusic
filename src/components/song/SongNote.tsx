import { useRef, useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { SongAnnotation } from '@/lib/types'

interface NoteData {
  text: string
  x: number
  y: number
  fontSize?: number
}

const FONT_SIZES = [11, 12, 13, 14, 16, 18, 20, 24]
const DEFAULT_FONT_SIZE = 13

interface SongNoteProps {
  annotation: SongAnnotation
  onUpdate: (id: string, data: Record<string, unknown>) => void
  onDelete: (id: string) => void
}

export default function SongNote({ annotation, onUpdate, onDelete }: SongNoteProps) {
  const raw = annotation.data as NoteData

  const posRef = useRef({ x: raw.x, y: raw.y })
  const textRef = useRef(raw.text)
  const fontSizeRef = useRef(raw.fontSize ?? DEFAULT_FONT_SIZE)
  const [pos, setPos] = useState({ x: raw.x, y: raw.y })
  const [text, setText] = useState(raw.text)
  const [fontSize, setFontSize] = useState(raw.fontSize ?? DEFAULT_FONT_SIZE)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dragStart = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 })

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text, fontSize])

  function handleDragStart(e: React.MouseEvent) {
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
      onUpdate(annotation.id, { text: textRef.current, fontSize: fontSizeRef.current, ...posRef.current })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  function handleTextChange(value: string) {
    textRef.current = value
    setText(value)
  }

  function handleBlur() {
    onUpdate(annotation.id, { text: textRef.current, fontSize: fontSizeRef.current, ...posRef.current })
  }

  function changeFontSize(dir: 1 | -1) {
    const idx = FONT_SIZES.indexOf(fontSize)
    const newIdx = Math.max(0, Math.min(FONT_SIZES.length - 1, idx + dir))
    const newSize = FONT_SIZES[newIdx]
    fontSizeRef.current = newSize
    setFontSize(newSize)
    onUpdate(annotation.id, { text: textRef.current, fontSize: newSize, ...posRef.current })
  }

  return (
    <div
      style={{ left: pos.x, top: pos.y }}
      className="absolute z-20 w-52 shadow-xl shadow-black/30 rounded-lg flex"
    >
      {/* Textarea — auto-grow, no scroll */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Text..."
        rows={1}
        style={{ fontSize }}
        className="flex-1 bg-amber-50 text-amber-950 px-3 py-2 rounded-l-lg resize-none overflow-hidden focus:outline-none placeholder-amber-300 leading-snug min-w-0"
      />

      {/* Right strip: drag · font+ · font- · delete */}
      <div className="bg-amber-200 rounded-r-lg flex flex-col items-center justify-between py-1.5 px-0.5 select-none" style={{ width: 22 }}>
        {/* Drag handle */}
        <div
          onMouseDown={handleDragStart}
          className="cursor-grab active:cursor-grabbing text-amber-700 hover:text-amber-900 transition-colors w-full flex justify-center"
          title="Verschieben"
        >
          <span className="text-xs leading-none">⠿</span>
        </div>

        {/* Font size controls */}
        <div className="flex flex-col items-center gap-2.5">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => changeFontSize(1)}
            disabled={fontSize >= FONT_SIZES[FONT_SIZES.length - 1]}
            className="text-amber-800 hover:text-amber-950 disabled:opacity-30 font-bold leading-none transition-opacity"
            style={{ fontSize: 13 }}
            title="Schrift größer"
          >
            +
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => changeFontSize(-1)}
            disabled={fontSize <= FONT_SIZES[0]}
            className="text-amber-800 hover:text-amber-950 disabled:opacity-30 font-bold leading-none transition-opacity"
            style={{ fontSize: 13 }}
            title="Schrift kleiner"
          >
            −
          </button>
        </div>

        {/* Delete */}
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(annotation.id)}
          className="text-amber-700 hover:text-amber-950 opacity-70 hover:opacity-100 transition-opacity"
          title="Löschen"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
