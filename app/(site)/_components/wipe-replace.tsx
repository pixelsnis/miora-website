"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { animate } from "motion";

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const SHIMMER_MS = 1800;
export const PUSH_MS = 280;

const WIPE_STYLE: CSSProperties = {
  background:
    "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--color-moss) 38%, transparent) 50%, transparent 100%)",
  transform: "translateX(-130%)",
};

export function sleep(ms: number, signal: AbortSignal) {
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

export function ignoreAbort(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") {
    return;
  }

  throw error;
}

export type WipeReplaceHandle = {
  wipeAndShowStatus: (signal: AbortSignal) => Promise<void>;
  restoreIdle: (signal: AbortSignal) => Promise<void>;
  reset: () => void;
};

type WipeReplaceProps = {
  idle: ReactNode;
  status: ReactNode;
  className?: string;
  idleClassName?: string;
  statusClassName?: string;
  shimmerMs?: number;
  pushMs?: number;
};

export const WipeReplace = forwardRef<WipeReplaceHandle, WipeReplaceProps>(
  function WipeReplace(
    {
      idle,
      status,
      className,
      idleClassName,
      statusClassName,
      shimmerMs = SHIMMER_MS,
      pushMs = PUSH_MS,
    },
    ref,
  ) {
    const idleRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);
    const wipeRef = useRef<HTMLDivElement>(null);
    const runningRef = useRef<ReturnType<typeof animate>[]>([]);
    const shimmerMsRef = useRef(shimmerMs);
    const pushMsRef = useRef(pushMs);
    shimmerMsRef.current = shimmerMs;
    pushMsRef.current = pushMs;

    useImperativeHandle(ref, () => {
      const resetLayers = () => {
        for (const control of runningRef.current) {
          control.stop();
        }
        runningRef.current = [];

        const idleEl = idleRef.current;
        const statusEl = statusRef.current;
        const wipeEl = wipeRef.current;

        if (idleEl) {
          idleEl.style.transform = "translateY(0%)";
        }
        if (statusEl) {
          statusEl.style.transform = "translateY(100%)";
        }
        if (wipeEl) {
          wipeEl.style.transform = "translateX(-130%)";
          wipeEl.style.opacity = "0";
        }
      };

      const pushSwap = async (
        outgoing: HTMLDivElement,
        incoming: HTMLDivElement,
        signal: AbortSignal,
      ) => {
        outgoing.style.transform = "translateY(0%)";
        incoming.style.transform = "translateY(100%)";
        const duration = pushMsRef.current / 1000;
        const outAnim = animate(
          outgoing,
          { transform: ["translateY(0%)", "translateY(-100%)"] },
          { duration, ease: EASE_OUT },
        );
        const inAnim = animate(
          incoming,
          { transform: ["translateY(100%)", "translateY(0%)"] },
          { duration, ease: EASE_OUT },
        );
        runningRef.current.push(outAnim, inAnim);
        try {
          await sleep(pushMsRef.current, signal);
        } finally {
          outAnim.stop();
          inAnim.stop();
        }
        outgoing.style.transform = "translateY(-100%)";
        incoming.style.transform = "translateY(0%)";
      };

      return {
        async wipeAndShowStatus(signal) {
          const idleEl = idleRef.current;
          const statusEl = statusRef.current;
          const wipeEl = wipeRef.current;

          if (wipeEl) {
            wipeEl.style.transform = "translateX(-130%)";
            wipeEl.style.opacity = "1";
            const wipe = animate(
              wipeEl,
              { transform: ["translateX(-130%)", "translateX(210%)"] },
              { duration: shimmerMsRef.current / 1000, ease: "linear" },
            );
            runningRef.current.push(wipe);
            try {
              await sleep(shimmerMsRef.current, signal);
            } finally {
              wipe.stop();
            }
            wipeEl.style.opacity = "0";
            wipeEl.style.transform = "translateX(-130%)";
          } else {
            await sleep(shimmerMsRef.current, signal);
          }

          if (idleEl && statusEl) {
            await pushSwap(idleEl, statusEl, signal);
          }
        },
        async restoreIdle(signal) {
          const idleEl = idleRef.current;
          const statusEl = statusRef.current;
          if (!idleEl || !statusEl) {
            return;
          }

          await pushSwap(statusEl, idleEl, signal);
          statusEl.style.transform = "translateY(100%)";
        },
        reset: resetLayers,
      };
    });

    return (
      <div className={["relative overflow-hidden", className].filter(Boolean).join(" ")}>
        <div ref={idleRef} className={idleClassName}>
          {idle}
        </div>
        <div
          ref={statusRef}
          className={["absolute inset-0", statusClassName]
            .filter(Boolean)
            .join(" ")}
          style={{ transform: "translateY(100%)" }}
          aria-hidden="true"
        >
          {status}
        </div>
        <div
          ref={wipeRef}
          className="pointer-events-none absolute inset-y-0 left-0 w-[42%] opacity-0"
          style={WIPE_STYLE}
          aria-hidden="true"
        />
      </div>
    );
  },
);
