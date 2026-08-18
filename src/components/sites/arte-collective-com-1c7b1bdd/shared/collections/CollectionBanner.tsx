import Image from "next/image";
import { Star } from "lucide-react";
import type { CollectionRating } from "./types";

interface CollectionBannerProps {
  heroImage: string;
  heroLabel: string;
  rating: CollectionRating;
}

export function CollectionBanner({ heroImage, heroLabel, rating }: CollectionBannerProps) {
  return (
    <section className="px-4 pt-[100px] sm:px-6">
      <div className="mx-auto flex max-w-[1330px] flex-col items-center gap-1">
        <div className="relative h-[115px] w-full overflow-hidden rounded-[6px] border border-[#D0D0D0] bg-[#F5F5F5]">
          <Image
            src={heroImage}
            alt={heroLabel}
            fill
            priority
            sizes="(min-width: 1024px) 1360px, calc(100vw - 30px)"
            className="object-cover blur-[10px] lg:scale-125"
          />
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/25 px-[18px] py-[10px] text-[15px] font-normal uppercase tracking-[-0.05em] text-white backdrop-blur-[5px]"
            style={{ fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" }}
          >
            <span className="h-1 w-1 shrink-0 rounded-full bg-arte-orange-dark" />
            <span>{heroLabel}</span>
          </div>
        </div>

        <div
          className="flex w-full items-center justify-center gap-[5px] rounded-[6px] border border-[#DDDDDD] bg-[#f7f7f7] p-[7px] text-[13px]"
          style={{ fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" }}
        >
          <Star size={15} className="fill-arte-orange text-arte-orange" />
          <p className="m-0 text-[#5A5A5A]">
            <span className="text-[#757578]">{rating.value.toFixed(2)}</span>/5 +
            {rating.reviewCount} Reviews
          </p>
        </div>
      </div>
    </section>
  );
}
