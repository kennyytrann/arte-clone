"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Do the posters come with a frame?",
    a: "No, all our artwork is sold unframed. The frames shown in our product photos are for inspiration only. Your print will be shipped carefully rolled in a protective tube to ensure it arrives in perfect condition.",
  },
  {
    q: "Where are your posters printed?",
    a: "Our production facilities are located worldwide, ensuring fast and local delivery wherever you are. From print to your wall, quickly, efficiently, and sustainably.",
  },
  {
    q: "Who is Arte Collective?",
    a: "We are Clay and Bastian, two designers passionate about science, technology, and visual design. Arte Collective was born from a simple idea: to create posters that reflect what inspires us, the beauty of science and the elegance of design.",
  },
  {
    q: "What if my poster arrives damaged, or if I need to contact you?",
    a: "No worries, we've got you covered. If your order arrives damaged, the fastest way to get a solution is to reply directly to your order confirmation. In your message, please include photos of the damage and whether you prefer a full refund or a free reprint. General inquiries: you can reach us through the contact form on our website or by email at contact@arte-collective.com. We reply within 48 hours maximum.",
  },
  {
    q: "What kind of paper do you use?",
    a: "We print on high-quality matte paper, optimized for artwork and photography where a soft, non-glossy finish is preferred. Each poster is a Giclée print, offering bright, intense colors that stay vivid even with regular exposure to sunlight.",
  },
  {
    q: "Do you have a promo code available?",
    a: "Yes, use ARTE10 at checkout to get 10% off your first order. It's our way of welcoming you to Arte Collective.",
  },
  {
    q: "How long does shipping take?",
    a: "Each poster is printed on demand once your order is placed. Production usually takes 1–2 business days, followed by 3–4 days for delivery. We always aim to ship as quickly as possible while maintaining premium quality.",
  },
  {
    q: "Where can I find my free wallpaper pack?",
    a: "Your phone wallpaper pack is included free with every order. You'll find the download link in your order confirmation email, no extra steps needed.",
  },
  {
    q: "What makes Arte Collective posters unique?",
    a: "Each design blends science, space, and modern graphic design to spark curiosity and elevate your space. Our mission is to turn scientific beauty into timeless wall art.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200 py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-[17px] text-arte-text">{q}</span>
        {open ? <Minus size={16} /> : <Plus size={16} />}
      </button>
      {open ? <p className="mt-3 text-[14px] leading-relaxed text-arte-text-muted">{a}</p> : null}
    </div>
  );
}

export function FAQAccordion() {
  const left = faqs.slice(0, 5);
  const right = faqs.slice(5);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
      <div className="mb-10 text-center">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
          Help &amp; support
        </p>
        <h2 className="font-sans text-[28px] leading-tight text-arte-text sm:text-[34px]">
          Frequently asked <em className="font-accent italic text-arte-orange">Questions</em>
        </h2>
      </div>

      <div className="grid gap-x-12 sm:grid-cols-2">
        <div>
          {left.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
        <div>
          {right.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
