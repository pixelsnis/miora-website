# Miora Early Access Survey

## Notion storage schema

The survey is persisted as one Notion data-source row. `Name` and `Email` are the respondent properties; each question has its own rich-text property containing the compact `JSON.stringify` value for that answer.

| Property | Type | Stored value |
| --- | --- | --- |
| `Name` | Title | Name, or `Unknown` for a landing-only signup; maximum 1,000 characters |
| `Email` | Email | Trimmed, lowercase email; maximum 200 characters |
| `01 - Agents Used` | Rich text | JSON string array |
| `02 - Work Location` | Rich text | JSON number from 0 to 1 |
| `03 - Workflow` | Rich text | JSON object with `primary` and `secondary` |
| `04 - Knowledge Locations` | Rich text | JSON string array |
| `05 - Knowledge Organization` | Rich text | JSON string array |
| `06 - Preserved Knowledge` | Rich text | JSON string array |
| `07 - Knowledge Maintenance` | Rich text | JSON object with `human`, `agent`, and `overTime` |
| `08 - Six Month Source of Truth` | Rich text | JSON string; optional and maximum 1,000 characters before stringification |

The server validates every answer before writing. Questions 1, 4, 5, and 6 require at least one selection; preserved knowledge allows at most five unique selections; and `human + agent` must equal `100`. Rich-text values are split into safe fragments when needed to stay within Notion’s per-fragment limit.

For a landing-origin survey (`source=landing`), a row is complete when properties `01` through `07` are all non-empty. Completed rows are never overwritten. Direct survey submissions always create a new row.

## Respondent Information

### Name

**Component:** Single-line text input.

**JSON translation:** `respondent.name` — non-empty string.

### Email

**Component:** Email input, pre-filled from the landing-page `email` query parameter (for example, `?email=person%40example.com`).

**JSON translation:** `respondent.email` — email-formatted string.

Populate the field from `email` when the survey loads. Keep it editable so the respondent can correct an invalid or outdated address, and validate it as an email address before submission.

## 1. Which agents do you use regularly for software projects?

**Component:** Multi-select chips.

**JSON translation:** `answers.agentsUsed` — array of unique option strings.

- ChatGPT + Codex
- Claude + Claude Code
- Cursor
- Gemini + Antigravity
- GitHub Copilot
- OpenCode
- Pi / OMP
- Devin
- Other

Selecting `Other` does not reveal a free-response field; the additional detail is intentionally not stored.

Ask about agents used **regularly**, not tools someone has merely tried.

---

## 2. Where does most of your agent work happen?

**Component:** Bipolar slider.

**JSON translation:** `answers.workLocation` — number from `0.0` for entirely local to `1.0` for entirely cloud.

**Entirely local ←────────●────────→ Entirely cloud**

Suggested semantic labels:

- All local
- Mostly local
- Balanced
- Mostly cloud
- All cloud

Optional helper text:

> **Local:** terminal / IDE agents working directly on your files  
> **Cloud:** browser / hosted agents working remotely

The numeric value may remain hidden in the UI. Store the slider's normalized value, not a semantic label.

---

## 3. How do you usually work with agents on a project?

**Component:** Visual workflow cards.

**JSON translation:** `answers.workflow` — object with `primary` and `secondary` keys. Set `secondary` to `null` when omitted.

Prompt:

> Choose the closest match.

Allow one **primary** choice and, optionally, one **secondary** choice.

### A. One continuous agent

```text
You ↔ Agent
      ↓
   Project
```

One primary conversation or session that accumulates context.

### B. Separate threads by task

```text
      ┌→ Agent / feature
You ──┼→ Agent / bug
      └→ Agent / research
```

### C. Different agents for different roles

```text
Claude  → research
Codex   → implementation
ChatGPT → planning
```

### D. Lead agent + subagents

```text
You → Lead agent
       ├→ Subagent
       ├→ Subagent
       └→ Subagent
```

### E. Parallel / swarm

```text
       ┌→ Agent A ─┐
You ───┼→ Agent B ─┼→ result
       └→ Agent C ─┘
```

### F. Other

No free-response field.

---

## 4. Where does useful knowledge about a project currently accumulate?

**Component:** Multi-select, grouped by location.

**JSON translation:** `answers.knowledgeLocations` — array of unique option strings. The visual groups are presentation-only and are not stored.

### Inside the project

- Source code
- `README` / top-level Markdown
- `/docs` or similar
- `AGENTS.md`, `CLAUDE.md`, rules files, etc.

### Outside the project

- Notion / Confluence
- Linear / GitHub Issues
- Figma
- Personal notes / Markdown
- Google Docs / similar

### Inside agents

- Chat histories
- Agent memory / saved context

### Other

- Mostly in my head
- Other

Selecting `Other` does not collect additional text.

Use **“accumulate”** rather than only asking where people deliberately document things.

---

## 5. How is your durable project knowledge organized?

**Component:** Visual structure cards.

**JSON translation:** `answers.knowledgeOrganization` — array of unique card-title strings without the `A.`–`G.` prefixes.

Allow multi-select if needed.

### A. A few canonical files

```text
README.md
ARCHITECTURE.md
DECISIONS.md
```

### B. A documentation tree

```text
docs/
  product/
  architecture/
  decisions/
  research/
```

### C. Knowledge near the thing it describes

```text
src/
  payments/
    README.md
  auth/
    NOTES.md
```

### D. Organized primarily in an external tool

Examples: Notion, Linear, Figma, etc.

### E. Distributed across several places

### F. There isn't much structure

### G. Other

Selecting `Other` does not collect additional text.

---

## 6. What kinds of knowledge do you intentionally preserve?

**Component:** Selectable chips.

**JSON translation:** `answers.preservedKnowledge` — array of up to five unique option strings.

**Instruction:** Pick up to 5.

- Product requirements / specs
- Decisions and rationale
- Architecture
- Implementation details
- Research
- Design context
- Customer / user insights
- Plans / roadmap
- Open questions
- Bugs / known issues
- Conventions / preferences
- Operational knowledge
- Other

Selecting `Other` does not collect additional text.

---

## 7. Who maintains that knowledge?

**Component:** Three-way proportion control.

**JSON translation:** `answers.knowledgeMaintenance` — object containing `human`, `agent`, and `overTime`.

Store `human` and `agent` as integer percentages from `0` to `100`. Validate in the form that they total `100`.

Example:

```text
Human-written         Shared         Agent-written
███████████████░░░░░░░░░░░░░░░░░░
```

Suggested dimensions:

- Me / my team
- Both
- Agents

### Follow-up

**What usually happens over time?**

- Mostly stays current
- Some stays current
- Mostly goes stale
- I don't really maintain it

---

## 8. You return to a project after six months. Where do you look to understand what happened and why?

**Component:** Short free response.

**JSON translation:** `answers.sixMonthSourceOfTruth` — string stored verbatim; use an empty string when skipped.

Leave this completely open.

This is intended to reveal the respondent's **actual source of truth**, even if it differs from the tools or structures they selected above.

---

## Survey Structure

**Questions 1–3:** How you use agents  
**Questions 4–7:** How your project knowledge works  
**Question 8:** What you actually trust

Avoid adding a generic “what frustrates you?” question at this stage. The behavioral answers should expose where the real problems are without prompting respondents to manufacture pain.

---

## Persistence

**Response file host:** TBD.

Preparing and validating the canonical JSON response is the current priority. The storage provider and persistence flow will be decided separately.
