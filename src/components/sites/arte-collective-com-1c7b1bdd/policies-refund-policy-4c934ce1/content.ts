import type { PolicyPageContent } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/PolicyPage";

/**
 * Verbatim content transcribed from
 * https://arte-collective.com/policies/refund-policy
 */
export const refundPolicyContent: PolicyPageContent = {
  title: "Refund policy",
  sections: [
    {
      heading: "Returns & Refunds",
      paragraphs: [
        [
          {
            text: "At Arte Collective, every piece is printed specifically for you the moment you order. This helps us maintain high quality while reducing waste.",
          },
        ],
        [{ text: "We want you to love your art! If something isn't right, here is how we can fix it together." }],
      ],
    },
    {
      heading: "1. Changed your mind? (Easy 14-Day Returns)",
      paragraphs: [
        [
          { text: "You have " },
          { text: "14 days", bold: true },
          { text: " after receiving your poster to decide if it’s a perfect match for your space." },
        ],
      ],
      list: [
        [
          { text: "How it works:", bold: true },
          {
            text: " Just drop us an email at ",
          },
          { text: "contact@arte-collective.com", bold: true },
          {
            text: " and we’ll send you the return address (please don't send it back to the address on the shipping label!).",
          },
        ],
        [
          { text: "The Golden Rule:", bold: true },
          {
            text: " The poster must be returned in its original, brand-new, and resaleable condition, safely packed in its original tube. Because paper is highly delicate, any item that returns with signs of handling, marks, or creases won't be eligible for a full refund.",
          },
        ],
        [
          { text: "Shipping:", bold: true },
          {
            text: " Return shipping costs are covered by the customer and a tracking number is required so we can make sure it arrives safely. Once we get it back in perfect shape, we’ll process your refund right away.",
          },
        ],
      ],
    },
    {
      heading: "2. Damaged or Defective Items",
      paragraphs: [
        [
          { text: "If your order arrives damaged, misprinted, or defective, we’ve got you covered. " },
          { text: "You don't even need to send it back.", bold: true },
        ],
      ],
      list: [
        [
          { text: "How to claim:", bold: true },
          {
            text: " Within 30 days of delivery, just reply to your order confirmation email or message us at ",
          },
          { text: "contact@arte-collective.com", bold: true },
          { text: "." },
        ],
        [
          { text: "What to include:", bold: true },
          { text: " Send us a quick photo of the issue and let us know if you prefer a " },
          { text: "free reprint", bold: true },
          { text: " or a " },
          { text: "full refund", bold: true },
          { text: ". We’ll handle the rest!" },
        ],
      ],
    },
    {
      heading: "3. Shipping & Address Issues",
      paragraphs: [
        [
          {
            text: "Please make sure your delivery address is 100% correct at checkout. We cannot offer free replacements or refunds for address mistakes made by the customer. If a package comes back to our warehouse because of an incorrect address, we can ship it again, but you will just need to cover the new shipping cost.",
          },
        ],
      ],
    },
    {
      heading: "4. Lost Orders",
      paragraphs: [
        [
          {
            text: "If your tracking stops updating and the carrier confirms the package is lost in transit, don't worry. We will ship a brand-new replacement to you at absolutely no extra cost.",
          },
        ],
      ],
    },
    {
      heading: "5. Still have questions?",
      paragraphs: [
        [
          { text: "We’re always here to help you get the art you love. Just hit \"reply\" to any of our emails or reach out directly to 📧 " },
          { text: "contact@arte-collective.com", bold: true },
        ],
      ],
    },
  ],
};
