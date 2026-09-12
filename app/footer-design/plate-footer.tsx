function Cross() {
  return (
    <span className="relative inline-block size-3" aria-hidden>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
    </span>
  );
}

function DraftWordmark() {
  const letters = ["M", "I", "O", "R", "A"];

  return (
    <div className="relative px-2 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-x-4 top-3 flex justify-between sm:inset-x-8">
        <Cross />
        <Cross />
      </div>
      <p
        className="draft-type flex justify-between font-sans text-[18vw] font-normal leading-none sm:text-[14vw] lg:text-[11.5vw]"
        aria-label="Miora"
      >
        {letters.map((letter) => (
          <span key={letter} className="relative px-[0.5vw]">
            <span className="draft-tick left-0 top-[-6px] h-[5px] w-px" />
            <span className="draft-tick right-0 top-[-6px] h-[5px] w-px" />
            <span className="draft-tick left-0 top-[-6px] h-px w-full" />
            <span className="draft-tick bottom-[-6px] left-0 h-[5px] w-px" />
            <span className="draft-tick bottom-[-6px] right-0 h-[5px] w-px" />
            <span className="draft-tick bottom-[-6px] left-0 h-px w-full" />
            {letter}
          </span>
        ))}
      </p>
      <div className="pointer-events-none absolute inset-x-4 bottom-3 flex justify-between sm:inset-x-8">
        <Cross />
        <Cross />
      </div>
    </div>
  );
}

function Cell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-3 border-line p-4 sm:p-5 ${className}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
        {label}
      </p>
      <div className="text-sm leading-6 text-ink">{children}</div>
    </div>
  );
}

function FoldedMark() {
  return (
    <svg
      viewBox="0 0 88 88"
      className="h-[88px] w-[88px] text-ink"
      fill="none"
      aria-hidden
    >
      <path
        d="M10 64 L10 24 L32 12 L44 44 L56 12 L78 24 L78 64 L56 76 L44 48 L32 76 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M32 12 L32 76" stroke="currentColor" strokeWidth="1.1" />
      <path d="M56 12 L56 76" stroke="currentColor" strokeWidth="1.1" />
      <path d="M10 24 L44 44 L78 24" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function PlateFooter() {
  return (
    <footer className="border-y border-line bg-background text-ink">
      <div className="grid grid-cols-1 border-b border-line md:grid-cols-12">
        <div className="flex flex-col justify-between gap-8 border-line p-5 md:col-span-4 md:border-r">
          <p className="max-w-[16ch] text-[22px] font-semibold leading-[1.12] tracking-[-0.03em]">
            Quiet infrastructure for people who build with agents.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
            Early access · 2026
          </p>
        </div>
        <Cell label="Status" className="border-t md:col-span-2 md:border-l-0 md:border-r md:border-t-0">
          <p>[in development]</p>
          <p className="mt-2 text-text-secondary">No public docs yet. The landing page is the product surface.</p>
        </Cell>
        <Cell label="Access" className="border-t md:col-span-3 md:border-r md:border-t-0">
          <p>Waitlist only.</p>
          <p className="mt-2 text-text-secondary">A local CLI. One knowledge folder. Every agent on the machine.</p>
        </Cell>
        <div className="flex items-center justify-center border-t border-line p-6 md:col-span-3 md:border-t-0">
          <FoldedMark />
        </div>
      </div>

      <div className="grid grid-cols-1 border-b border-line md:grid-cols-12">
        <div className="border-line p-5 md:col-span-4 md:border-r">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
            Notify
          </p>
          <p className="mt-3 text-sm text-text-secondary">
            Occasional notes when something actually ships.
          </p>
          <div className="mt-4 flex border border-line">
            <label htmlFor="plate-email" className="sr-only">
              Email address
            </label>
            <input
              id="plate-email"
              type="email"
              placeholder="winger@greendale.edu"
              disabled
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-text-muted outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled
              className="shrink-0 border-l border-line px-3 text-sm text-ink disabled:cursor-not-allowed"
              aria-label="Submit"
            >
              →
            </button>
          </div>
        </div>
        <Cell label="Command" className="border-t md:col-span-3 md:border-r md:border-t-0">
          <p className="font-mono text-[13px]">npx miora</p>
          <p className="mt-2 text-text-secondary">Coming soon.</p>
        </Cell>
        <Cell label="Form" className="border-t md:col-span-3 md:border-r md:border-t-0">
          <p>It is all markdown.</p>
          <p className="mt-2 text-text-secondary">No proprietary vault. A folder you already understand.</p>
        </Cell>
        <Cell label="Later" className="border-t md:col-span-2 md:border-t-0">
          <p className="text-text-muted">Docs</p>
          <p className="text-text-muted">Cloud</p>
          <p className="text-text-muted">Legal</p>
        </Cell>
      </div>

      <DraftWordmark />

      <div className="flex flex-col gap-3 border-t border-line px-5 py-3 text-[11px] text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Miora. All rights reserved.</p>
        <p className="flex gap-6">
          <span>Privacy</span>
          <span>Terms</span>
        </p>
      </div>
    </footer>
  );
}
