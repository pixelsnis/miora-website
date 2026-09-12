"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type RefObject,
} from "react";
import Image from "next/image";
import { Check, Folder, GenerateFile } from "griddy-icons";
import { ThinkingOrb } from "thinking-orbs";
import { animate } from "motion";
import {
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { CursorFollow, CursorFollowTarget } from "./cursor-follow";
import {
  EASE_OUT,
  ignoreAbort,
  sleep,
  WipeReplace,
  type WipeReplaceHandle,
} from "./wipe-replace";

const AGENT_MS = 200;
const HERO_SHIMMER_MS = 1100;
const HERO_PUSH_MS = 240;
const MAX_WORKING = 2;
const MAX_AGENT_LIFE_MS = 3000;
const WIPE_GAP_MS = [2560, 3360] as const;

const rows = [
  { id: "agents", name: "AGENTS.md", kind: "file" },
  { id: "current", name: "current/", kind: "folder" },
  { id: "engineering", name: "engineering/", kind: "folder" },
  { id: "product", name: "product/", kind: "folder" },
  { id: "versions", name: "versions/", kind: "folder" },
] as const;

type RowId = (typeof rows)[number]["id"];

const agents = {
  openai: { src: "/images/icons/openai.svg", label: "OpenAI" },
  claude: { src: "/images/icons/claude.svg", label: "Claude" },
  cursor: { src: "/images/icons/cursor.svg", label: "Cursor" },
  gemini: { src: "/images/icons/googlegemini.svg", label: "Gemini" },
  pi: { src: "/images/icons/pi.svg", label: "Pi" },
  opencode: { src: "/images/icons/opencode.svg", label: "OpenCode" },
} as const;

type AgentId = keyof typeof agents;
type DiffMark = "+" | "−";
type RowPhase = "idle" | "busy" | "working" | "resolved";

const agentIds = Object.keys(agents) as AgentId[];
const rowIds = rows.map((row) => row.id);
const statuses = [
  "Conflicts resolved",
  "Stale refs updated",
  "Duplicate merged",
  "Drift reconciled",
] as const;

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomDiff(): DiffMark | null {
  const roll = Math.random();
  if (roll < 0.4) {
    return "+";
  }
  if (roll < 0.65) {
    return "−";
  }
  return null;
}

function afterCommit() {
  return new Promise<void>((resolve) => {
    queueMicrotask(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

const iconClassName = "size-[21px] shrink-0 text-text-muted";
const rowFaceClassName =
  "flex h-full items-center gap-1.5 bg-background py-2 pl-2 pr-4 font-mono text-sm text-ink";

type HeroRowHandle = {
  arrive: (
    agent: AgentId,
    diff: DiffMark | null,
    signal: AbortSignal,
  ) => Promise<void>;
  departAndResolve: (status: string, signal: AbortSignal) => Promise<void>;
  resolve: (status: string, signal: AbortSignal) => Promise<void>;
  restoreIdle: (signal: AbortSignal) => Promise<void>;
  expireAgent: () => void;
  reset: () => void;
};

function HeroRow({
  name,
  kind,
  handleRef,
}: {
  name: string;
  kind: "file" | "folder";
  handleRef: RefObject<HeroRowHandle | null>;
}) {
  const wipeRef = useRef<WipeReplaceHandle>(null);
  const agentRef = useRef<HTMLSpanElement>(null);
  const diffRef = useRef<HTMLSpanElement>(null);
  const runningRef = useRef<ReturnType<typeof animate>[]>([]);
  const [agent, setAgent] = useState<AgentId | null>(null);
  const [diff, setDiff] = useState<DiffMark | null>(null);
  const [status, setStatus] = useState("Conflicts resolved");

  useImperativeHandle(handleRef, () => {
    const stopAgentMotion = () => {
      for (const control of runningRef.current) {
        control.stop();
      }
      runningRef.current = [];
    };

    const hideAgentChrome = () => {
      const agentEl = agentRef.current;
      const diffEl = diffRef.current;
      if (agentEl) {
        agentEl.style.opacity = "0";
        agentEl.style.transform = "translateX(8px)";
      }
      if (diffEl) {
        diffEl.style.opacity = "0";
      }
    };

    const fadeAgent = async (visible: boolean, signal: AbortSignal) => {
      const agentEl = agentRef.current;
      const diffEl = diffRef.current;
      const from = visible ? "translateX(8px)" : "translateX(0px)";
      const to = visible ? "translateX(0px)" : "translateX(8px)";
      const opacity = visible ? [0, 1] : [1, 0];

      if (agentEl) {
        const motionControl = animate(
          agentEl,
          { transform: [from, to], opacity },
          { duration: AGENT_MS / 1000, ease: EASE_OUT },
        );
        runningRef.current.push(motionControl);
      }

      if (diffEl) {
        const diffMotion = animate(
          diffEl,
          { opacity },
          { duration: AGENT_MS / 1000, ease: EASE_OUT },
        );
        runningRef.current.push(diffMotion);
      }

      try {
        await sleep(AGENT_MS, signal);
      } finally {
        for (const control of runningRef.current) {
          control.stop();
        }
        runningRef.current = [];
      }
      if (visible) {
        if (agentEl) {
          agentEl.style.opacity = "1";
          agentEl.style.transform = "translateX(0px)";
        }
        if (diffEl) {
          diffEl.style.opacity = "1";
        }
        return;
      }

      hideAgentChrome();
    };

    return {
      async arrive(nextAgent, nextDiff, signal) {
        setAgent(nextAgent);
        setDiff(nextDiff);
        await afterCommit();
        if (signal.aborted) {
          return;
        }
        hideAgentChrome();
        await fadeAgent(true, signal);
      },
      async departAndResolve(nextStatus, signal) {
        setStatus(nextStatus);
        await afterCommit();
        if (signal.aborted) {
          return;
        }
        await fadeAgent(false, signal);
        setAgent(null);
        setDiff(null);
        await afterCommit();
        if (signal.aborted) {
          return;
        }
        await wipeRef.current?.wipeAndShowStatus(signal);
      },
      async resolve(nextStatus, signal) {
        setStatus(nextStatus);
        await afterCommit();
        if (signal.aborted) {
          return;
        }
      },
      async restoreIdle(signal) {
        await wipeRef.current?.restoreIdle(signal);
      },
      expireAgent() {
        stopAgentMotion();
        setAgent(null);
        setDiff(null);
        hideAgentChrome();
      },
      reset() {
        stopAgentMotion();
        wipeRef.current?.reset();
        setAgent(null);
        setDiff(null);
        hideAgentChrome();
      },
    };
  });

  const RowIcon = kind === "file" ? GenerateFile : Folder;
  const agentMeta = agent ? agents[agent] : null;

  return (
    <WipeReplace
      ref={wipeRef}
      className="h-[37px]"
      idleClassName={rowFaceClassName}
      statusClassName={rowFaceClassName}
      shimmerMs={HERO_SHIMMER_MS}
      pushMs={HERO_PUSH_MS}
      idle={
        <>
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <RowIcon size={21} className={iconClassName} aria-hidden="true" />
            <span className="truncate">{name}</span>
            <span
              ref={diffRef}
              className="w-3 shrink-0 text-center font-mono text-xs leading-none"
              style={{
                opacity: 0,
                color: diff === "−" ? "var(--color-clay)" : "var(--color-moss)",
              }}
              aria-hidden="true"
            >
              {diff ?? ""}
            </span>
          </div>
          <span
            ref={agentRef}
            className="flex size-[14pt] shrink-0 items-center justify-center"
            style={{ opacity: 0, transform: "translateX(8px)" }}
            aria-hidden="true"
          >
            {agentMeta ? (
              <img
                src={agentMeta.src}
                alt=""
                width={19}
                height={19}
                className="size-[14pt]"
              />
            ) : null}
          </span>
        </>
      }
      status={
        <>
          <Check
            size={21}
            className="size-[21px] shrink-0 text-moss"
            aria-hidden="true"
          />
          <span className="truncate text-moss">{status}</span>
        </>
      }
    />
  );
}

function useDocumentVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => {
      setVisible(document.visibilityState === "visible");
    };

    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return visible;
}

export function HeroIllustration() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const shouldReduceMotion = useReducedMotion();
  const documentVisible = useDocumentVisible();
  const play = Boolean(inView && documentVisible && !shouldReduceMotion);

  const agentsRow = useRef<HeroRowHandle>(null);
  const currentRow = useRef<HeroRowHandle>(null);
  const engineeringRow = useRef<HeroRowHandle>(null);
  const productRow = useRef<HeroRowHandle>(null);
  const versionsRow = useRef<HeroRowHandle>(null);

  const rowRefs: Record<RowId, RefObject<HeroRowHandle | null>> = {
    agents: agentsRow,
    current: currentRow,
    engineering: engineeringRow,
    product: productRow,
    versions: versionsRow,
  };

  useEffect(() => {
    const resetAll = () => {
      for (const row of rows) {
        rowRefs[row.id].current?.reset();
      }
    };

    resetAll();

    if (!play) {
      return;
    }

    const abort = new AbortController();
    const { signal } = abort;

    const run = (task: Promise<void> | undefined) => {
      task?.catch(ignoreAbort);
    };

    const phase: Record<RowId, RowPhase> = {
      agents: "idle",
      current: "idle",
      engineering: "idle",
      product: "idle",
      versions: "idle",
    };
    const until: Record<RowId, number> = {
      agents: 0,
      current: 0,
      engineering: 0,
      product: 0,
      versions: 0,
    };
    const occupant: Partial<Record<RowId, AgentId>> = {};
    const agentTimers = new Map<RowId, number>();
    let wipeInFlight = false;
    let nextWipeAt = 0;

    const clearAgentTimer = (id: RowId) => {
      const timer = agentTimers.get(id);
      if (timer !== undefined) {
        window.clearTimeout(timer);
        agentTimers.delete(id);
      }
    };

    const workingCount = () =>
      rowIds.filter((id) => Boolean(occupant[id])).length;

    const freeAgents = () => {
      const used = new Set(Object.values(occupant));
      return agentIds.filter((id) => !used.has(id));
    };

    const spawn = async () => {
      const idle = rowIds.filter((id) => phase[id] === "idle");
      const availableAgents = freeAgents();
      if (
        idle.length === 0 ||
        availableAgents.length === 0 ||
        workingCount() >= MAX_WORKING
      ) {
        return;
      }

      const id = randomItem(idle);
      const agent = randomItem(availableAgents);
      phase[id] = "busy";
      occupant[id] = agent;
      agentTimers.set(
        id,
        window.setTimeout(() => {
          agentTimers.delete(id);
          rowRefs[id].current?.expireAgent();
        }, MAX_AGENT_LIFE_MS),
      );
      await rowRefs[id].current?.arrive(agent, randomDiff(), signal);
      if (signal.aborted) {
        clearAgentTimer(id);
        return;
      }
      phase[id] = "working";
      until[id] = performance.now() + randomBetween(1440, 2560);
    };

    const resolveWorking = async (id: RowId) => {
      wipeInFlight = true;
      phase[id] = "busy";
      clearAgentTimer(id);
      delete occupant[id];
      nextWipeAt = performance.now() + randomBetween(WIPE_GAP_MS[0], WIPE_GAP_MS[1]);
      try {
        await rowRefs[id].current?.departAndResolve(randomItem(statuses), signal);
      } finally {
        wipeInFlight = false;
      }
      if (signal.aborted) {
        return;
      }
      phase[id] = "resolved";
      until[id] = performance.now() + randomBetween(1600, 2600);
    };

    const restore = async (id: RowId) => {
      phase[id] = "busy";
      await rowRefs[id].current?.restoreIdle(signal);
      if (signal.aborted) {
        return;
      }
      phase[id] = "idle";
      until[id] = 0;
    };

    const loop = async () => {
      const opener = randomItem(rowIds);
      phase[opener] = "busy";
      run(
        (async () => {
          wipeInFlight = true;
          nextWipeAt =
            performance.now() + randomBetween(WIPE_GAP_MS[0], WIPE_GAP_MS[1]);
          try {
            await rowRefs[opener].current?.resolve("Conflicts resolved", signal);
          } finally {
            wipeInFlight = false;
          }
          if (signal.aborted) {
            return;
          }
          phase[opener] = "resolved";
          until[opener] = performance.now() + randomBetween(1800, 2800);
        })(),
      );

      run(
        (async () => {
          await sleep(500, signal);
          await spawn();
          await sleep(700, signal);
          await spawn();
        })(),
      );

      while (!signal.aborted) {
        await sleep(randomBetween(400, 700), signal);
        const now = performance.now();
        const dueWorking = rowIds.filter(
          (id) => phase[id] === "working" && now >= until[id],
        );
        const dueResolved = rowIds.filter(
          (id) => phase[id] === "resolved" && now >= until[id],
        );

        if (
          dueWorking.length > 0 &&
          !wipeInFlight &&
          now >= nextWipeAt
        ) {
          run(resolveWorking(randomItem(dueWorking)));
        }
        if (dueResolved.length > 0) {
          run(restore(randomItem(dueResolved)));
        }
        if (Math.random() < 0.4) {
          run(spawn());
        }
      }
    };

    loop().catch(ignoreAbort);

    return () => {
      abort.abort();
      for (const id of rowIds) {
        clearAgentTimer(id);
      }
      resetAll();
    };
  }, [play]);

  return (
    <CursorFollow
      ref={rootRef}
      className="hero-art relative h-[clamp(15rem,38vh,29.6875rem)] min-h-0 w-full shrink select-none overflow-hidden bg-surface-dark"
      aria-label="Several AI agents coordinate updates to a shared project knowledge folder"
    >
      <div className="absolute -inset-3">
        <Image
          src="/images/landing/hero.webp"
          alt=""
          fill
          priority
          draggable={false}
          sizes="(max-width: 1280px) 100vw, 1136px"
          className="material-drift object-cover"
        />
      </div>

      <div className="knowledge-card absolute left-1/2 top-1/2 w-[270px] -translate-x-1/2 -translate-y-1/2">
        <CursorFollowTarget className="overflow-hidden rounded-[10px] bg-background pt-0.5 shadow-widget">
          <div className="flex items-center gap-1.5 p-2 font-mono text-sm text-ink">
            <Folder size={21} className={iconClassName} aria-hidden="true" />
            <span>knowledge/</span>
          </div>
          <div className="pl-3.5">
            {rows.map((row) => (
              <HeroRow
                key={row.id}
                name={row.name}
                kind={row.kind}
                handleRef={rowRefs[row.id]}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 border-t border-line-subtle p-2 text-xs text-moss">
            <motion.span
              initial={shouldReduceMotion ? false : { transform: "scale(0.9)", opacity: 0 }}
              animate={{ transform: "scale(1)", opacity: 1 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="inline-flex size-5 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <ThinkingOrb
                state="composing"
                size={20}
                className="shrink-0"
                aria-hidden="true"
              />
            </motion.span>
            <span>Auto</span>
          </div>
        </CursorFollowTarget>
      </div>
    </CursorFollow>
  );
}
