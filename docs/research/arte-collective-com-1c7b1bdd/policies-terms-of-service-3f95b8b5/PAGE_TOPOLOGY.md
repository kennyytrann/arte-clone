# Page Topology — Terms of Service

URL: https://arte-collective.com/policies/terms-of-service
Route: `src/app/policies/terms-of-service/page.tsx`
Page key: `policies-terms-of-service-3f95b8b5`

Uses the same shared shell as Privacy Policy — see
`../policies-privacy-policy-c6df4c25/components/PolicyPage.spec.md` for the
full visual spec (typography, container width, header clearance).

## Structure

```
<AnnouncementBar />
<Header />
<EmailCaptureModal />
<PolicyPage>
  H1: "Terms of service"
  "Last updated: February 4, 2026"
  OVERVIEW                                     — 2 paragraphs
  --- <hr> ---
  SECTION 1 - ACCESS AND ACCOUNT                — 1 paragraph
  SECTION 2 - OUR PRODUCTS & MADE-TO-ORDER       — 1 paragraph
  SECTION 3 - ORDERS                             — 1 paragraph
  SECTION 4 - PRICES AND BILLING                 — 1 paragraph
  SECTION 5 - SHIPPING AND DELIVERY              — paragraph + 2-item list
  SECTION 6 - INTELLECTUAL PROPERTY              — 1 paragraph
  SECTION 7 - OPTIONAL TOOLS                     — 1 paragraph
  SECTION 8 - THIRD-PARTY LINKS                  — 1 paragraph
  SECTION 9 - RELATIONSHIP WITH SHOPIFY          — 1 paragraph
  SECTION 10 - PRIVACY POLICY                    — 1 paragraph
  SECTION 11 - FEEDBACK                          — 1 paragraph
  SECTION 12 - ERRORS, INACCURACIES AND OMISSIONS — 1 paragraph
  SECTION 13 - PROHIBITED USES                   — 1 paragraph
  SECTION 14 - TERMINATION                       — 1 paragraph
  SECTION 15 - DISCLAIMER OF WARRANTIES          — 1 paragraph (all-caps, verbatim)
  SECTION 16 - LIMITATION OF LIABILITY           — 1 paragraph (all-caps, verbatim)
  SECTION 17 - INDEMNIFICATION                   — 1 paragraph
  SECTION 18 - SEVERABILITY                      — 1 paragraph
  SECTION 19 - ENTIRE AGREEMENT                  — 1 paragraph
  SECTION 20 - ASSIGNMENT                        — 1 paragraph
  SECTION 21 - GOVERNING LAW                     — 1 paragraph (bold "France")
  SECTION 22 - HEADINGS                          — 1 paragraph
  SECTION 23 - CHANGES TO TERMS OF SERVICE       — 1 paragraph
  SECTION 24 - CONTACT INFORMATION & LEGAL ENTITY — 2 paragraphs + 3-item list
  SECTION 25 - Image Credits & Attributions      — intro paragraph + 3 image
                                                    citation paragraphs, each
                                                    with a bold title, body
                                                    text, and "License:" /
                                                    "Original image:" links
                                                    (Creative Commons
                                                    attributions for 3 Mars
                                                    Express photos)
</PolicyPage>
<Footer />
```

## Content source

Data file: `src/components/sites/arte-collective-com-1c7b1bdd/policies-terms-of-service-3f95b8b5/content.ts`

Transcribed verbatim from the live page's rendered HTML, fetched directly via
HTTP (see the "Notes / known limitations" section in the Privacy Policy
topology doc for why — the shared Chrome automation session was heavily
contended by sibling agents building other pages concurrently).

Note: Section 25 (image credits) in the live page's raw HTML carries stray
`class="font-claude-response-body …"` attributes on its paragraphs — cosmetic
leftovers from how that content was originally authored/pasted into Shopify's
policy editor by the site owner. They have no visual effect and were not
carried over; only the real license/attribution text and links were
transcribed.
