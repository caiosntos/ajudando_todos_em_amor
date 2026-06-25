'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CarouselImage } from '@/lib/carousel'

export function HeroCarousel({ images }: { images: CarouselImage[] }) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) return null

  return (
    <div className="flex-1 h-[340px] rounded-[18px] overflow-hidden relative w-full md:w-auto bg-[#F1E7DF]">
      {images.map((img, i) => (
        <div
          key={img.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={`/images/carousel/${img.filename}`}
            alt={img.alt_text}
            fill
            className="object-contain"
            priority={i === 0}
          />
        </div>
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
