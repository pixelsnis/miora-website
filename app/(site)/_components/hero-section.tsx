import { HeroIllustration } from "./hero-illustration";
import { HeroSignup } from "./hero-signup";

export function HeroSection() {
  return (
    <section
      className="mx-auto flex min-h-[75vh] w-full max-w-[1280px] flex-col justify-center px-4 pb-8 pt-12 sm:px-8 lg:px-[72px] lg:py-12"
      aria-labelledby="hero-heading"
    >
      <div className="mb-4 w-full max-w-[480px]">
        <h1
          id="hero-heading"
          className="hero-rise text-[32px] font-normal leading-[1.02] tracking-[-0.025em] text-ink sm:text-[28px] sm:leading-none"
        >
          <strong className="font-semibold">Miora</strong> aligns agents with
          project knowledge while you keep building.
        </h1>
        <p className="hero-rise hero-rise-status mt-2 font-mono text-sm leading-6">
          [in development]
        </p>
        <div className="hero-rise hero-rise-form">
          <HeroSignup />
        </div>
      </div>
      <div className="hero-art-in">
        <HeroIllustration />
      </div>
    </section>
  );
}
