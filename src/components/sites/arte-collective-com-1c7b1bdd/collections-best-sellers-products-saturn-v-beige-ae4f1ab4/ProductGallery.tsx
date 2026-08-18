"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  function go(direction: 1 | -1) {
    setIndex((prev) => (prev + direction + images.length) % images.length);
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-[#e5e2df] sm:aspect-[4/5]">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-cover transition-opacity duration-300 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      ))}

      <button
        type="button"
        aria-label="Previous image"
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-arte-orange/10 text-arte-orange backdrop-blur-sm hover:bg-arte-orange/20"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-arte-orange/10 text-arte-orange backdrop-blur-sm hover:bg-arte-orange/20"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
