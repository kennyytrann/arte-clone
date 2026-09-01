"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

export function EmailCaptureModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-[380px] overflow-hidden bg-[#211b1c] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
        >
          <X size={14} className="text-white opacity-100" />
        </button>

        <div className="relative flex h-[130px] items-center justify-center bg-[#3a2f2c]">
          <Image
            src={THEME + "10_Off_mobile_9a668e41-3e2f-475d-9742-6689aaba2194.png"}
            alt="10% off first order"
            fill
            className="object-cover"
          />
        </div>

        <div className="px-6 py-6 text-center">
          <p className="mb-1 flex items-center justify-center gap-1 text-[13px]">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Join the club!
          </p>
          <h3 className="mb-4 text-[22px] font-medium">Join the club!</h3>
          <p className="mb-4 text-[13px] text-white/70">10% off your first order.</p>

          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {["News & Contents", "Early Access", "Exclusive Discounts"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/30 px-3 py-1 text-[10px] uppercase tracking-wide text-white/80"
              >
                • {t}
              </span>
            ))}
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mb-3 w-full border border-white/30 bg-transparent px-4 py-3 text-[13px] text-white placeholder:text-white/50 focus:outline-none"
          />
          <button
            type="button"
            className="w-full bg-arte-orange py-3 text-[14px] font-semibold uppercase tracking-wide text-white"
          >
            Get 10% off
          </button>
          <p className="mt-3 text-[10px] text-white/50">
            Only premium content. No clutter.
            <br />
            Unsubscribe whenever.
          </p>
        </div>
      </div>
    </div>
  );
}
