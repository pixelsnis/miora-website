"use client";

import { useEffect, useState } from "react";
import { Check } from "griddy-icons";
import { animate } from "motion";
import { motion, useReducedMotion } from "motion/react";

const PROJECT_NAME = "VirtuGood 6500";
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const FADE = { duration: 0.2, ease: EASE_OUT };

type Scene = {
  project: boolean;
  typed: number;
  link: boolean;
  answer: "yn" | "y";
  vault: boolean;
  ready: boolean;
};

const completeScene: Scene = {
  project: true,
  typed: PROJECT_NAME.length,
  link: true,
  answer: "y",
  vault: true,
  ready: true,
};

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const id = window.setTimeout(resolve, ms);
    const onAbort = () => {
      window.clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export function OneCommandWidget({ play }: { play: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const [scene, setScene] = useState<Scene>(completeScene);

  useEffect(() => {
    if (shouldReduceMotion || !play) {
      const resetId = window.setTimeout(() => setScene(completeScene), 0);
      return () => window.clearTimeout(resetId);
    }

    const abort = new AbortController();
    const { signal } = abort;

    const run = async () => {
      while (!signal.aborted) {
        setScene({
          project: false,
          typed: PROJECT_NAME.length,
          link: false,
          answer: "y",
          vault: false,
          ready: false,
        });
        await sleep(400, signal);

        setScene({
          project: true,
          typed: 0,
          link: false,
          answer: "yn",
          vault: false,
          ready: false,
        });
        await sleep(200, signal);

        const typing = animate(0, PROJECT_NAME.length, {
          duration: 1.6,
          ease: "linear",
          onUpdate: (value) => {
            setScene((current) => ({
              ...current,
              typed: Math.min(PROJECT_NAME.length, Math.floor(value)),
            }));
          },
        });
        signal.addEventListener("abort", () => typing.stop(), { once: true });
        await typing;
        if (signal.aborted) {
          return;
        }

        setScene((current) => ({ ...current, typed: PROJECT_NAME.length }));
        await sleep(250, signal);

        setScene((current) => ({ ...current, link: true, answer: "yn" }));
        await sleep(500, signal);

        setScene((current) => ({ ...current, answer: "y" }));
        await sleep(300, signal);

        setScene((current) => ({ ...current, vault: true }));
        await sleep(450, signal);

        setScene((current) => ({ ...current, ready: true }));
        await sleep(1600, signal);
      }
    };

    run().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      throw error;
    });

    return () => abort.abort();
  }, [play, shouldReduceMotion]);

  return (
    <div
      className="box-border w-[240pt] whitespace-nowrap rounded-2xl bg-background px-[16pt] py-[12pt] shadow-widget"
      aria-label="miora init. Project name VirtuGood 6500. Link this directory? [y]. Vault linked. Ready."
    >
      <p className="flex items-baseline gap-1.5 font-mono text-[12pt] font-semibold leading-normal text-ink">
        <span aria-hidden="true">❯</span>
        <span>miora init</span>
      </p>
      <div
        className="mt-2 flex flex-col gap-px font-mono text-[10pt] leading-normal text-text-secondary"
        aria-hidden="true"
      >
        <motion.p
          initial={false}
          animate={{ opacity: scene.project ? 1 : 0 }}
          transition={FADE}
        >
          Project name <span>{">"}</span> {PROJECT_NAME.slice(0, scene.typed)}
          {scene.project && scene.typed < PROJECT_NAME.length ? (
            <span
              className="caret-blink ml-px inline-block h-[0.85em] w-px translate-y-[0.08em] bg-ink"
              aria-hidden
            />
          ) : null}
        </motion.p>
        <motion.p
          initial={false}
          animate={{ opacity: scene.link ? 1 : 0 }}
          transition={FADE}
        >
          Link this directory? <span>{">"}</span>{" "}
          {scene.answer === "yn" ? "[y/n]" : "[y]"}
        </motion.p>
        <motion.p
          className="flex items-center gap-1.5"
          initial={false}
          animate={{ opacity: scene.vault ? 1 : 0 }}
          transition={FADE}
        >
          <Check size={10} className="size-2.5 shrink-0" />
          Vault linked
        </motion.p>
        <motion.p
          initial={false}
          animate={{ opacity: scene.ready ? 1 : 0 }}
          transition={FADE}
        >
          Ready.
        </motion.p>
      </div>
    </div>
  );
}
