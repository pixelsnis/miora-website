"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "cn";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sync = () => {
      setScrolled(window.scrollY > 8);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-[53px] items-center justify-between px-4 text-sm font-semibold backdrop-blur-sm transition-[border-color,background-color] duration-[var(--duration-micro)] ease-ui",
        scrolled
          ? "border-b border-line bg-background/90"
          : "border-b border-transparent bg-background/95",
      )}
    >
      <Link href="/" className="nav-underline text-ink">
        Miora
      </Link>
      <nav
        aria-label="Primary navigation"
        className="absolute left-1/2 hidden -translate-x-1/2 items-center text-text-muted md:flex"
      >
        <span className="w-[120px] cursor-default text-center" aria-disabled="true">
          Docs
        </span>
        <span className="w-[120px] cursor-default text-center" aria-disabled="true">
          Features
        </span>
        <span className="w-[120px] cursor-default text-center" aria-disabled="true">
          Cloud
        </span>
      </nav>
      <Link
        href="/#coming-soon"
        className="nav-underline text-text-muted transition-colors duration-[var(--duration-micro)] ease-ui hover:text-ink"
      >
        Coming Soon
      </Link>
    </header>
  );
}
