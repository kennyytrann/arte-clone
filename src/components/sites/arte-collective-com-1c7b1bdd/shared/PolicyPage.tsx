import { cn } from "@/lib/utils";

/**
 * Shared shell for Arte Collective's Shopify policy pages
 * (Privacy Policy, Refund Policy, Shipping Policy, Terms of Service).
 *
 * All four pages share the exact same template on the live site:
 * an H1 title, an optional "Last updated: <date>" line, then a
 * rich-text body made of `<h3>` section headings, paragraphs with
 * inline bold labels/links, and the occasional bullet list.
 *
 * Content is passed in as typed data (see `content.ts` files per page)
 * rather than raw HTML, so real verbatim site copy stays type-safe and
 * XSS-free while still supporting arbitrary inline bold/link runs.
 */

/** One inline run of text inside a paragraph or list item. */
export type Run = { text: string; bold?: boolean; link?: string } | { break: true };

/** A paragraph (or list item) is an ordered sequence of inline runs. */
export type RichText = Run[];

export interface PolicySection {
  /** Section heading text, e.g. "1. What Information Do We Collect?" */
  heading: string;
  /** Render a horizontal rule above this section (used once in Terms of Service). */
  hrBefore?: boolean;
  /** Paragraphs that appear directly under the heading. */
  paragraphs?: RichText[];
  /** Optional bullet list under the heading (after `paragraphs`). */
  list?: RichText[];
  /** Optional paragraphs that appear after the bullet list, still under this heading. */
  paragraphsAfterList?: RichText[];
}

export interface PolicyPageContent {
  title: string;
  /** Shown as "Last updated: <lastUpdated>" when present. Not every policy page has one. */
  lastUpdated?: string;
  /** Paragraphs that appear before the first section heading. */
  intro?: RichText[];
  sections: PolicySection[];
}

function RenderRuns({ runs }: { runs: RichText }) {
  return (
    <>
      {runs.map((run, i) => {
        if ("break" in run) return <br key={i} />;
        if (run.link) {
          return (
            <a
              key={i}
              href={run.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "underline underline-offset-2 decoration-[#c9c9c9] hover:decoration-current",
                run.bold && "font-semibold text-[#151515]"
              )}
            >
              {run.text}
            </a>
          );
        }
        return (
          <span key={i} className={run.bold ? "font-semibold text-[#151515]" : undefined}>
            {run.text}
          </span>
        );
      })}
    </>
  );
}

function Paragraph({ runs, className }: { runs: RichText; className?: string }) {
  return (
    <p className={cn("text-[14px] leading-[1.7] text-arte-text-muted", className)}>
      <RenderRuns runs={runs} />
    </p>
  );
}

export function PolicyPage({ title, lastUpdated, intro, sections }: PolicyPageContent) {
  return (
    <div className="mx-auto w-full max-w-[574px] px-5 pb-24 pt-[86px] sm:pt-[104px]">
      <h1 className="text-center font-sans text-[28px] font-semibold leading-[1.35] text-[#151515] sm:text-[37px] sm:leading-[1.4]">
        {title}
      </h1>

      <div className="mt-8">
        {lastUpdated ? (
          <p className="mb-5 text-[14px] leading-[1.7] text-arte-text-muted">
            <span className="font-semibold text-[#151515]">Last updated:</span> {lastUpdated}
          </p>
        ) : null}

        {intro?.map((p, i) => (
          <Paragraph key={`intro-${i}`} runs={p} className="mb-5" />
        ))}

        {sections.map((section, si) => (
          <div key={si}>
            {section.hrBefore ? <hr className="my-8 border-t border-[#e5e5e5]" /> : null}

            <h3 className="mb-3 mt-8 text-[19px] font-semibold leading-[1.4] text-[#151515] sm:text-[23px]">
              {section.heading}
            </h3>

            {section.paragraphs?.map((p, i) => (
              <Paragraph key={`p-${i}`} runs={p} className="mb-3 last:mb-0" />
            ))}

            {section.list ? (
              <ul className="mb-3 list-disc space-y-3 pl-[17px] marker:text-arte-text-muted">
                {section.list.map((item, i) => (
                  <li key={i}>
                    <Paragraph runs={item} />
                  </li>
                ))}
              </ul>
            ) : null}

            {section.paragraphsAfterList?.map((p, i) => (
              <Paragraph key={`pa-${i}`} runs={p} className="mb-3 last:mb-0" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
