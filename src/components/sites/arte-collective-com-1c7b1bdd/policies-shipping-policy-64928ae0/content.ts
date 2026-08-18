import type { PolicyPageContent } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/PolicyPage";

/**
 * Verbatim content transcribed from
 * https://arte-collective.com/policies/shipping-policy
 */
export const shippingPolicyContent: PolicyPageContent = {
  title: "Shipping policy",
  intro: [
    [
      { text: "Thank you for choosing " },
      { text: "Arte Collective", bold: true },
      { text: ". Here is how we handle your order, from the printer to your doorstep." },
    ],
  ],
  sections: [
    {
      heading: "1. Delivery Area",
      paragraphs: [
        [
          { text: "We ship exclusively " },
          { text: "within the United States", bold: true },
          { text: " to ensure the fastest and most reliable service from our US-based stock." },
        ],
      ],
    },
    {
      heading: "2. Timelines: Printing + Shipping",
      paragraphs: [[{ text: "Because we print every piece to order, your delivery time consists of two steps:" }]],
      list: [
        [
          { text: "Production (Printing):", bold: true },
          { text: " It takes " },
          { text: "up to 5 business days", bold: true },
          { text: " to print and quality-check your art." },
        ],
        [
          { text: "Shipping (Transit):", bold: true },
          { text: " Once printed and picked up by the carrier, shipping usually takes between " },
          { text: "2 to 3 business days", bold: true },
          { text: "." },
          { break: true },
          { break: true },
          { text: "Total Estimated Time:", bold: true },
          { text: " Most customers receive their art within 5 to 8 business days after placing their order." },
        ],
      ],
    },
    {
      heading: "3. Shipping Addresses & Restrictions",
      paragraphs: [[{ text: "Please provide a valid, complete physical address at checkout." }]],
      list: [
        [
          { text: "PO Boxes & Military Zones:", bold: true },
          { text: " We " },
          { text: "do not", bold: true },
          { text: " deliver to PO Boxes or APO/FPO addresses, as our carriers cannot guarantee safe delivery." },
        ],
        [
          { text: "Address Errors:", bold: true },
          {
            text: " If an invalid address causes a delay or a return, the customer will be responsible for any additional shipping fees to resend the order.",
          },
        ],
      ],
    },
    {
      heading: "4. Tracking Your Art",
      paragraphs: [
        [
          { text: "The moment your order is printed and shipped, you will receive a " },
          { text: "tracking number via email", bold: true },
          { text: ". You can follow its journey directly through the link provided." },
        ],
      ],
    },
    {
      heading: "5. Lost or Delayed Packages",
      paragraphs: [
        [
          {
            text: "If your tracking hasn't updated in over 5 business days, please let us know. If a package is officially confirmed as lost by the carrier, we will send a free replacement immediately.",
          },
        ],
      ],
    },
    {
      heading: "Questions?",
      paragraphs: [
        [
          { text: "The fastest way to get an update is to " },
          { text: "reply directly to your order confirmation email", bold: true },
          { text: " or reach out to us at: 📧 " },
          { text: "contact@arte-collective.com", bold: true },
        ],
      ],
    },
  ],
};
