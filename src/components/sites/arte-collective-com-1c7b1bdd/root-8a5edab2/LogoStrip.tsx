const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

/** Pre-composed strip artwork (1996×245) supplied by the client — Nike / Jordan
 *  / Red Bull / Forbes / Rolex / Ferrari / Louis Vuitton with captions. It is
 *  used verbatim as the marquee content; individual logos are never recreated. */
const MARQUEE_SRC = `url("${THEME}inspired-by-marquee.png")`;

/**
 * Homepage brand marquee — sits in its original slot (between the bestsellers
 * carousel and Shop the Look) as an infinite horizontal marquee of the supplied
 * strip image.
 *
 * The scroll + seamless loop + edge fades + reduced-motion handling all live in
 * `globals.css` (`.inspired-by-marquee` / `.inspired-by-marquee-mask`). The
 * strip is a `repeat-x` background scrolled via `background-position`, so it
 * decodes once and cannot develop a seam or a blank gap at any width.
 */
export function LogoStrip() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8">
      <p className="mb-5 text-center text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
        Inspired by
      </p>

      <div className="inspired-by-marquee-mask mx-auto max-w-[1100px] overflow-hidden rounded-[28px] border border-[#e5e5e5] bg-[#fafafa]">
        <div
          role="img"
          aria-label="Nike, Jordan, Red Bull, Forbes, Rolex, Ferrari and Louis Vuitton logos"
          className="inspired-by-marquee h-[160px] w-full sm:h-[220px]"
          style={{ "--inspired-src": MARQUEE_SRC } as React.CSSProperties}
        />
      </div>
    </section>
  );
}
