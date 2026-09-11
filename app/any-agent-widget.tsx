"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Check, Folder } from "griddy-icons";
import { animate } from "motion";
import { useAnimationFrame, useReducedMotion } from "motion/react";

const FOLDER = { x: 130, y: 120 };

const agents = [
  {
    id: "openai",
    src: "/images/icons/openai.svg",
    label: "OpenAI",
    color: "#FFFFFF",
    className: "absolute left-[12pt] top-[28pt]",
    rest: { x: 31, y: 47 },
    drift: { speed: 0.00055, phase: 0.4, amp: 7.5 },
  },
  {
    id: "claude",
    src: "/images/icons/claude.svg",
    label: "Claude",
    color: "#D97757",
    className: "absolute right-[12pt] top-[28pt]",
    rest: { x: 229, y: 47 },
    drift: { speed: 0.00047, phase: 1.7, amp: 8 },
  },
  {
    id: "cursor",
    src: "/images/icons/cursor.svg",
    label: "Cursor",
    color: "#FFFFFF",
    className: "absolute bottom-[12pt] left-1/2 -translate-x-1/2",
    rest: { x: 130, y: 209 },
    drift: { speed: 0.00062, phase: 2.9, amp: 7 },
  },
] as const;

type AgentId = (typeof agents)[number]["id"];

type Pulse = {
  progress: number;
  direction: "in" | "out";
};

const TRAVEL_DURATION = 1.5;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const HOLD_MS = 2000;
const SHIMMER_MS = 1800;
const PUSH_MS = 280;

const idleFace = {
  id: "idle",
  kind: "folder",
  label: "knowledge/",
} as const;

const statusFaces = [
  { id: "conflicts", kind: "check", label: "Conflicts resolved" },
  { id: "refs", kind: "check", label: "Stale refs updated" },
  { id: "duplicate", kind: "check", label: "Duplicate merged" },
  { id: "drift", kind: "check", label: "Drift reconciled" },
] as const;

type Face = typeof idleFace | (typeof statusFaces)[number];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

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

function driftOffset(time: number, spec: (typeof agents)[number]["drift"]) {
  return {
    x: Math.sin(time * spec.speed + spec.phase) * spec.amp,
    y: Math.cos(time * spec.speed * 0.82 + spec.phase * 1.25) * spec.amp,
  };
}

function FaceContent({ face }: { face: Face }) {
  const resolved = face.kind === "check";
  const Icon = resolved ? Check : Folder;

  return (
    <>
      <Icon
        size={21}
        className={`size-[21px] shrink-0 ${resolved ? "text-moss" : "text-text-muted"}`}
        aria-hidden="true"
      />
      <span className={`truncate ${resolved ? "text-moss" : ""}`}>{face.label}</span>
    </>
  );
}

function KnowledgeFolderRow({ play }: { play: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const [statusIndex, setStatusIndex] = useState(0);
  const idleRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idleEl = idleRef.current;
    const statusEl = statusRef.current;
    const wipeEl = wipeRef.current;

    const resetLayers = () => {
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

    resetLayers();

    if (shouldReduceMotion || !play) {
      return;
    }

    const abort = new AbortController();
    const { signal } = abort;
    const running: ReturnType<typeof animate>[] = [];
    let nextStatus = 0;

    const shimmer = async () => {
      if (!wipeEl) {
        await sleep(SHIMMER_MS, signal);
        return;
      }

      wipeEl.style.transform = "translateX(-130%)";
      wipeEl.style.opacity = "1";
      const wipe = animate(
        wipeEl,
        { transform: ["translateX(-130%)", "translateX(210%)"] },
        { duration: SHIMMER_MS / 1000, ease: "linear" },
      );
      running.push(wipe);
      await sleep(SHIMMER_MS, signal);
      wipeEl.style.opacity = "0";
      wipeEl.style.transform = "translateX(-130%)";
    };

    const pushSwap = async (
      outgoing: HTMLDivElement,
      incoming: HTMLDivElement,
    ) => {
      outgoing.style.transform = "translateY(0%)";
      incoming.style.transform = "translateY(100%)";
      const outAnim = animate(
        outgoing,
        { transform: ["translateY(0%)", "translateY(-100%)"] },
        { duration: PUSH_MS / 1000, ease: EASE_OUT },
      );
      const inAnim = animate(
        incoming,
        { transform: ["translateY(100%)", "translateY(0%)"] },
        { duration: PUSH_MS / 1000, ease: EASE_OUT },
      );
      running.push(outAnim, inAnim);
      await sleep(PUSH_MS, signal);
      outgoing.style.transform = "translateY(-100%)";
      incoming.style.transform = "translateY(0%)";
    };

    const loop = async () => {
      await sleep(HOLD_MS, signal);
      while (!signal.aborted) {
        await shimmer();
        if (idleEl && statusEl) {
          await pushSwap(idleEl, statusEl);
        }
        await sleep(HOLD_MS, signal);
        if (idleEl && statusEl) {
          await pushSwap(statusEl, idleEl);
          statusEl.style.transform = "translateY(100%)";
        }
        nextStatus = (nextStatus + 1) % statusFaces.length;
        setStatusIndex(nextStatus);
        await sleep(HOLD_MS, signal);
      }
    };

    loop().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      throw error;
    });

    return () => {
      abort.abort();
      for (const control of running) {
        control.stop();
      }
      resetLayers();
    };
  }, [play, shouldReduceMotion]);

  const status = statusFaces[statusIndex] ?? statusFaces[0];

  return (
    <div className="absolute left-1/2 top-1/2 z-20 w-[190pt] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[10px] bg-background font-mono text-[14px] text-ink shadow-[0_24px_24px_rgba(0,0,0,.25),0_55px_33px_rgba(0,0,0,.15),0_98px_39px_rgba(0,0,0,.04)]">
      <div className="relative overflow-hidden">
        <div
          ref={idleRef}
          className="flex items-center gap-2 bg-background px-4 py-3.5"
        >
          <FaceContent face={idleFace} />
        </div>
        <div
          ref={statusRef}
          className="absolute inset-0 flex items-center gap-2 bg-background px-4 py-3.5"
          style={{ transform: "translateY(100%)" }}
          aria-hidden="true"
        >
          <FaceContent face={status} />
        </div>
        <div
          ref={wipeRef}
          className="pointer-events-none absolute inset-y-0 left-0 w-[42%] opacity-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--color-moss) 38%, transparent) 50%, transparent 100%)",
            transform: "translateX(-130%)",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function AgentBadge({
  src,
  label,
  className,
  driftRef,
}: {
  src: string;
  label: string;
  className: string;
  driftRef: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <span className={className}>
      <span
        ref={driftRef}
        className="flex size-[38pt] items-center justify-center rounded-full bg-background shadow-[0_8px_16px_rgba(0,0,0,.18),0_2px_4px_rgba(0,0,0,.08)]"
      >
        <img src={src} alt="" width={28} height={28} className="size-7" />
        <span className="sr-only">{label}</span>
      </span>
    </span>
  );
}

export function AnyAgentWidget({ play }: { play: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const lineRefs = {
    openai: useRef<SVGLineElement>(null),
    claude: useRef<SVGLineElement>(null),
    cursor: useRef<SVGLineElement>(null),
  };
  const badgeRefs = {
    openai: useRef<HTMLSpanElement>(null),
    claude: useRef<HTMLSpanElement>(null),
    cursor: useRef<HTMLSpanElement>(null),
  };
  const dotRefs = {
    openai: useRef<HTMLSpanElement>(null),
    claude: useRef<HTMLSpanElement>(null),
    cursor: useRef<HTMLSpanElement>(null),
  };
  const pulseRef = useRef<Record<AgentId, Pulse>>({
    openai: { progress: 0, direction: "in" },
    claude: { progress: 0, direction: "in" },
    cursor: { progress: 0, direction: "in" },
  });
  const busyRef = useRef<Record<AgentId, boolean>>({
    openai: false,
    claude: false,
    cursor: false,
  });

  useEffect(() => {
    if (shouldReduceMotion || !play) {
      pulseRef.current = {
        openai: { progress: 0, direction: "in" },
        claude: { progress: 0, direction: "in" },
        cursor: { progress: 0, direction: "in" },
      };
      busyRef.current = { openai: false, claude: false, cursor: false };
      return;
    }

    const abort = new AbortController();
    const { signal } = abort;
    const running: ReturnType<typeof animate>[] = [];
    let lastAgent: AgentId | null = null;

    const launch = (id: AgentId, direction: "in" | "out") => {
      busyRef.current[id] = true;
      pulseRef.current[id] = { progress: 0, direction };
      const control = animate(0, 1, {
        duration: TRAVEL_DURATION,
        ease: "linear",
        onUpdate: (value) => {
          pulseRef.current[id].progress = value;
        },
        onComplete: () => {
          pulseRef.current[id].progress = 0;
          busyRef.current[id] = false;
        },
      });
      running.push(control);
    };

    const loop = async () => {
      while (!signal.aborted) {
        const available = agents
          .map((agent) => agent.id)
          .filter((id) => !busyRef.current[id] && id !== lastAgent);
        const pool =
          available.length > 0
            ? available
            : agents.map((agent) => agent.id).filter((id) => !busyRef.current[id]);

        if (pool.length > 0) {
          const id = pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
          const direction = Math.random() < 0.5 ? "in" : "out";
          lastAgent = id;
          launch(id, direction);
        }

        await sleep(randomBetween(320, 620), signal);
      }
    };

    loop().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      throw error;
    });

    return () => {
      abort.abort();
      for (const control of running) {
        control.stop();
      }
    };
  }, [play, shouldReduceMotion]);

  useAnimationFrame((time) => {
    for (const agent of agents) {
      const offset = shouldReduceMotion
        ? { x: 0, y: 0 }
        : driftOffset(time, agent.drift);
      const from = {
        x: agent.rest.x + offset.x,
        y: agent.rest.y + offset.y,
      };

      const line = lineRefs[agent.id].current;
      if (line) {
        line.setAttribute("x1", String(from.x));
        line.setAttribute("y1", String(from.y));
      }

      const badge = badgeRefs[agent.id].current;
      if (badge) {
        badge.style.transform = `translate(${offset.x}pt, ${offset.y}pt)`;
      }

      const dot = dotRefs[agent.id].current;
      if (!dot) {
        continue;
      }

      const pulse = pulseRef.current[agent.id];
      const traveling =
        play && !shouldReduceMotion && pulse.progress > 0 && pulse.progress < 1;
      const fade =
        pulse.progress < 0.08
          ? pulse.progress / 0.08
          : pulse.progress > 0.92
            ? (1 - pulse.progress) / 0.08
            : 1;

      dot.style.opacity = traveling ? String(fade) : "0";
      if (traveling) {
        const t =
          pulse.direction === "in" ? pulse.progress : 1 - pulse.progress;
        const x = from.x + (FOLDER.x - from.x) * t;
        const y = from.y + (FOLDER.y - from.y) * t;
        dot.style.left = `${x}pt`;
        dot.style.top = `${y}pt`;
      }
    }
  });

  return (
    <div
      className="relative h-[240pt] w-[260pt]"
      aria-label="OpenAI, Claude, and Cursor connected to a shared knowledge folder"
    >
      <svg
        className="pointer-events-none absolute inset-0"
        viewBox="0 0 260 240"
        fill="none"
        aria-hidden="true"
      >
        {agents.map((agent) => (
          <line
            key={agent.id}
            ref={lineRefs[agent.id]}
            x1={agent.rest.x}
            y1={agent.rest.y}
            x2={FOLDER.x}
            y2={FOLDER.y}
            stroke="white"
            strokeOpacity="0.85"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {agents.map((agent) => (
        <span
          key={`${agent.id}-dot`}
          ref={dotRefs[agent.id]}
          className="pointer-events-none absolute z-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
          style={{ backgroundColor: agent.color, left: `${agent.rest.x}pt`, top: `${agent.rest.y}pt` }}
          aria-hidden="true"
        />
      ))}

      <KnowledgeFolderRow play={play} />

      {agents.map((agent) => (
        <AgentBadge
          key={agent.id}
          src={agent.src}
          label={agent.label}
          className={`z-20 ${agent.className}`}
          driftRef={badgeRefs[agent.id]}
        />
      ))}
    </div>
  );
}
