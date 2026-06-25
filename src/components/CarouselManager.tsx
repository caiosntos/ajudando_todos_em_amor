'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Trash2, Upload } from 'lucide-react'
import type { CarouselImage } from '@/lib/carousel'

export function CarouselManager({ initialImages }: { initialImages: CarouselImage[] }) {
  const [images, setImages] = useState(initialImages)
  const [uploading, setUploading] = useState(false)
  const [alt, setAlt] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = inputRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('alt', alt || 'Foto do carrossel')

    const res = await fetch('/api/admin/carousel', { method: 'POST', body: form })
    const newImg: CarouselImage = await res.json()
    setImages((prev) => [...prev, newImg])
    setAlt('')
    if (inputRef.current) inputRef.current.value = ''
    setUploading(false)
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/carousel/${id}`, { method: 'DELETE' })
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <div>
      <div className="bg-white border border-border-line rounded-card p-6 mb-6">
        <div className="font-semibold text-[14.5px] mb-4">Adicionar imagem ao carrossel</div>
        <form onSubmit={handleUpload} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            required
            className="text-sm text-ink-secondary file:mr-3 file:py-2 file:px-4 file:rounded-pill file:border-0 file:text-sm file:font-semibold file:bg-coral-light file:text-coral-deep hover:file:bg-coral/20 cursor-pointer"
          />
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Descrição da foto (ex: Luana entregando cestas)"
            className="w-full border border-border-line rounded-lg px-4 py-2.5 text-sm outline-none focus:border-coral transition-colors"
          />
          <button
            type="submit"
            disabled={uploading}
            className="self-start inline-flex items-center gap-2 bg-coral text-white font-semibold text-sm px-5 py-2.5 rounded-pill hover:bg-coral-deep transition-colors disabled:opacity-60"
          >
            <Upload size={15} />
            {uploading ? 'Enviando...' : 'Enviar foto'}
          </button>
        </form>
      </div>

      {images.length === 0 ? (
        <div className="bg-white border border-border-line rounded-card px-6 py-10 text-center text-ink-muted text-sm">
          Nenhuma imagem no carrossel. Adicione a primeira acima.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white border border-border-line rounded-card overflow-hidden">
              <div className="relative h-[150px] bg-[#F1E7DF]">
                <Image
                  src={`/images/carousel/${img.filename}`}
                  alt={img.alt_text}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="px-4 py-3 flex items-center justify-between gap-2 border-t border-border-line">
                <span className="text-xs text-ink-muted truncate">{img.alt_text}</span>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="flex-none text-red-400 hover:text-red-600 transition-colors"
                  title="Remover imagem"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
