"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "cn";

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref}>
      <p
        className={cn(
          "footer-wordmark select-none font-semibold leading-[0.82] tracking-[-0.07em] text-line",
          inView && "is-in",
        )}
        style={{ fontSize: "clamp(4.5rem, 18vw, 13.75rem)" }}
        aria-hidden
      >
        miora
      </p>
    </div>
  );
}
