"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "griddy-icons";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "cn";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const FADE = { duration: 0.22, ease: EASE_OUT };
const LAYOUT = { duration: 0.28, ease: EASE_OUT };

function canSubmitEmail(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.includes("@");
}

export function HeroSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const trimmedEmail = email.trim();
  const canSubmit = canSubmitEmail(email);
  const motionTransition = shouldReduceMotion ? { duration: 0 } : LAYOUT;
  const fadeTransition = shouldReduceMotion ? { duration: 0 } : FADE;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitted) return;
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 w-full"
      aria-label="Early access signup"
    >
      <motion.div
        layout
        transition={motionTransition}
        className={cn("flex w-full", submitted && "gap-2")}
      >
        <motion.div
          layout
          transition={motionTransition}
          className={cn(
            "flex min-w-0 border border-line",
            submitted ? "min-w-0 flex-1" : "w-full",
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {submitted ? (
              <motion.div
                key="confirmed"
                layout
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
                className="flex min-w-0 flex-1"
                role="status"
              >
                <p className="min-w-0 flex-1 truncate px-3 py-2.5 text-sm text-ink">
                  {trimmedEmail}
                </p>
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...fadeTransition, delay: shouldReduceMotion ? 0 : 0.06 }}
                  className="flex shrink-0 items-center bg-surface-2 px-5 py-2.5"
                  aria-hidden
                >
                  <Check size={21} className="size-[21px] shrink-0 text-ink" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="editable"
                layout
                initial={false}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
                className="flex min-w-0 flex-1"
              >
                <label htmlFor="hero-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="hero-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="winger@greendale.edu"
                  autoComplete="email"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-text-muted"
                />
                <motion.button
                  layout
                  type="submit"
                  disabled={!canSubmit}
                  transition={motionTransition}
                  className={cn(
                    "shrink-0 px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ease-ui",
                    canSubmit
                      ? "bg-surface-dark text-white"
                      : "cursor-not-allowed bg-surface-2 text-text-muted",
                  )}
                >
                  Sign Up
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence initial={false}>
          {submitted ? (
            <motion.div
              key="help-shape"
              layout
              initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ ...fadeTransition, delay: shouldReduceMotion ? 0 : 0.05 }}
              className="shrink-0"
            >
              <Link
                href={`/survey?email=${encodeURIComponent(trimmedEmail)}`}
                className="flex h-full items-center gap-2.5 bg-surface-dark px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 ease-ui hover:bg-[color-mix(in_oklch,var(--color-surface-dark),white_8%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
              >
                Help shape Miora
                <ArrowRight size={21} className="size-[21px] shrink-0" />
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </form>
  );
}
