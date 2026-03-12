"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CarouselImage {
  id: number;
  image_url: string;
  link_url: string | null;
}

interface ImageCarouselProps {
  images: CarouselImage[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center rounded-lg">
        <p className="text-white text-lg font-medium">
          Welcome to Karyadwar Portal
        </p>
      </div>
    );
  }

  const prev = () =>
    setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gray-200" style={{ height: "220px" }}>
      {images.map((img, idx) => (
        <div
          key={img.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {img.link_url ? (
            <a href={img.link_url} target="_blank" rel="noopener noreferrer">
              <img
                src={img.image_url}
                alt={`Slide ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </a>
          ) : (
            <img
              src={img.image_url}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === current ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
