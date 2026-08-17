import Image from "next/image";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

const socials = [
  { name: "Facebook", src: THEME + "facebook.svg" },
  { name: "Instagram", src: THEME + "instagram.svg" },
  { name: "TikTok", src: THEME + "tiktok.svg" },
];

const legalLinks = [
  "Contact",
  "Privacy Policy",
  "Refund Policy",
  "Shipping Policy",
  "Terms of Service",
  "Your Privacy Choices",
];

export function Footer() {
  return (
    <footer className="bg-arte-orange px-4 py-10 text-center text-white sm:px-8">
      <div className="mb-6 flex justify-center gap-4">
        {socials.map((s) => (
          <span key={s.name} className="relative h-6 w-6">
            <Image src={s.src} alt={s.name} fill className="object-contain invert" />
          </span>
        ))}
      </div>

      <button
        type="button"
        className="mb-6 rounded-full border border-white/50 px-4 py-1 text-[12px]"
      >
        United States | USD $
      </button>

      <div className="mb-4 flex justify-center gap-2 text-[10px] font-medium uppercase">
        {["Amex", "Apple Pay", "Mastercard", "Visa", "Shop", "PayPal"].map((p) => (
          <span key={p} className="rounded bg-white px-2 py-1 text-arte-orange">
            {p}
          </span>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px]">
        {legalLinks.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>

      <p className="text-[11px] text-white/80">© 2026 Arte Collective | All rights reserved.</p>
    </footer>
  );
}
