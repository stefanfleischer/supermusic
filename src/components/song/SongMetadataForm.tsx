import { ALL_KEYS } from '@/lib/chordpro/constants'

interface SongMetadata {
  title: string
  artist: string
  key: string
  tempo: string
  timeSignature: string
  capo: number
  tags: string
  ccli: string
  copyright: string
}

interface SongMetadataFormProps {
  metadata: SongMetadata
  onChange: (metadata: SongMetadata) => void
}

export default function SongMetadataForm({
  metadata,
  onChange,
}: SongMetadataFormProps) {
  function update(field: keyof SongMetadata, value: string | number) {
    onChange({ ...metadata, [field]: value })
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Title</label>
        <input
          type="text"
          value={metadata.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Song title"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Artist */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Artist</label>
        <input
          type="text"
          value={metadata.artist}
          onChange={(e) => update('artist', e.target.value)}
          placeholder="Artist name"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Key */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Key</label>
          <select
            value={metadata.key}
            onChange={(e) => update('key', e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">None</option>
            {ALL_KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* Tempo */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Tempo</label>
          <input
            type="text"
            value={metadata.tempo}
            onChange={(e) => update('tempo', e.target.value)}
            placeholder="BPM"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Capo */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Capo</label>
          <select
            value={metadata.capo}
            onChange={(e) => update('capo', Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
          >
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i} value={i}>
                {i === 0 ? 'None' : i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={metadata.tags}
          onChange={(e) => update('tags', e.target.value)}
          placeholder="worship, hymn, classic"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Time Signature */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Time Signature
          </label>
          <input
            type="text"
            value={metadata.timeSignature}
            onChange={(e) => update('timeSignature', e.target.value)}
            placeholder="4/4"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* CCLI */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">CCLI #</label>
          <input
            type="text"
            value={metadata.ccli}
            onChange={(e) => update('ccli', e.target.value)}
            placeholder="CCLI number"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Copyright */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Copyright</label>
        <input
          type="text"
          value={metadata.copyright}
          onChange={(e) => update('copyright', e.target.value)}
          placeholder="Copyright info"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>
    </div>
  )
}

export type { SongMetadata }
