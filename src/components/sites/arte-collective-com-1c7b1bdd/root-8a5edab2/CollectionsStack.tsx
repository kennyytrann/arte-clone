"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

const collections = [
  { label: "Historic Shots", count: 12, image: THEME + "History.png" },
  { label: "Space", count: 18, image: THEME + "Space.png" },
  { label: "Aerospace", count: 22, image: THEME + "Aerospatials.png" },
  { label: "Science", count: 14, image: THEME + "Science.png" },
  { label: "Social Sciences", count: 15, image: THEME + "Social_Sciences.png" },
];

export function CollectionsStack() {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-8">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
        Explore more
      </p>
      <h2 className="mb-10 font-sans text-[28px] leading-tight text-arte-text sm:text-[34px]">
        Our exclusive <em className="font-accent italic text-arte-orange">collections</em>
      </h2>

      <div className="relative mx-auto h-[300px] w-[220px]">
        {collections.map((c, i) => {
          const offset = i - active;
          const isActive = offset === 0;
          if (Math.abs(offset) > 2) return null;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => setActive(i)}
              className="absolute inset-0 overflow-hidden shadow-xl transition-all duration-300"
              style={{
                transform: `translateX(${offset * 14}px) rotate(${offset * 4}deg) scale(${1 - Math.abs(offset) * 0.06})`,
                zIndex: 10 - Math.abs(offset),
              }}
            >
              <Image src={c.image} alt={c.label} fill className="object-cover" />
              {isActive ? (
                <>
                  <span className="absolute left-3 top-3 rounded bg-black/40 px-2 py-1 text-[11px] text-white">
                    {c.count}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left text-white">
                    <p className="text-[15px] font-medium">{c.label}</p>
                    <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide">
                      Discover <ArrowRight size={12} />
                    </p>
                  </div>
                </>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
