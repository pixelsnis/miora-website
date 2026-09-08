export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-10 sm:px-10 lg:gap-16 lg:px-16 lg:py-16">
        <header className="flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-mono text-text-secondary">
              MIORA / DESIGN TOKENS
            </p>
            <h1 className="mt-5 text-h1 font-semibold text-ink">
              A quiet system for intelligent work.
            </h1>
            <p className="mt-5 max-w-xl text-body text-text-secondary">
              A compact specimen for the type, color, and surface language that
              shapes Miora.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-mono text-text-secondary">
            <span className="size-2 bg-moss" aria-hidden="true" />
            <span>FOUNDATION / V1</span>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-3" aria-labelledby="type-heading">
          <div>
            <p className="font-mono text-mono text-text-secondary">TYPE SCALE</p>
            <h2 id="type-heading" className="mt-4 text-h2 font-semibold text-ink">
              Hierarchy through proportion.
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-2">
            <div className="border-t border-line pt-4">
              <p className="font-mono text-mono text-text-muted">H3 / 18</p>
              <h3 className="mt-4 text-h3 font-semibold text-ink">
                Calm, precise, useful.
              </h3>
              <p className="mt-3 text-body text-text-secondary">
                Body copy stays readable and measured, leaving space for the
                interface to breathe.
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <p className="font-mono text-mono text-text-muted">H4 / 14</p>
              <h4 className="mt-4 text-h4 font-semibold text-ink">
                Signal over noise.
              </h4>
              <p className="mt-3 text-caption text-text-secondary">
                CAPTION / SUPPORTING INFORMATION
              </p>
            </div>
            <div className="border-t border-line pt-4 sm:col-span-2">
              <p className="font-mono text-mono text-text-muted">MONO / 13</p>
              <p className="mt-4 font-mono text-mono text-text-secondary">
                sync.status: ready / autonomy: enabled
              </p>
              <p className="mt-2 font-mono text-mono-emphasis font-semibold text-ink">
                MONO EMPHASIS / SYSTEM OUTPUT
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3" aria-label="Surface tokens">
          <div className="flex min-h-48 flex-col justify-between border border-line bg-surface-1 p-6">
            <p className="font-mono text-mono text-text-secondary">SURFACE 1</p>
            <div>
              <h3 className="text-h3 font-semibold text-ink">Quiet context.</h3>
              <p className="mt-2 text-body text-text-secondary">
                Cards and subtle panels.
              </p>
            </div>
          </div>
          <div className="flex min-h-48 flex-col justify-between border border-line bg-surface-2 p-6">
            <p className="font-mono text-mono text-text-secondary">SURFACE 2</p>
            <div>
              <h3 className="text-h3 font-semibold text-ink">Raised focus.</h3>
              <p className="mt-2 text-body text-text-secondary">
                Selected or active regions.
              </p>
            </div>
          </div>
          <div className="flex min-h-48 flex-col justify-between bg-surface-dark p-6 text-white">
            <p className="font-mono text-mono text-white/70">SURFACE DARK</p>
            <div>
              <h3 className="text-h3 font-semibold">A decisive action.</h3>
              <p className="mt-2 text-body text-white/70">
                Contrast for important moments.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-line pt-8" aria-labelledby="accent-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-mono text-text-secondary">ACCENTS</p>
              <h2 id="accent-heading" className="mt-4 text-h2 font-semibold text-ink">
                Meaning in small doses.
              </h2>
            </div>
            <p className="max-w-sm text-body text-text-secondary">
              Moss leads for Miora-controlled activity; the other hues identify
              external agents and transient system states.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["MOSS", "Autonomous behavior", "bg-moss"],
              ["CLAY", "Warm agent activity", "bg-clay"],
              ["DUSTY BLUE", "Technical sync", "bg-dusty-blue"],
              ["VIOLET", "Intelligence activity", "bg-violet"],
            ].map(([name, role, color]) => (
              <div key={name} className="flex items-center gap-4 border border-line-subtle bg-surface-1 p-4">
                <span className={`size-4 shrink-0 ${color}`} aria-hidden="true" />
                <div>
                  <p className="font-mono text-mono-emphasis font-semibold text-ink">{name}</p>
                  <p className="mt-1 text-caption text-text-secondary">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
