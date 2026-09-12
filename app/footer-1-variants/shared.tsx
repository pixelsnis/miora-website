export const THREADS_HREF = "https://www.threads.net/@pixelsnis";
export const X_HREF = "https://x.com/pixelsnis";

export function Statement({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-[22px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink ${className}`}
    >
      Quiet infrastructure
      <br />
      for people who build with agents.
    </p>
  );
}

export function PlateWordmark({ className = "" }: { className?: string }) {
  return (
    <p
      className={`select-none font-semibold leading-[0.82] tracking-[-0.07em] text-ink ${className}`}
      style={{ fontSize: "clamp(4.5rem, 18vw, 13.75rem)" }}
      aria-label="Miora"
    >
      miora
    </p>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M12.6 1H15L9.62 7.16 15.89 15h-4.37L8.1 9.97 4.2 15H1.78l5.75-6.57L1 1h4.48l3.16 4.57L12.6 1Zm-.8 12.61h1.21L4.25 2.32H2.95l8.85 11.29Z" />
    </svg>
  );
}

function ThreadsMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.643.79-6.493 2.624-8.807C5.951 1.235 8.717.012 12.195 0h.014c2.746.016 5.026.657 6.766 1.9 1.773 1.266 2.833 3.037 3.152 5.26l-2.162.675c-.24-1.688-.947-2.977-2.105-3.832-1.163-.857-2.764-1.3-4.76-1.32h-.014c-2.845.02-4.87.887-6.02 2.577-1.137 1.67-1.72 3.91-1.74 6.66v.017c.02 2.703.605 4.917 1.74 6.58 1.147 1.68 3.168 2.558 6.01 2.577h.014c2.1-.016 3.78-.51 4.99-1.47 1.24-.983 1.98-2.458 2.2-4.385h-6.2v-2.18h8.43c.07.4.11.82.11 1.26 0 2.57-.7 4.61-2.08 6.07C18.1 23.13 15.47 23.98 12.186 24z" />
    </svg>
  );
}

export function SocialLinks({
  className = "",
  variant = "row",
}: {
  className?: string;
  variant?: "row" | "stack" | "icons";
}) {
  const links = [
    { href: THREADS_HREF, label: "Threads", icon: <ThreadsMark /> },
    { href: X_HREF, label: "X", icon: <XMark /> },
  ];

  if (variant === "icons") {
    return (
      <ul className={`flex items-center gap-4 ${className}`}>
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-ink hover:text-text-secondary"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={`${variant === "stack" ? "flex flex-col gap-2" : "flex flex-wrap gap-x-5 gap-y-2"} ${className}`}
    >
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-ink hover:text-text-secondary"
          >
            {link.icon}
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function LegalLine({ className = "" }: { className?: string }) {
  return (
    <p className={`flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-text-muted ${className}`}>
      <span>© 2026 Miora</span>
      <span>Privacy</span>
      <span>Terms</span>
    </p>
  );
}
