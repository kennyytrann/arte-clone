import Image from "next/image";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

export function AboutUs() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
      <div className="bg-[#f2f2f2] px-6 py-14 text-center">
        <p className="mb-6 inline-block rounded-full bg-arte-orange/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-arte-orange">
          About us
        </p>
        <p className="mx-auto max-w-[520px] text-[24px] leading-[1.7] text-arte-text sm:text-[28px]">
          arte<span className="text-arte-orange">.</span> is the{" "}
          <em className="font-accent italic text-arte-orange underline decoration-wavy decoration-arte-orange/50">
            creative lab
          </em>{" "}
          of{" "}
          <Image
            src={THEME + "bastian.png"}
            alt="Bastian"
            width={28}
            height={28}
            className="inline-block rounded-full align-middle"
          />{" "}
          Bastian <span className="text-arte-orange">&amp;</span> Clay{" "}
          <Image
            src={THEME + "clay.png"}
            alt="Clay"
            width={28}
            height={28}
            className="inline-block rounded-full align-middle"
          />{" "}
          <span className="text-arte-orange">2</span> designers{" "}
          <em className="font-accent italic">creating</em> every print{" "}
          <span aria-hidden>📷</span> with passion driven by{" "}
          <em className="font-accent italic text-arte-orange">our love</em> of space.
        </p>
      </div>
    </section>
  );
}
