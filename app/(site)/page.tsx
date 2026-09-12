import type { Metadata } from "next";
import { ComingSoon } from "./_components/coming-soon";
import { FeatureCards } from "./_components/feature-cards";
import { HeroSection } from "./_components/hero-section";
import { HomeStructuredData } from "./_components/home-structured-data";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function Home() {
  return (
    <main className="bg-background text-ink">
      <HomeStructuredData />
      <HeroSection />
      <FeatureCards />
      <ComingSoon />
    </main>
  );
}
