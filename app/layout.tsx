import type { Metadata } from "next";
import "@fontsource/aileron/400.css";
import "@fontsource/aileron/600.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miora",
  description: "Miora design system",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-base text-text">
        {children}
      </body>
    </html>
  );
}
