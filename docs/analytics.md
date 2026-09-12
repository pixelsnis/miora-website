# Miora analytics

Miora uses PostHog for a minimal, anonymous acquisition funnel. The production
deployment must define:

```text
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=ph_project_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Enable cookieless tracking in the matching US PostHog project before deploying.
The client uses memory persistence, disables autocapture and session recording,
and never identifies visitors or creates person profiles.

## Events

The primary conversion is `early_access_signup_succeeded`. Survey completion is
a secondary quality signal. Event names and custom properties are defined in
`lib/analytics/client.ts`; all custom events include `schema_version: 1`.

The analytics layer sends only allowlisted UTM values, referring domain, landing
path, form location, survey origin, safe failure categories, and invalid survey
section identifiers. It never sends email, name, survey answers, Notion IDs, or
resume tokens. Query strings and fragments are removed from captured URLs before
events leave the browser.

Attribution is kept in memory for the current SPA visit. Returning visitors may
start a new anonymous journey.
