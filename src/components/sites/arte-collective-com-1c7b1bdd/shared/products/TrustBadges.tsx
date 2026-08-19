import type { ReactNode } from "react";
import Image from "next/image";
import { Zap, Sparkles, RotateCcw } from "lucide-react";

function UsaFlagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <rect width="20" height="20" fill="#fff" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={i * (20 / 7)} width="20" height={20 / 14} fill="#222222" />
      ))}
      <rect width="9" height="10" fill="#222222" />
    </svg>
  );
}

const badges: {
  icon: ReactNode;
  title: string;
  subtext?: string;
  tag?: string;
}[] = [
  {
    icon: <Zap size={18} className="text-arte-text" />,
    title: "Printing and Shipping in 3–6 days",
    subtext: "Free delivery above $75",
    tag: "FREE",
  },
  {
    icon: <UsaFlagIcon />,
    title: "Locally printed in USA",
  },
  {
    icon: <Sparkles size={18} className="text-arte-text" />,
    title: "Printed at 300 DPI on 170 GSM paper",
    subtext: "Designed by Bastian & Clay",
  },
  {
    icon: <RotateCcw size={18} className="text-arte-text" />,
    title: "Easy Returns & Free Reprint if Damaged",
  },
];

export function TrustBadges({ phoneWallpaperThumbSrc }: { phoneWallpaperThumbSrc?: string }) {
  return (
    <div className="border-t border-neutral-200">
      {badges.map((b) => (
        <div
          key={b.title}
          className="flex items-center gap-3 border-b border-neutral-200 py-4"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center">{b.icon}</span>
          <span className="flex-1">
            <span className="block text-[13px] text-arte-text">{b.title}</span>
            {b.subtext ? (
              <span className="block text-[11px] text-arte-text-muted">{b.subtext}</span>
            ) : null}
          </span>
          {b.tag ? (
            <span className="shrink-0 bg-arte-orange/10 px-2 py-1 text-[10px] font-medium uppercase text-arte-orange">
              {b.tag}
            </span>
          ) : null}
        </div>
      ))}

      {phoneWallpaperThumbSrc ? (
        <div className="flex items-center gap-3 border-b border-neutral-200 py-4">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-neutral-100">
            <Image
              src={phoneWallpaperThumbSrc}
              alt="Phone wallpaper pack"
              fill
              className="object-cover"
            />
          </span>
          <span className="flex-1">
            <span className="block text-[13px] text-arte-text">Phone wallpaper pack</span>
            <span className="block text-[11px] text-arte-text-muted">with every order</span>
          </span>
          <span className="shrink-0 bg-arte-orange/10 px-2 py-1 text-[10px] font-medium uppercase text-arte-orange">
            Included free
          </span>
        </div>
      ) : null}
    </div>
  );
}
