const DEPTH = 22;

export function MonumentFooter() {
  return (
    <footer className="bg-[#070707] text-[#ecece8]">
      <div className="mx-auto flex max-w-[1080px] flex-col px-6 pb-6 pt-12 sm:px-10 lg:px-12 lg:pt-16">
        <div className="flex justify-center">
          <button
            type="button"
            disabled
            className="bg-white px-5 py-2.5 text-sm font-semibold text-[#111] disabled:cursor-not-allowed"
          >
            Request access →
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start lg:mt-24">
          <div>
            <p className="text-[22px] font-semibold tracking-[-0.04em]">Miora</p>
            <p className="mt-3 max-w-[36ch] text-sm leading-6 text-[#8a8a84]">
              Agents write in parallel. The knowledge folder stays aligned.
            </p>
            <p className="mt-8 font-mono text-[11px] text-[#5c5c56]">
              © 2026 Miora
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 text-sm sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#5c5c56]">
                Now
              </p>
              <ul className="mt-4 space-y-2.5 text-[#c8c8c2]">
                <li>Waitlist</li>
                <li>Local CLI</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#5c5c56]">
                Next
              </p>
              <ul className="mt-4 space-y-2.5 text-[#c8c8c2]">
                <li>Docs</li>
                <li>Cloud</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#5c5c56]">
                Company
              </p>
              <ul className="mt-4 space-y-2.5 text-[#c8c8c2]">
                <li>About</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className="monument-stage relative mt-4 h-[260px] overflow-hidden sm:h-[340px] md:h-[440px]"
        aria-hidden
      >
        <div className="monument-stack absolute left-[-4%] top-[6%] w-[118%]">
          {Array.from({ length: DEPTH }, (_, i) => {
            const t = i / (DEPTH - 1);
            const shade = Math.round(16 + (1 - t) * 62);
            return (
              <span
                key={i}
                className="monument-layer justify-start pl-[4%] text-[20vw] sm:text-[16vw] md:text-[13.5vw]"
                style={{
                  transform: `translateZ(${-i * 3.4}px)`,
                  color:
                    i === 0
                      ? "#8a8a84"
                      : `rgb(${shade}, ${shade}, ${Math.max(shade - 4, 0)})`,
                }}
              >
                MIORA
              </span>
            );
          })}
          <span className="invisible block pl-[4%] text-left text-[20vw] font-semibold leading-[0.82] tracking-[-0.07em] sm:text-[16vw] md:text-[13.5vw]">
            MIORA
          </span>
        </div>
      </div>
    </footer>
  );
}
