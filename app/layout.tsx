import type { Metadata } from "next";
import "@fontsource/aileron/400.css";
import "@fontsource/aileron/600.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/600.css";
import "./globals.css";
import { PostHogPageview } from "./posthog-pageview";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export const metadata: Metadata = {
  title: "Miora",
  description: "Miora aligns agents with project knowledge while you keep building.",
  openGraph: {
    images: [
      {
        url: "/images/og.webp",
        width: 1200,
        height: 630,
        alt: "Miora",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-base text-text">
        <PostHogPageview />
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
