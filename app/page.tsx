import type { Metadata } from "next";
import { ComingSoon } from "./coming-soon";
import { FeatureCards } from "./feature-cards";
import { HeroIllustration } from "./hero-illustration";
import { HeroSignup } from "./hero-signup";
import { HomeStructuredData } from "./home-structured-data";
import { SITE_DEFINITION, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <main className="bg-background text-ink">
      <HomeStructuredData />
      <section
        className="mx-auto flex max-h-[90vh] min-h-0 w-full max-w-[1280px] flex-col justify-center px-4 pb-8 pt-12 sm:px-8 lg:px-[72px] lg:py-12"
        aria-labelledby="hero-heading"
      >
        <div className="mb-4 w-full max-w-[480px]">
          <h1
            id="hero-heading"
            className="text-[28px] font-normal leading-[1.02] tracking-[-0.025em] text-ink sm:leading-none"
          >
            <strong className="font-semibold">Miora</strong> aligns agents with
            project knowledge while you keep building.
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {SITE_DEFINITION}
          </p>
          <p className="mt-2 font-mono text-sm leading-6">[in development]</p>
          <HeroSignup />
        </div>
        <HeroIllustration />
      </section>

      <FeatureCards />
      <ComingSoon />
    </main>
  );
}
