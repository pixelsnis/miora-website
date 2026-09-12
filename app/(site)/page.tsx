import type { Metadata } from "next";
import { ComingSoon } from "./_components/coming-soon";
import { FeatureCards } from "./_components/feature-cards";
import { HeroIllustration } from "./_components/hero-illustration";
import { HeroSignup } from "./_components/hero-signup";
import { HomeStructuredData } from "./_components/home-structured-data";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

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
        className="mx-auto flex min-h-[75vh] w-full max-w-[1280px] flex-col justify-center px-4 pb-8 pt-12 sm:px-8 lg:px-[72px] lg:py-12"
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
