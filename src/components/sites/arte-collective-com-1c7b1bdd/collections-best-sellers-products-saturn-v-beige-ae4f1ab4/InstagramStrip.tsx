import Image from "next/image";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

const photos = [
  THEME + "Story_1.png",
  THEME + "Story_2_89823f1a-539e-474d-94c7-91abe4cd1815.png",
  THEME + "Story_7.png",
  THEME + "Story_8_1.png",
  THEME + "Story_9.png",
  THEME + "Story_11.png",
  THEME + "Story_12.png",
  THEME + "Story_13.png",
];

/**
 * Page-specific variant: live copy on this PDP reads "Share your poster with
 * @artecollective_" ("with", no colon) — differs from the homepage's
 * "Share your poster: @artecollective_", so this was NOT promoted to shared/.
 * See docs/research/.../BEHAVIORS.md for the verification note.
 */
export function InstagramStrip() {
  return (
    <section className="py-16">
      <div className="mb-8 px-4 text-center">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
          Instagram
        </p>
        <h2 className="font-sans text-[28px] leading-tight text-arte-text sm:text-[34px]">
          Share your poster with{" "}
          <span className="font-accent italic text-arte-orange">@artecollective_</span>
        </h2>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {photos.map((src, i) => (
          <div key={i} className="relative aspect-square w-[180px] shrink-0 overflow-hidden bg-neutral-200">
            <Image src={src} alt="" fill className="object-cover" />
            <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-[10px] text-white">
              @artecollective_
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
