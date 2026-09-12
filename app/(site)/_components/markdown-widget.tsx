"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const FADE = { duration: 0.18, ease: EASE_OUT };
const LAYOUT = { duration: 0.22, ease: EASE_OUT };

const tabs = ["product-principles.md", "rfc-014.md", "onboarding.md"] as const;

type BodyLine = {
  id: string;
  pills: [number, number];
};

type Section = {
  id: string;
  heading: "##" | "###";
  title: [number, number];
  body: BodyLine[];
};

const initialSections: Section[] = [
  {
    id: "s1",
    heading: "##",
    title: [44, 26],
    body: [
      { id: "s1-b1", pills: [58, 0] },
      { id: "s1-b2", pills: [31, 22] },
    ],
  },
  {
    id: "s2",
    heading: "###",
    title: [36, 0],
    body: [
      { id: "s2-b1", pills: [48, 18] },
      { id: "s2-b2", pills: [34, 0] },
    ],
  },
  {
    id: "s3",
    heading: "##",
    title: [22, 40],
    body: [
      { id: "s3-b1", pills: [40, 0] },
      { id: "s3-b2", pills: [28, 24] },
    ],
  },
];

let nextId = 1;

function randomPills(): [number, number] {
  const first = 18 + Math.round(Math.random() * 40);
  const second = Math.random() < 0.55 ? 14 + Math.round(Math.random() * 28) : 0;
  return [first, second];
}

function mutate(sections: Section[]): Section[] {
  const next = sections.map((section) => ({
    ...section,
    body: [...section.body],
  }));
  const section = next[Math.floor(Math.random() * next.length)];
  if (!section) {
    return sections;
  }

  const roll = Math.random();

  if (roll < 0.34 && section.body.length < 3) {
    const index = Math.floor(Math.random() * (section.body.length + 1));
    section.body.splice(index, 0, {
      id: `b${nextId}`,
      pills: randomPills(),
    });
    nextId += 1;
    return next;
  }

  if (roll < 0.6 && section.body.length > 2) {
    section.body.splice(Math.floor(Math.random() * section.body.length), 1);
    return next;
  }

  const line = section.body[Math.floor(Math.random() * section.body.length)];
  if (!line) {
    return sections;
  }
  line.pills = randomPills();
  return next;
}

function GhostPill({ width }: { width: number }) {
  return (
    <motion.span
      className="block h-2 shrink-0 rounded-full bg-surface-2"
      initial={false}
      animate={{
        width: `${width}%`,
        opacity: width > 0 ? 1 : 0,
      }}
      transition={LAYOUT}
    />
  );
}

function PillRow({ pills }: { pills: [number, number] }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      <GhostPill width={pills[0]} />
      <GhostPill width={pills[1]} />
    </div>
  );
}

export function MarkdownWidget({ play }: { play: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const [sections, setSections] = useState(initialSections);

  useEffect(() => {
    if (shouldReduceMotion || !play) {
      const resetId = window.setTimeout(() => setSections(initialSections), 0);
      return () => window.clearTimeout(resetId);
    }

    const id = window.setInterval(() => {
      setSections((current) => mutate(current));
    }, 880);

    return () => window.clearInterval(id);
  }, [play, shouldReduceMotion]);

  return (
    <div
      className="relative w-[240pt] overflow-hidden rounded-[10px] bg-background pt-0.5 shadow-[0_24px_24px_rgba(0,0,0,.25),0_55px_33px_rgba(0,0,0,.15),0_98px_39px_rgba(0,0,0,.04)]"
      aria-label="Markdown files product-principles.md, rfc-014.md, and onboarding.md"
    >
      <div className="flex border-b border-line-subtle px-2">
        {tabs.map((name, index) => (
          <span
            key={name}
            className={`min-w-0 flex-1 truncate px-1.5 py-2 text-center font-mono text-[10px] leading-none ${
              index === 0 ? "font-semibold text-ink" : "text-text-muted"
            }`}
          >
            {name}
          </span>
        ))}
      </div>

      <div className="relative h-[138pt]">
        <div className="flex flex-col gap-3 px-4 py-3 font-mono text-[12px] text-text-muted">
          {sections.map((section) => (
            <div key={section.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 shrink-0">{section.heading}</span>
                <PillRow pills={section.title} />
              </div>
              <div className="flex flex-col gap-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {section.body.map((line) => (
                    <motion.div
                      key={line.id}
                      layout
                      className="flex items-center"
                      initial={shouldReduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ ...FADE, layout: LAYOUT }}
                    >
                      <PillRow pills={line.pills} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background to-transparent" />
      </div>
    </div>
  );
}
