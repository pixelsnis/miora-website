# Miora website design

Status: visual and interaction specification

This document captures the current landing-page direction for Miora. It describes visual intent, composition, animation, and interaction behavior. Exact implementation details remain open and should be decided during design refinement.

## Overall direction

Miora should feel like quiet infrastructure for people who build with AI agents. The page is restrained, spacious, and editorial rather than busy or conventionally SaaS-like.

The visual language follows the Natural reference in its use of:

- A warm near-white canvas
- Generous vertical whitespace
- Small supporting labels
- Restrained typography
- Pale, lightly framed surfaces
- Abstract natural-material imagery
- Small product widgets embedded within larger image compositions

Miora’s version should make that language specific to project knowledge: folders, markdown files, agent activity, diffs, and quiet background maintenance.

The page should feel like a sequence of calm scenes rather than a collection of UI panels. Most of the page remains monochrome and quiet; moss, clay, violet, dusty blue, and cool dark tones appear primarily inside the imagery and small activity signals.

## Fixed page structure

The current Figma frame establishes the page structure:

1. Minimal navigation
2. Hero statement, early-access signup, and fixed hero illustration
3. Knowledge section with three feature cards
4. Centered “Coming soon.” signup section
5. Full-width final image panel
6. Footer deferred for a later design pass

The hero, layout, and section order are fixed. The illustrations inside the three feature cards remain open to refinement within the directions below.

## Navigation

The navigation is small and visually quiet:

- “Miora” at the left
- “Docs”, “Features”, and “Cloud” centered
- “Coming Soon” at the right

The header should feel almost weightless against the canvas. Links may darken slightly or receive a very restrained underline on hover or focus. Avoid pills, filled tabs, large indicators, or heavy navigation chrome.

“Coming Soon” should lead attention toward the closing signup section. The footer is not part of this pass.

## Hero

### Fixed copy and composition

The hero headline is:

> Miora aligns agents with project knowledge while you keep building.

Below it sits the monospace status label:

> [in development]

The headline and label sit in a compact text block above a wide image-led composition. The hero should preserve the large amount of open space and the calm, left-aligned editorial feeling of the Figma frame.

The signup control remains a simple email field paired with a dark “Sign Up” action. It should feel quiet and direct, with no additional explanatory copy competing with the headline.

### Fixed hero illustration

The hero illustration is not to be replaced. It is a wide, dark moss-green abstract material image with sweeping, folded forms and a floating warm-white knowledge card.

The card shows a simplified `knowledge/` folder structure. `AGENTS.md` is the only visible file. The other visible entries are folders, with only a small number shown so the illustration remains legible at a glance. The card should not attempt to display a complete project tree.

AI-agent icons appear at the trailing edge of the folder or file row currently being accessed. The icon represents an agent reading from or writing to that entry.

When an agent writes to an entry, show a small diff signal beside the name:

- Green `+` for an addition
- Red `−` for a removal

The agent activity should make it clear that several agents may be accessing the shared knowledge folder at the same time. The activity is coordinated and legible, not a dense stream of status indicators.

When an agent’s turn is complete, its icon disappears. A moss-green overlay then wipes gently from left to right across the affected row in a soft gradient. The folder or file icon and name resolve into a checkmark with a short status such as “Conflicts resolved.” The exact final wording can remain open.

The full sequence runs in a fixed order for approximately twenty seconds, then loops. It should feel like Miora quietly cleaning up parallel agent work in the background rather than like a flashy product demonstration.

The `miora/` command and visible folder/file structure should remain stable while the activity around them changes. The illustration is the main focal point of the hero, but the floating card must remain readable without becoming a dashboard.

## Knowledge section

### Fixed copy

The section headline is:

> Coherent project knowledge for every agent.

The subheadline is:

> A knowledge base that isn’t maintained is worse than no knowledge base at all. Miora maintains yours quietly while you keep building.

This section describes what Miora guarantees. The copy should not be rewritten as a description of how Miora works.

### Fixed card copy

The three cards use the following copy:

#### One command.

> Run a single command in your project’s working directory. Your project knowledge will now be autonomously maintained.

#### Any agent.

> Miora works with every agent on your computer. No MCP, no connector, just a single CLI tool.

#### It’s all markdown.

> The secret sauce is just a folder with markdown. No proprietary knowledge format to be trapped inside.

The copy is fixed for this pass. The exploration is in the subtle widgets embedded inside each card image.

## Feature-card image widgets

Each card pairs an abstract material background with one small product vignette. The vignette should feel embedded in the image rather than placed on top as a separate screenshot. It should be discoverable on closer inspection and remain visually secondary to the material.

The widgets should use sparse signals, soft white surfaces, restrained shadows, and minimal surrounding chrome. They should communicate the card’s promise without becoming miniature dashboards.

### “One command.” widget

Use the supplied terminal illustration as the fixed visual base. Preserve its card shape, grain, shadow, prompt mark, typography, and overall composition.

The command line remains static:

> › miora init

The lines below it fade in one at a time, representing a user setting up their project docs with Miora:

> Project name › VirtuGood 6500
>
> Link this directory? › Yes
>
> ✓ Vault linked
>
> Ready.

The sequence should feel like a quiet setup ritual. It should not look like a long terminal log or a technical tutorial. Once the final line appears, the card holds briefly before returning to its idle state.

### “Any agent.” widget

Use a simplified version of the hero illustration:

- A small `knowledge/` folder widget near the center
- Several AI-agent icons around it
- Each agent icon placed inside a white circular badge
- Thin connection lines between the agents and the folder

Instead of explicit read/write labels, a small circle travels to or from an agent and the folder widget to imply activity. Multiple agents may be active at once, but the movement should remain sparse enough to understand immediately.

Occasionally, the same moss-green wipe treatment used in the hero passes across the folder widget or an active connection. This suggests Miora reconciling shared knowledge after agents have worked in parallel.

The exact agent identities, number of agents, icon treatment, connection geometry, and wipe frequency remain open. The icons should communicate interoperability without feeling like endorsements or a crowded brand-logo arrangement.

### “It’s all markdown.” widget

Use a subtle code-editor-like widget embedded inside the abstract background.

- Show three open markdown files as tabs
- Do not show `AGENTS.md`
- Use real-looking project filenames; the exact filenames remain open
- Do not show readable prose inside the files
- Show markdown structure markers such as `##`, `###`, and `>` as plain text
- Represent the content beside those markers with faint ghost pills
- Let the ghost content fade out toward the bottom of the widget

The editor surface should feel partially absorbed into the image. Avoid excessive editor chrome, toolbars, line numbers, syntax coloring, or the impression of a full application screenshot. The point is to show simple, portable documents—not a proprietary interface.

## Feature-card states and interaction

The cards should be muted by default and become expressive only when someone chooses to inspect them.

### Idle state

In idle, each image and widget is slightly subdued. Only low-energy ambient movement may occur: slow material drift, faint grain movement, or a barely perceptible status pulse. The narrative animation does not play in this state.

### Hover or focus state

When a card is hovered or receives keyboard focus:

- The image gently brightens
- The widget becomes slightly clearer and more prominent
- The full card-specific animation begins
- The animation loops while the card remains active

The interaction should feel like bringing a quiet system into focus, not like opening a modal or triggering a dramatic effect.

### Leaving the card

When the pointer or focus leaves, the card should ease back into its muted idle state. It should not snap off or leave a partial, visually confusing state behind.

On touch devices, the first tap may activate the card and a tap elsewhere may return it to idle. The same visual distinction between idle and active should remain intact.

Reduced-motion behavior should preserve the difference between idle and active states without relying on the animated sequences.

## Closing signup section

The closing signup is approved as currently designed and should not be changed in this pass.

It contains:

- “Coming soon.”
- `[in development]`
- A centered email field
- A “Sign Up” action

Its visual role is to provide a spacious, quiet pause after the three guarantees. The form’s behavior should remain consistent with the hero signup, but no new interaction or visual treatment is needed here.

## Final image panel

The page ends with the existing full-width dark blue abstract image panel and its small floating command card. This panel should remain a calm closing image rather than a second promotional section.

The card contains the command-like `npx miora` cue and the muted “Coming soon.” status. It is a visual signature of the product’s future presence in the builder’s environment, not a separate CTA.

The final panel should retain generous negative space around the card. Any ambient motion should be extremely subtle and should not compete with the image.

## Motion principles

All motion should be sparse, gentle, and purposeful. It should communicate quiet maintenance, shared activity, or resolution.

Avoid:

- Bouncing or playful movement
- Fast transitions
- Dense streams of status updates
- Parallax-heavy effects
- Animated gradients that dominate the page
- Motion that continues to demand attention after the visitor has moved on

The page should be calm when viewed passively and rewarding when a visitor intentionally hovers over a feature card.

## Deferred decisions

The following remain open for a later pass:

- Exact hero folder names beyond `AGENTS.md`
- Exact “Conflicts resolved” wording
- Exact AI-agent identities and icon style
- Exact number and filenames of the markdown tabs
- Precise timing of each card’s active sequence
- Whether the final command card has any additional interaction
- Footer content and visual treatment
