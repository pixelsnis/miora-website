const DEFAULT_SITE_URL = "https://miora.invalid";

/** Canonical production origin for metadata, sitemap, robots, and JSON-LD. */
export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return new URL(DEFAULT_SITE_URL);
  }
  try {
    return new URL(raw.endsWith("/") ? raw.slice(0, -1) : raw);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, base).href;
}

export const SITE_NAME = "Miora";

/** Primary phrase front-loaded for SERP + GEO. */
export const SITE_TITLE =
  "Miora | Self-Maintaining Knowledge for AI Agents";

export const SITE_TAGLINE =
  "Miora aligns agents with project knowledge while you keep building.";

/**
 * Canonical SEO and structured-data definition.
 */
export const SITE_DEFINITION =
  "Miora is self-maintaining knowledge for AI agents. It keeps a user-owned filesystem of ordinary Markdown files aligned across local and cloud agents, so you stop re-explaining existing work.";

/** ~152 chars: keyword, summary, CTA. */
export const SITE_DESCRIPTION =
  "Miora is self-maintaining knowledge for AI agents: a user-owned Markdown filesystem that stays aligned across local and cloud. Sign up for early access.";

export const FEATURE_HEADING =
  "Coherent project knowledge for every agent.";

export const FEATURE_INTRO =
  "A knowledge base that isn’t maintained is worse than no knowledge base at all. Miora maintains yours quietly while you keep building.";

export const FEATURE_CARDS = [
  {
    title: "One command.",
    description:
      "Run a single command in your project’s working directory. Your project knowledge will now be autonomously maintained.",
    imageAlt:
      "Terminal linking a project working directory to a Miora Vault",
  },
  {
    title: "Any agent.",
    description:
      "Miora works with every agent on your computer. No MCP, no connector, just a single CLI tool.",
    imageAlt:
      "Local and cloud agents connecting to one shared Miora Vault",
  },
  {
    title: "It’s all markdown.",
    description:
      "The secret sauce is just a folder with markdown. No proprietary knowledge format to be trapped inside.",
    imageAlt:
      "Markdown files representing a human-readable Miora Vault",
  },
] as const;

export const OG_IMAGE = {
  url: "/images/og.webp",
  width: 1200,
  height: 630,
  alt: "Miora — self-maintaining knowledge for AI agents",
} as const;

export const ORGANIZATION_SAME_AS = [
  "https://www.threads.net/@pixelsnis",
  "https://x.com/pixelsnis",
] as const;

export const PRIVATE_PATHS = [
  "/survey",
] as const;
