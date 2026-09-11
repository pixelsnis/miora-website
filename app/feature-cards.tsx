"use client";

import { useRef } from "react";
import Image from "next/image";
import { ConnectivityTenancy, FileText, Terminal } from "griddy-icons";
import { useInView } from "motion/react";
import { AnyAgentWidget } from "./any-agent-widget";
import { MarkdownWidget } from "./markdown-widget";
import { OneCommandWidget } from "./one-command-widget";
import { ViewThatFits } from "./view-that-fits";

type FeatureCard = {
  image: string;
  icon: typeof Terminal;
  title: string;
  description: string;
  widget?: "one-command" | "any-agent" | "markdown";
};

const featureCards: FeatureCard[] = [
  {
    image: "/images/landing/feature-cards/card-01.webp",
    icon: Terminal,
    title: "One command.",
    widget: "one-command",
    description:
      "Run a single command in your project’s working directory. Your project knowledge will now be autonomously maintained.",
  },
  {
    image: "/images/landing/feature-cards/card-03.webp",
    icon: ConnectivityTenancy,
    title: "Any agent.",
    widget: "any-agent",
    description:
      "Miora works with every agent on your computer. No MCP, no connector, just a single CLI tool.",
  },
  {
    image: "/images/landing/feature-cards/card-02.webp",
    icon: FileText,
    title: "It’s all markdown.",
    widget: "markdown",
    description:
      "The secret sauce is just a folder with markdown. No proprietary knowledge format to be trapped inside.",
  },
];

function FeatureCardItem({ card }: { card: FeatureCard }) {
  const Icon = card.icon;
  const mediaRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mediaRef, { amount: "all", once: true });
  const play = Boolean(card.widget) && inView;

  return (
    <article className="flex min-w-0 flex-col gap-4">
      <div
        ref={mediaRef}
        className="relative aspect-[1104/810] w-full select-none overflow-hidden"
      >
        <Image
          src={card.image}
          alt=""
          fill
          draggable={false}
          sizes="(min-width: 1280px) 368px, (min-width: 768px) calc((100vw - 96px) / 3), calc(100vw - 32px)"
          className="object-cover"
        />
        {card.widget === "one-command" ? (
          <ViewThatFits className="absolute inset-0" maxWidthFraction={0.7}>
            <OneCommandWidget play={play} />
          </ViewThatFits>
        ) : null}
        {card.widget === "any-agent" ? (
          <ViewThatFits className="absolute inset-0" maxWidthFraction={0.7}>
            <AnyAgentWidget play={play} />
          </ViewThatFits>
        ) : null}
        {card.widget === "markdown" ? (
          <ViewThatFits className="absolute inset-0" maxWidthFraction={0.7}>
            <MarkdownWidget play={play} />
          </ViewThatFits>
        ) : null}
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <Icon size={24} className="size-6 text-ink" aria-hidden="true" />
        <h3 className="text-[14px] font-semibold leading-[normal] tracking-[-0.35px] text-ink">
          {card.title}
        </h3>
        <p className="text-[12px] leading-[1.5] text-text-secondary">
          {card.description}
        </p>
      </div>
    </article>
  );
}

export function FeatureCards() {
  return (
    <section
      className="mx-auto flex min-h-0 w-full max-w-[1280px] flex-col justify-center gap-8 bg-background px-4 py-16 sm:px-8 md:min-h-[800px] md:py-20 lg:px-[72px] lg:py-0"
      aria-labelledby="feature-heading"
    >
      <div className="flex w-full max-w-[480px] flex-col items-start gap-2">
        <h2
          id="feature-heading"
          className="text-h2 font-semibold text-ink"
        >
          Coherent project knowledge for every agent.
        </h2>
        <p className="text-[14px] leading-[1.5] text-text-secondary">
          A knowledge base that isn’t maintained is worse than no knowledge base
          at all. Miora maintains yours quietly while you keep building.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3 md:gap-4">
        {featureCards.map((card) => (
          <FeatureCardItem key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}
