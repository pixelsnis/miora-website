import { ComingSoon } from "./coming-soon";
import { FeatureCards } from "./feature-cards";
import { HeroIllustration } from "./hero-illustration";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <header className="sticky top-0 z-50 flex h-[53px] items-center justify-between bg-background/95 px-4 text-sm font-semibold backdrop-blur-sm">
        <span>Miora</span>
        <nav aria-label="Primary navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center text-text-muted md:flex">
          <span className="w-[120px] text-center" aria-disabled="true">Docs</span>
          <span className="w-[120px] text-center" aria-disabled="true">Features</span>
          <span className="w-[120px] text-center" aria-disabled="true">Cloud</span>
        </nav>
        <a href="#coming-soon" className="text-text-muted hover:text-ink">
          Coming Soon
        </a>
      </header>

      <section className="mx-auto flex max-h-[90vh] min-h-0 w-full max-w-[1280px] flex-col justify-center px-4 pb-8 pt-12 sm:px-8 lg:px-[72px] lg:py-12" aria-labelledby="hero-heading">
        <div className="mb-4 w-full max-w-[480px]">
          <h1 id="hero-heading" className="text-[28px] font-normal leading-[1.02] tracking-[-0.025em] text-ink sm:leading-none">
            <strong className="font-semibold">Miora</strong> aligns agents with project knowledge while you keep building.
          </h1>
          <p className="mt-3 font-mono text-sm leading-6">[early access]</p>
          <div className="mt-2 flex w-full border border-line" aria-label="Early access signup placeholder">
            <label htmlFor="hero-email" className="sr-only">Email address</label>
            <input id="hero-email" name="email" type="email" placeholder="winger@greendale.edu" disabled className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-text-muted outline-none placeholder:text-text-muted disabled:cursor-not-allowed" />
            <button type="button" disabled className="shrink-0 bg-surface-dark px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed">Sign Up</button>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <FeatureCards />
      <ComingSoon />
    </main>
  );
}
