import type { Metadata } from "next";
import Link from "next/link";
import { VariantFlush } from "./variant-flush";
import { VariantMasthead } from "./variant-masthead";
import { VariantSplit } from "./variant-split";

export const metadata: Metadata = {
  title: "Footer 1 variants",
  robots: { index: false, follow: false },
};

const variants = [
  {
    id: "masthead",
    number: "01a",
    title: "Masthead",
    thesis:
      "Kosbiotic order: line and links, then a solid wordmark, then a quiet legal bar. The type is the structure.",
  },
  {
    id: "split",
    number: "01b",
    title: "Split plate",
    thesis:
      "Two cells only — the line, and elsewhere — then the same wordmark. Still a plate, without a sitemap.",
  },
  {
    id: "flush",
    number: "01c",
    title: "Flush mark",
    thesis:
      "Wordmark first, almost to the edge. Statement, icons, and copyright hang off it as one ruled row.",
  },
];

export default function Footer1VariantsPage() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <header className="sticky top-0 z-50 flex h-[53px] items-center justify-between bg-background/95 px-4 text-sm font-semibold backdrop-blur-sm">
        <Link href="/" className="hover:text-text-secondary">
          Miora
        </Link>
        <nav
          aria-label="Variants"
          className="hidden items-center gap-6 text-text-muted md:flex"
        >
          {variants.map((variant) => (
            <a key={variant.id} href={`#${variant.id}`} className="hover:text-ink">
              {variant.number}
            </a>
          ))}
        </nav>
        <Link
          href="/footer-design"
          className="font-mono text-[11px] font-normal text-text-muted hover:text-ink"
        >
          Studies
        </Link>
      </header>

      <section className="mx-auto max-w-[720px] px-4 py-16 sm:px-8 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
          Ruled plate · variants
        </p>
        <h1 className="mt-3 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em]">
          Same close, three assemblies.
        </h1>
        <p className="mt-5 text-sm leading-6 text-text-secondary">
          The line is two lines. The grid is small. Socials go out to Threads and
          X. Nothing here restates the waitlist, the command, or the three
          guarantees. Padding matches the landing page so any of these can drop
          in under the final image.
        </p>
      </section>

      {variants.map((variant, index) => (
        <section key={variant.id} id={variant.id} className="scroll-mt-16">
          <div className="border-y border-line bg-surface-1 px-4 py-6 sm:px-8">
            <div className="mx-auto flex max-w-[1080px] flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] text-text-muted">
                  {variant.number}
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                  {variant.title}
                </h2>
              </div>
              <p className="max-w-[52ch] text-sm leading-6 text-text-secondary">
                {variant.thesis}
              </p>
            </div>
          </div>
          <div className="h-24 bg-background" aria-hidden />
          {index === 0 ? <VariantMasthead /> : null}
          {index === 1 ? <VariantSplit /> : null}
          {index === 2 ? <VariantFlush /> : null}
        </section>
      ))}
    </main>
  );
}
