import Image from "next/image";
import Link from "next/link";
import { staticRoutes } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

const socials = [
  { name: "Facebook", src: THEME + "facebook.svg" },
  { name: "Instagram", src: THEME + "instagram.svg" },
  { name: "TikTok", src: THEME + "tiktok.svg" },
];

// `href: undefined` means no cloned route exists yet for that link — it
// renders as plain text instead of navigating anywhere.
const legalLinks: { label: string; href?: string }[] = [
  { label: "Contact", href: staticRoutes.contact },
  { label: "Privacy Policy", href: staticRoutes.privacyPolicy },
  { label: "Refund Policy", href: staticRoutes.refundPolicy },
  { label: "Shipping Policy", href: staticRoutes.shippingPolicy },
  { label: "Terms of Service", href: staticRoutes.termsOfService },
  { label: "Your Privacy Choices" },
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
        {legalLinks.map((l) =>
          l.href ? (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ) : (
            <span key={l.label}>{l.label}</span>
          )
        )}
      </div>

      <p className="text-[11px] text-white/80">© 2026 Arte Collective | All rights reserved.</p>
    </footer>
  );
}
