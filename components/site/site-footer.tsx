import { Threads, X } from "griddy-icons";
import { FooterWordmark } from "./footer-wordmark";

const THREADS_HREF = "https://www.threads.net/@pixelsnis";
const X_HREF = "https://x.com/pixelsnis";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-background text-ink">
      <div className="flex flex-col gap-8 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-10 lg:px-[72px]">
        <p className="text-[22px] font-semibold leading-[1.12] tracking-[-0.03em]">
          Quiet infrastructure
          <br />
          for people who build with agents.
        </p>
        <nav aria-label="Social" className="flex items-center gap-4">
          <a
            href={THREADS_HREF}
            target="_blank"
            rel="noreferrer"
            aria-label="Threads"
            className="social-icon text-text-muted hover:text-ink focus-visible:text-ink focus-visible:outline-none"
          >
            <Threads size={24} />
          </a>
          <a
            href={X_HREF}
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            className="social-icon text-text-muted hover:text-ink focus-visible:text-ink focus-visible:outline-none"
          >
            <X size={24} />
          </a>
        </nav>
      </div>
      <div className="border-y border-line px-4 py-3 sm:px-8 lg:px-[72px]">
        <FooterWordmark />
      </div>
      <div className="px-4 py-4 sm:px-8 lg:px-[72px]">
        <p className="text-[12px] text-text-muted">© 2026 Miora</p>
      </div>
    </footer>
  );
}
