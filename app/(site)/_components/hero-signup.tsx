"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "griddy-icons";
import { LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { submitLandingEmail } from "@/app/_actions";
import { captureEvent } from "@/lib/analytics/client";
import { SignupField } from "./signup-field";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const FADE = { duration: 0.22, ease: EASE_OUT };
const LAYOUT = { duration: 0.28, ease: EASE_OUT };

function canSubmitEmail(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.includes("@");
}

export function HeroSignup() {
  const [email, setEmail] = useState("");
  const [resumeToken, setResumeToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const trimmedEmail = email.trim();
  const canSubmit = canSubmitEmail(email);
  const motionTransition = shouldReduceMotion ? { duration: 0 } : LAYOUT;
  const fadeTransition = shouldReduceMotion ? { duration: 0 } : FADE;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitted || isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    captureEvent("early_access_signup_attempted", { form_location: "hero" });
    const result = await submitLandingEmail(trimmedEmail);
    setIsSubmitting(false);
    if (result.ok && result.resumeToken) {
      setResumeToken(result.resumeToken);
      setSubmitted(true);
      captureEvent("early_access_signup_succeeded", { form_location: "hero" });
    } else if (result.ok) {
      captureEvent("early_access_signup_failed", {
        form_location: "hero",
        failure_type: "resume_token",
      });
      setError("We couldn't create your survey link. Please try again.");
    } else {
      captureEvent("early_access_signup_failed", {
        form_location: "hero",
        failure_type: result.errors?.email ? "validation" : "submission",
      });
      setError(result.errors?.email ?? result.message ?? "We couldn't save your email. Please try again.");
    }
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
            "flex min-w-0",
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
                  initial={shouldReduceMotion ? false : { opacity: 0, transform: "scale(0.92)" }}
                  animate={{ opacity: 1, transform: "scale(1)" }}
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
              <SignupField
                id="hero-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                inputClassName="text-ink"
              >
                <motion.button
                  layout
                  type="submit"
                  data-ready={canSubmit ? "true" : undefined}
                  disabled={!canSubmit || isSubmitting}
                  transition={motionTransition}
                  className={cn(
                    "signup-submit shrink-0 px-5 py-2.5 text-sm font-semibold",
                    canSubmit
                      ? "bg-surface-dark text-white"
                      : "cursor-not-allowed bg-surface-2 text-text-muted",
                  )}
                >
                  {isSubmitting ? (
                    <LoaderCircle size={16} className="animate-spin" aria-label="Submitting" />
                  ) : (
                    "Sign Up"
                  )}
                </motion.button>
              </SignupField>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence initial={false}>
          {submitted ? (
            <motion.div
              key="help-shape"
              layout
              initial={shouldReduceMotion ? false : { opacity: 0, transform: "translateX(-12px)" }}
              animate={{ opacity: 1, transform: "translateX(0px)" }}
              exit={{ opacity: 0, transform: "translateX(-12px)" }}
              transition={{ ...fadeTransition, delay: shouldReduceMotion ? 0 : 0.05 }}
              className="shrink-0"
            >
              <Link
                href={`/survey?resume=${encodeURIComponent(resumeToken)}&source=landing`}
                onClick={() => captureEvent("survey_cta_clicked", { form_location: "hero" })}
                className="flex h-full items-center gap-2.5 bg-surface-dark px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 ease-ui hover:bg-[color-mix(in_oklch,var(--color-surface-dark),white_8%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
              >
                Help shape Miora
                <ArrowRight size={21} className="size-[21px] shrink-0" />
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
      {error ? <p role="alert" className="mt-2 text-xs text-clay">{error}</p> : null}
    </form>
  );
}
