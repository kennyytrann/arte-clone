import type { PolicyPageContent } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/PolicyPage";

/**
 * Verbatim content transcribed from
 * https://arte-collective.com/policies/privacy-policy
 */
export const privacyPolicyContent: PolicyPageContent = {
  title: "Privacy policy",
  lastUpdated: "February 4, 2026",
  intro: [
    [
      { text: "At " },
      { text: "Arte Collective", bold: true },
      {
        text: ", we value your privacy as much as we value art. This policy explains how we collect, use, and protect your information when you visit or shop at ",
      },
      { text: "arte-collective.com", link: "https://arte-collective.com" },
      { text: "." },
    ],
  ],
  sections: [
    {
      heading: "1. What Information Do We Collect?",
      paragraphs: [
        [{ text: "To get our pieces into your hands and provide a smooth experience, we collect:" }],
      ],
      list: [
        [{ text: "Contact Details:", bold: true }, { text: " Name, email address, and phone number." }],
        [
          { text: "Shipping Info:", bold: true },
          { text: " Physical address (to ship your orders directly from our US-based stock)." },
        ],
        [
          { text: "Technical Data:", bold: true },
          { text: " IP address and browsing behavior via cookies (Google Analytics, Facebook Pixel)." },
        ],
      ],
    },
    {
      heading: "2. How Do We Use Your Data?",
      paragraphs: [[{ text: "We don’t collect data just for the sake of it. We use it to:" }]],
      list: [
        [{ text: "Fulfill Orders:", bold: true }, { text: " The essentials—processing payments and shipping your items." }],
        [{ text: "Keep in Touch:", bold: true }, { text: " Send order updates or answer your questions via email." }],
        [
          { text: "Marketing (With Your Consent):", bold: true },
          { text: " If you opt-in, we’ll send you newsletters and use email retargeting to remind you of pieces you liked." },
        ],
        [
          { text: "Improve the Experience:", bold: true },
          { text: " Use Google Analytics and Meta Pixel to understand what’s working on our site." },
        ],
      ],
    },
    {
      heading: "3. Who Do We Share It With?",
      paragraphs: [
        [
          { text: "We " },
          { text: "never", bold: true },
          { text: " sell your data. We only share it with trusted partners necessary to run our business:" },
        ],
      ],
      list: [
        [{ text: "Shopify:", bold: true }, { text: " Our e-commerce platform." }],
        [{ text: "Logistics:", bold: true }, { text: " Shipping carriers to deliver your orders." }],
        [{ text: "Marketing Tools:", bold: true }, { text: " Google and Meta for analytics and targeted ads." }],
      ],
    },
    {
      heading: "4. Your Rights (GDPR & CCPA)",
      paragraphs: [
        [
          { text: "Since we are based in " },
          { text: "France", bold: true },
          { text: " but serve the " },
          { text: "US", bold: true },
          { text: ", we adhere to high protection standards. Regardless of where you live, you have the right to:" },
        ],
      ],
      list: [
        [{ text: "Access", bold: true }, { text: " the personal data we hold about you." }],
        [{ text: "Correct", bold: true }, { text: " any inaccurate information." }],
        [{ text: "Delete", bold: true }, { text: " your data from our systems (the “Right to be Forgotten”)." }],
        [
          { text: "Opt-out", bold: true },
          { text: " of marketing at any time by clicking the “unsubscribe” link in our emails." },
        ],
      ],
    },
    {
      heading: "5. Cookies",
      paragraphs: [
        [
          {
            text: "We use cookies to make your browsing experience better. You can choose to disable them in your browser settings, though some features of the site might not work perfectly without them.",
          },
        ],
      ],
    },
    {
      heading: "6. Get in Touch",
      paragraphs: [
        [
          { text: "Questions? Want to exercise your rights? Drop us a line: 📧 " },
          { text: "contact@arte-collective.com", bold: true },
        ],
      ],
    },
  ],
};
