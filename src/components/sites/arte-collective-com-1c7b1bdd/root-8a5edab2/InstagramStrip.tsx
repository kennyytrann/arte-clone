import Image from "next/image";

const INSTAGRAM_URL = "https://instagram.com/invasiveframes";

export function InstagramStrip({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mb-8 px-4 text-center">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
          Instagram
        </p>
        <h2 className="font-sans text-[28px] leading-tight text-arte-text sm:text-[34px]">
          Seen in the <span className="font-accent italic text-arte-orange">Wild</span>
        </h2>
        <p className="mt-2 text-[13px] text-arte-text-muted">
          Tag{" "}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-arte-orange"
          >
            @invasiveframes
          </a>{" "}
          for a chance to be featured.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {photos.map((src, i) => (
          <a
            key={src + i}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square w-[180px] shrink-0 overflow-hidden bg-neutral-200"
          >
            <Image src={src} alt="" fill sizes="180px" className="object-cover" />
            <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-[10px] text-white">
              @invasiveframes
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
