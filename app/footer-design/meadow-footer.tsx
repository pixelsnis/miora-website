import Image from "next/image";

function Column({
  title,
  items,
}: {
  title: string;
  items: { label: string; note?: string }[];
}) {
  return (
    <div className="min-w-[140px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
        {title}
      </p>
      <ul className="mt-5 space-y-3 text-sm text-text">
        {items.map((item) => (
          <li key={item.label} className="flex items-baseline gap-2">
            <span>{item.label}</span>
            {item.note ? (
              <span className="font-mono text-[10px] text-text-muted">{item.note}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MeadowFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#f4f3ee] text-ink">
      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col px-6 pb-8 pt-10 sm:px-10 lg:px-12">
        <div className="flex justify-center">
          <button
            type="button"
            disabled
            className="rounded-full bg-surface-dark px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed"
          >
            Get early access →
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:mt-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <p className="text-lg font-semibold tracking-[-0.03em]">Miora</p>
            <p className="mt-4 max-w-[34ch] text-sm leading-6 text-text-secondary">
              Shared project knowledge, kept coherent while every agent keeps
              building.
            </p>
            <p className="mt-8 flex items-center gap-2 text-sm text-text-secondary">
              <span className="size-2 rounded-full bg-moss" aria-hidden />
              Quietly in development
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <Column
              title="Product"
              items={[
                { label: "One command" },
                { label: "Any agent" },
                { label: "Markdown" },
                { label: "Cloud", note: "later" },
              ]}
            />
            <Column
              title="Company"
              items={[
                { label: "About", note: "soon" },
                { label: "Contact", note: "soon" },
              ]}
            />
            <Column
              title="Legal"
              items={[
                { label: "Privacy", note: "soon" },
                { label: "Terms", note: "soon" },
              ]}
            />
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between gap-4 text-[12px] text-text-muted">
          <p>© 2026 Miora.</p>
          <p className="hidden sm:block">A knowledge base that maintains itself.</p>
        </div>
      </div>

      <div className="relative h-[220px] w-full sm:h-[280px] md:h-[340px]">
        <div className="pointer-events-none absolute inset-x-0 -top-24 z-10 h-32 bg-gradient-to-b from-[#f4f3ee] to-transparent" />
        <Image
          src="/images/landing/feature-cards/card-02.webp"
          alt=""
          fill
          draggable={false}
          sizes="100vw"
          className="object-cover object-[50%_72%]"
        />
        <div className="absolute inset-0 bg-moss/25 mix-blend-multiply" />
      </div>
    </footer>
  );
}
