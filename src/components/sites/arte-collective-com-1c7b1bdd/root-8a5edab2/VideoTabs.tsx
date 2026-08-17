"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const VIDEOS = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/videos/";

const tabs = [
  { key: "unboxing", label: "Unboxing", src: VIDEOS + "unboxing.mp4" },
  { key: "framing", label: "Framing", src: VIDEOS + "framing.mp4" },
] as const;

export function VideoTabs() {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("unboxing");
  const activeVideo = tabs.find((t) => t.key === active)!;

  return (
    <section className="mx-auto max-w-[900px] px-4 py-16 text-center sm:px-8">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
        Up close
      </p>
      <h2 className="mb-8 font-sans text-[28px] leading-tight text-arte-text sm:text-[34px]">
        Watch our <em className="font-accent italic text-arte-orange">prints</em> in action
      </h2>

      <div className="relative overflow-hidden bg-[#f2f2f2]">
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                "rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-wide transition-colors",
                active === tab.key
                  ? "bg-[#3a3a3a] text-white"
                  : "bg-white/70 text-arte-text",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <video
          key={activeVideo.key}
          src={activeVideo.src}
          autoPlay
          loop
          muted
          playsInline
          className="aspect-video w-full object-cover"
        />
      </div>
    </section>
  );
}
