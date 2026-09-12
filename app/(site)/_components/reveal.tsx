"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "./wipe-replace";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.28,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const hidden = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, transform: "translateY(16px)" };
  const shown = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, transform: "translateY(0px)" };

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, amount }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.56,
        delay: shouldReduceMotion ? 0 : delay,
        ease: EASE_OUT,
      }}
    >
      {children}
    </motion.div>
  );
}
