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
 * Standalone 25–50 word definition. Must match visible homepage copy.
 */
export const SITE_DEFINITION =
  "Miora is self-maintaining knowledge for AI agents. It keeps a user-owned filesystem of ordinary Markdown files aligned across local and cloud agents, so you stop re-explaining existing work.";

/** ~152 chars: keyword, summary, CTA. */
export const SITE_DESCRIPTION =
  "Miora is self-maintaining knowledge for AI agents: a user-owned Markdown filesystem that stays aligned across local and cloud. Sign up for early access.";

export const FEATURE_HEADING =
  "Self-maintaining knowledge for every agent.";

export const FEATURE_INTRO =
  "A knowledge base that isn’t maintained is worse than no knowledge base at all. Miora keeps yours self-maintaining across local and cloud agents while you keep building.";

export const FEATURE_CARDS = [
  {
    title: "One command.",
    description:
      "Link a project working directory to your Vault. Project knowledge then stays self-maintaining as ordinary files your agents can explore.",
    imageAlt:
      "Terminal linking a project working directory to a Miora Vault",
  },
  {
    title: "Any agent.",
    description:
      "Local agents use the filesystem. Cloud agents reach the same self-maintaining Vault through Miora Cloud — ChatGPT, Claude, and other MCP-compatible tools.",
    imageAlt:
      "Local and cloud agents connecting to one shared Miora Vault",
  },
  {
    title: "It’s all markdown.",
    description:
      "Knowledge is Markdown and normal files on disk. Open them in any editor, Obsidian, or Finder. Leave anytime — no proprietary knowledge format.",
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
  "/footer-design",
  "/footer-1-variants",
] as const;
