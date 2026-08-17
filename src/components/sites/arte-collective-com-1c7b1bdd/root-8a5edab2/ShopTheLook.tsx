import Image from "next/image";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

const looks = [
  { image: THEME + "Story_1.png", count: 7, dots: 3 },
  { image: THEME + "Story_2_89823f1a-539e-474d-94c7-91abe4cd1815.png", count: 4, dots: 2 },
  { image: THEME + "Story_7.png", count: 6, dots: 3 },
  { image: THEME + "Story_9.png", count: 6, dots: 4 },
];

export function ShopTheLook() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
      <div className="mb-8 text-center">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
          Curated sets
        </p>
        <h2 className="font-sans text-[28px] leading-tight text-arte-text sm:text-[34px]">
          Shop the <em className="font-accent italic text-arte-orange">look</em>
        </h2>
        <p className="mt-2 text-[13px] text-arte-text-muted">
          A perfectly matched set to elevate your space
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {looks.map((look, i) => (
          <div key={i} className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
            <Image src={look.image} alt="" fill className="object-cover" />
            {Array.from({ length: look.dots }).map((_, d) => (
              <span
                key={d}
                className="absolute h-3 w-3 rounded-full border border-arte-text bg-white"
                style={{
                  left: `${25 + d * 18}%`,
                  top: `${30 + ((d * 23) % 45)}%`,
                }}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/70 px-3 py-2 text-white">
              <span className="text-[10px] font-medium uppercase tracking-wide">
                See the full set
              </span>
              <span className="text-[10px]">{look.count}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
