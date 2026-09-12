# Miora

Miora is self-maintaining project knowledge for AI agents. It keeps a user-owned filesystem of ordinary Markdown files aligned across local and cloud agents, so you spend less time re-explaining existing work.

The public site presents the product and collects early-access responses. It is built with Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/ui. PostHog provides a minimal anonymous acquisition funnel; Notion stores landing-page signups and survey responses.

## Requirements

- [Bun](https://bun.sh/) 1.3 or later (the repository pins Bun 1.3.14)
- Node.js is supported by Next.js, but Bun is the repository's package manager
- A Notion integration and data source for the early-access flow
- A PostHog project if analytics are enabled

## Local development

Install dependencies and create a local environment file:

```bash
bun install
cp .env.example .env
```

Fill in the values in `.env`, then start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The main landing page is at `/`; the no-index early-access survey is at `/survey`.

## Environment variables

`.env.example` contains the variables used by the application:

| Variable | Used for |
| --- | --- |
| `NOTION_API_KEY` | Server-only authentication for Notion API requests |
| `NOTION_DATA_SOURCE_ID` | Notion data source receiving signups and survey responses |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | Public PostHog project token for browser analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog ingestion host, such as `https://us.i.posthog.com` |
| `SURVEY_RESUME_SECRET` | Server-only secret used to sign survey resume tokens |
| `NEXT_PUBLIC_SITE_URL` | Optional public HTTPS origin for canonical and social metadata |

Keep `NOTION_API_KEY` and `SURVEY_RESUME_SECRET` private. `SURVEY_RESUME_SECRET` must remain stable across deployments; changing it invalidates existing survey links. Resume tokens expire after 30 days. A missing, invalid, or expired token loads a blank survey, and raw `email` query parameters are not trusted.

`NEXT_PUBLIC_SITE_URL` overrides the canonical URL used by metadata, Open Graph URLs, `sitemap.xml`, `robots.txt`, JSON-LD, and `llms.txt`. When it is unset or invalid, the application falls back to `https://miora.heiten.co`.

## Notion setup

Create a data source with the required `Name` (title) and `Email` (email) properties, plus the eight rich-text answer properties defined in [docs/miora-early-access-survey.md](docs/miora-early-access-survey.md). Share the data source with the Notion integration associated with `NOTION_API_KEY`.

The server validates and normalizes every response before writing it. Landing-page signups create or update the respondent's incomplete row; completed landing-origin rows are never overwritten. Direct survey submissions create a new row.

## Analytics and privacy

PostHog tracking is intentionally limited. The client uses cookieless tracking with in-memory persistence, disables autocapture and session recording, and never identifies visitors or creates person profiles. Events include only allowlisted attribution and funnel fields; they do not include names, email addresses, survey answers, Notion IDs, or resume tokens. Configure the matching PostHog project for cookieless tracking before production deployment.

See [docs/analytics.md](docs/analytics.md) for the event and privacy contract.

## Project structure

```text
app/
  (site)/       Landing page and early-access survey routes
  _actions.ts   Server Actions for signup, resume loading, and survey submission
components/     Shared UI and site components
lib/site.ts     Site metadata, canonical URL, and SEO constants
lib/early-access/
                Survey validation, resume tokens, and Notion persistence
docs/           Survey storage schema and analytics contract
public/         Static assets and social preview images
```

## Commands

```bash
bun run dev      # Start the development server
bun run build    # Create a production build
bun run start    # Serve the production build
bun run lint     # Run ESLint
```

## Deployment

Build the application with `bun run build` and run it with `bun run start`, or deploy to a Next.js-compatible host such as [Vercel](https://vercel.com/). Define the required variables from `.env.example` in the hosting provider; set `NEXT_PUBLIC_SITE_URL` when the public origin differs from the deployment URL.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Bun documentation](https://bun.sh/docs)
- [PostHog analytics contract](docs/analytics.md)
- [Early-access survey schema](docs/miora-early-access-survey.md)
