import Image from "next/image";

export function ComingSoon() {
  return (
    <section
      id="coming-soon"
      className="flex w-full flex-col items-center justify-center gap-8 bg-background py-16 sm:py-20 md:min-h-[800px] lg:min-h-[832px] lg:py-0"
      aria-labelledby="coming-soon-heading"
    >
      <div className="flex w-full max-w-[560px] flex-col items-center gap-4 px-4 sm:px-8 lg:px-0">
        <div className="flex w-full flex-col items-center gap-2">
          <h2
            id="coming-soon-heading"
            className="text-h2 font-semibold text-ink"
          >
            Coming soon.
          </h2>
          <p className="font-mono text-sm leading-[1.5] text-ink">
            [in development]
          </p>
        </div>
        <div
          className="flex w-full border border-line"
          aria-label="Early access signup placeholder"
        >
          <label htmlFor="coming-soon-email" className="sr-only">
            Email address
          </label>
          <input
            id="coming-soon-email"
            name="email"
            type="email"
            placeholder="winger@greendale.edu"
            disabled
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-text-muted outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            className="shrink-0 bg-surface-dark px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed"
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="relative h-[240px] w-full shrink-0 select-none overflow-hidden sm:h-[280px] md:h-[360px]">
        <Image
          src="/images/landing/coming-soon-bg.webp"
          alt=""
          fill
          draggable={false}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-dusty-blue mix-blend-color" />
        <div className="absolute left-1/2 top-1/2 flex w-[240px] -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-2 rounded-[10px] bg-white px-4 py-3 shadow-[0_7px_7.5px_rgba(0,0,0,0.1),0_26px_13px_rgba(0,0,0,0.09),0_59px_18px_rgba(0,0,0,0.05),0_106px_21px_rgba(0,0,0,0.01)]">
          <p className="w-full font-mono text-sm font-semibold leading-[1.5] tracking-[-0.35px] text-ink">
            <span className="font-normal text-dusty-blue">❯</span>
            {` npx miora`}
          </p>
          <p className="w-full font-mono text-[12px] leading-[1.5] tracking-[-0.3px] text-text-muted">
            Coming soon.
          </p>
        </div>
      </div>
    </section>
  );
}
