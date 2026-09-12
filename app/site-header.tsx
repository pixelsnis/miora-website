import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-[53px] items-center justify-between bg-background/95 px-4 text-sm font-semibold backdrop-blur-sm">
      <Link href="/" className="text-ink">
        Miora
      </Link>
      <nav
        aria-label="Primary navigation"
        className="absolute left-1/2 hidden -translate-x-1/2 items-center text-text-muted md:flex"
      >
        <span className="w-[120px] text-center" aria-disabled="true">
          Docs
        </span>
        <span className="w-[120px] text-center" aria-disabled="true">
          Features
        </span>
        <span className="w-[120px] text-center" aria-disabled="true">
          Cloud
        </span>
      </nav>
      <Link href="/#coming-soon" className="text-text-muted hover:text-ink">
        Coming Soon
      </Link>
    </header>
  );
}
