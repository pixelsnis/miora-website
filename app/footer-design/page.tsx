import type { Metadata } from "next";
import Link from "next/link";
import "./footer-studies.css";
import { MeadowFooter } from "./meadow-footer";
import { MonumentFooter } from "./monument-footer";
import { PlateFooter } from "./plate-footer";

export const metadata: Metadata = {
  title: "Footer studies",
  robots: { index: false, follow: false },
};

const studies = [
  {
    id: "plate",
    number: "01",
    title: "Ruled plate",
    thesis:
      "A construction drawing. Hairline cells, corner ticks, and outline type. Content is status, not a sitemap.",
  },
  {
    id: "meadow",
    number: "02",
    title: "Meadow close",
    thesis:
      "A soft landing. Air, a single pill, muted future links, and a material landscape that the page dissolves into.",
  },
  {
    id: "monument",
    number: "03",
    title: "Monument",
    thesis:
      "A dark close. Almost no chrome, then a heavy extruded wordmark sitting like a physical object.",
  },
];

export default function FooterDesignPage() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <header className="sticky top-0 z-50 flex h-[53px] items-center justify-between bg-background/95 px-4 text-sm font-semibold backdrop-blur-sm">
        <Link href="/" className="hover:text-text-secondary">
          Miora
        </Link>
        <nav aria-label="Studies" className="hidden items-center gap-6 text-text-muted md:flex">
          {studies.map((study) => (
            <a key={study.id} href={`#${study.id}`} className="hover:text-ink">
              {study.number}
            </a>
          ))}
        </nav>
        <span className="font-mono text-[11px] font-normal text-text-muted">
          Internal
        </span>
      </header>

      <section className="mx-auto max-w-[720px] px-4 py-16 sm:px-8 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
          Footer studies
        </p>
        <h1 className="mt-3 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em]">
          Three closing ideas for a site that barely has a sitemap.
        </h1>
        <p className="mt-5 text-sm leading-6 text-text-secondary">
          Early access does not need Company / Product / Resources. These
          studies treat the footer as an ending: a measured plate, a landscape
          fade, or a dark monument. Shared ingredients are only the name, the
          waitlist, and an honest “not yet.”
        </p>
      </section>

      {studies.map((study, index) => (
        <section key={study.id} id={study.id} className="scroll-mt-16">
          <div className="border-y border-line bg-surface-1 px-4 py-6 sm:px-8">
            <div className="mx-auto flex max-w-[1080px] flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] text-text-muted">{study.number}</p>
                <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                  {study.title}
                </h2>
              </div>
              <p className="max-w-[52ch] text-sm leading-6 text-text-secondary">
                {study.thesis}
              </p>
            </div>
          </div>
          {index === 0 ? <PlateFooter /> : null}
          {index === 1 ? <MeadowFooter /> : null}
          {index === 2 ? <MonumentFooter /> : null}
        </section>
      ))}
    </main>
  );
}
