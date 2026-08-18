# Page Topology — Refund Policy

URL: https://arte-collective.com/policies/refund-policy
Route: `src/app/policies/refund-policy/page.tsx`
Page key: `policies-refund-policy-4c934ce1`

Uses the same shared shell as Privacy Policy — see
`../policies-privacy-policy-c6df4c25/components/PolicyPage.spec.md` for the
full visual spec (typography, container width, header clearance).

## Structure

```
<AnnouncementBar />
<Header />
<EmailCaptureModal />
<PolicyPage>
  H1: "Refund policy"
  (no "Last updated" line — the live page does not render one for this policy)
  Returns & Refunds                          — 2 paragraphs, no list
  1. Changed your mind? (Easy 14-Day Returns) — paragraph + 3-item bullet list
  2. Damaged or Defective Items               — paragraph + 2-item bullet list
  3. Shipping & Address Issues                — single paragraph
  4. Lost Orders                              — single paragraph
  5. Still have questions?                    — single paragraph
</PolicyPage>
<Footer />
```

## Content source

Data file: `src/components/sites/arte-collective-com-1c7b1bdd/policies-refund-policy-4c934ce1/content.ts`

Transcribed verbatim from the live page's rendered HTML, fetched directly via
HTTP (see the "Notes / known limitations" section in the Privacy Policy
topology doc for why — the shared Chrome automation session was heavily
contended by sibling agents building other pages concurrently).
