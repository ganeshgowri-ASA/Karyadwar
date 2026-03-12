'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface CarouselImage {
  id: string
  imageUrl: string
  linkUrl?: string | null
  sortOrder?: number
}

interface CarouselProps {
  images?: CarouselImage[]
}

const DEFAULT_IMAGES: CarouselImage[] = [
  { id: '1', imageUrl: 'https://picsum.photos/seed/mfg1/1200/450', linkUrl: null },
  { id: '2', imageUrl: 'https://picsum.photos/seed/mfg2/1200/450', linkUrl: null },
  { id: '3', imageUrl: 'https://picsum.photos/seed/mfg3/1200/450', linkUrl: null },
  { id: '4', imageUrl: 'https://picsum.photos/seed/mfg4/1200/450', linkUrl: null },
  { id: '5', imageUrl: 'https://picsum.photos/seed/mfg5/1200/450', linkUrl: null },
]

export default function Carousel({ images }: CarouselProps) {
  const slides = images && images.length > 0 ? images : DEFAULT_IMAGES
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, isPaused])

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl shadow-md bg-gray-900"
      style={{ height: '280px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.imageUrl}
            alt={`Slide ${idx + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/60" />
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors z-10"
        aria-label="Previous slide"
      >
        &#8249;
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors z-10"
        aria-label="Next slide"
      >
        &#8250;
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              idx === current ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded z-10">
        {current + 1} / {slides.length}
      </div>
    </div>
  )
}
