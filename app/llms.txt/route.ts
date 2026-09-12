import {
  absoluteUrl,
  SITE_DEFINITION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site";

export function GET() {
  const home = absoluteUrl("/");
  const body = `# ${SITE_NAME}

> ${SITE_DEFINITION}

${SITE_TAGLINE}

## Status

Miora is in development. This site is an early access landing page with email signup. There is no public docs site, changelog, or pricing page yet.

## Product

Miora is self-maintaining knowledge for AI agents, built for solo software builders shipping SaaS and mobile products.

- Self-maintaining project knowledge across local and cloud agents
- Single-user workflows
- User-owned filesystem as the canonical knowledge layer
- Human-readable files first (Markdown and ordinary files)
- Agent-native: agents explore the filesystem directly

The local filesystem remains canonical. Miora Cloud holds a synchronized copy so cloud agents can reach the same Vault. Git is the default history layer. CLI and filesystem access are not designed to depend on a subscription.

## How agents reach the Vault

- Local agents: normal filesystem access, with project knowledge exposed in working directories (likely via symlinks)
- Cloud agents: Miora Cloud — ChatGPT via a Miora Plugin, Claude via a Miora Connector, other compatible agents via remote MCP

## Not in early access

Semantic search, embeddings, graph memory, team/multiplayer workflows, Slack/Linear/Figma integrations, or a polished human frontend.

## Links

- [Home](${home}): product overview and early access signup
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
