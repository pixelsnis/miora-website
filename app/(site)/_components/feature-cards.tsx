"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ConnectivityTenancy, FileText, Terminal } from "griddy-icons";
import { useInView } from "motion/react";
import { CursorFollow, CursorFollowTarget } from "./cursor-follow";
import { FEATURE_CARDS, FEATURE_HEADING, FEATURE_INTRO } from "@/lib/site";
import { AnyAgentWidget } from "./any-agent-widget";
import { MarkdownWidget } from "./markdown-widget";
import { OneCommandWidget } from "./one-command-widget";
import { Reveal } from "./reveal";
import { ViewThatFits } from "./view-that-fits";

type FeatureCard = {
  image: string;
  icon: typeof Terminal;
  title: string;
  description: string;
  imageAlt: string;
  widget?: "one-command" | "any-agent" | "markdown";
};

const featureCards: FeatureCard[] = [
  {
    image: "/images/landing/feature-cards/card-01.webp",
    icon: Terminal,
    widget: "one-command",
    ...FEATURE_CARDS[0],
  },
  {
    image: "/images/landing/feature-cards/card-03.webp",
    icon: ConnectivityTenancy,
    widget: "any-agent",
    ...FEATURE_CARDS[1],
  },
  {
    image: "/images/landing/feature-cards/card-02.webp",
    icon: FileText,
    widget: "markdown",
    ...FEATURE_CARDS[2],
  },
];

function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function FeatureCardItem({
  card,
  index,
}: {
  card: FeatureCard;
  index: number;
}) {
  const Icon = card.icon;
  const mediaRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mediaRef, { amount: 0.45 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);
  const inspecting = hovered || focused || tapped;
  const play = Boolean(card.widget) && inView && inspecting;

  useEffect(() => {
    if (!tapped) {
      return;
    }

    const close = (event: PointerEvent) => {
      const media = mediaRef.current;
      if (media && !media.contains(event.target as Node)) {
        setTapped(false);
      }
    };

    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [tapped]);

  return (
    <article className="flex min-w-0 flex-col gap-4">
      <div
        ref={mediaRef}
        className="feature-media relative aspect-[1104/810] w-full select-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
        data-inspecting={inspecting ? "true" : "false"}
        tabIndex={0}
        role="group"
        aria-label={`${card.title} preview`}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") {
            setHovered(true);
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") {
            setHovered(false);
          }
        }}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            setFocused(true);
          }
        }}
        onBlur={() => setFocused(false)}
        onClick={() => {
          if (!finePointer()) {
            setTapped((current) => !current);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setTapped((current) => !current);
          }
        }}
      >
        <Image
          src={card.image}
          alt={card.imageAlt}
          fill
          draggable={false}
          sizes="(min-width: 1280px) 368px, (min-width: 768px) calc((100vw - 96px) / 3), calc(100vw - 32px)"
          className="material-drift object-cover"
          style={{ animationDelay: `${index * -10}s` }}
        />
        <div className="feature-veil pointer-events-none absolute inset-0" />
        {card.widget ? (
          <CursorFollow className="absolute inset-0">
            <CursorFollowTarget className="absolute inset-0">
              <ViewThatFits
                className="feature-widget pointer-events-none absolute inset-0"
                maxWidthFraction={0.7}
              >
                {card.widget === "one-command" ? (
                  <OneCommandWidget play={play} />
                ) : null}
                {card.widget === "any-agent" ? (
                  <AnyAgentWidget play={play} />
                ) : null}
                {card.widget === "markdown" ? (
                  <MarkdownWidget play={play} />
                ) : null}
              </ViewThatFits>
            </CursorFollowTarget>
          </CursorFollow>
        ) : null}
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <Icon size={24} className="size-6 text-ink" aria-hidden="true" />
        <h3 className="text-base font-semibold leading-[normal] tracking-[-0.35px] text-ink sm:text-sm">
          {card.title}
        </h3>
        <p className="text-sm leading-[1.5] text-text-secondary sm:text-xs">
          {card.description}
        </p>
      </div>
    </article>
  );
}

export function FeatureCards() {
  return (
    <section
      className="mx-auto flex min-h-[75vh] w-full max-w-[1280px] flex-col justify-center gap-8 bg-background px-4 py-16 sm:px-8 md:py-20 lg:px-[72px] lg:py-0"
      aria-labelledby="feature-heading"
    >
      <Reveal className="flex w-full max-w-[480px] flex-col items-start gap-2">
        <h2
          id="feature-heading"
          className="text-h2 font-semibold text-ink"
        >
          {FEATURE_HEADING}
        </h2>
        <p className="text-base leading-[1.5] text-text-secondary sm:text-sm">
          {FEATURE_INTRO}
        </p>
      </Reveal>

      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3 md:gap-4">
        {featureCards.map((card, index) => (
          <Reveal key={card.title} delay={0.06 * index}>
            <FeatureCardItem card={card} index={index} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
