"use client"

import * as React from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const agents = [
  "ChatGPT + Codex",
  "Claude + Claude Code",
  "Cursor",
  "Gemini + Antigravity",
  "GitHub Copilot",
  "OpenCode",
  "Pi / OMP",
  "Devin",
  "Other",
] as const

const workLocationStops = [
  { value: 0, label: "All local" },
  { value: 0.25, label: "Mostly local" },
  { value: 0.5, label: "Balanced" },
  { value: 0.75, label: "Mostly cloud" },
  { value: 1, label: "All cloud" },
] as const

const workflows = [
  {
    value: "One continuous agent",
    description: "One primary conversation or session that accumulates context.",
    diagram: "You ↔ Agent\n      ↓\n   Project",
  },
  {
    value: "Separate threads by task",
    description: "A fresh thread for each feature, bug, or research question.",
    diagram: "      ┌→ Agent / feature\nYou ──┼→ Agent / bug\n      └→ Agent / research",
  },
  {
    value: "Different agents for different roles",
    description: "Specialized tools for planning, research, and implementation.",
    diagram: "Claude  → research\nCodex   → implementation\nChatGPT → planning",
  },
  {
    value: "Lead agent + subagents",
    description: "A lead agent delegates focused work to other agents.",
    diagram: "You → Lead agent\n      ├→ Subagent\n      ├→ Subagent\n      └→ Subagent",
  },
  {
    value: "Parallel / swarm",
    description: "Several agents work in parallel and return a combined result.",
    diagram: "      ┌→ Agent A ─┐\nYou ───┼→ Agent B ─┼→ result\n      └→ Agent C ─┘",
  },
  {
    value: "Other",
    description: "A different workflow that does not fit the patterns above.",
    diagram: "You → your own pattern → result",
  },
] as const

const knowledgeGroups = [
  {
    title: "Inside the project",
    options: [
      "Source code",
      "README / top-level Markdown",
      "/docs or similar",
      "AGENTS.md, CLAUDE.md, rules files, etc.",
    ],
  },
  {
    title: "Outside the project",
    options: [
      "Notion / Confluence",
      "Linear / GitHub Issues",
      "Figma",
      "Personal notes / Markdown",
      "Google Docs / similar",
    ],
  },
  {
    title: "Inside agents",
    options: ["Chat histories", "Agent memory / saved context"],
  },
  { title: "Other", options: ["Mostly in my head", "Other"] },
] as const

const organization = [
  { value: "A few canonical files", diagram: "README.md\nARCHITECTURE.md\nDECISIONS.md" },
  { value: "A documentation tree", diagram: "docs/\n├─ product/\n├─ architecture/\n└─ decisions/" },
  { value: "Knowledge near the thing it describes", diagram: "src/\n├─ payments/README.md\n└─ auth/NOTES.md" },
  { value: "Organized primarily in an external tool", diagram: "Notion\nLinear\nFigma" },
  { value: "Distributed across several places", diagram: "code ── docs ── issues\n  └── chats ── notes" },
  { value: "There isn't much structure", diagram: "file?  note?  chat?\n      ↓\n   search again" },
  { value: "Other", diagram: "your structure\n      ↓\n project knowledge" },
] as const

const preserved = [
  "Product requirements / specs",
  "Decisions and rationale",
  "Architecture",
  "Implementation details",
  "Research",
  "Design context",
  "Customer / user insights",
  "Plans / roadmap",
  "Open questions",
  "Bugs / known issues",
  "Conventions / preferences",
  "Operational knowledge",
  "Other",
] as const

const maintenanceOptions = [
  "Mostly stays current",
  "Some stays current",
  "Mostly goes stale",
  "I don't really maintain it",
] as const

type Workflow = (typeof workflows)[number]["value"]
type Maintenance = (typeof maintenanceOptions)[number]

type SurveyState = {
  name: string
  email: string
  agentsUsed: string[]
  workLocation: number
  workflowPrimary: Workflow | null
  workflowSecondary: Workflow | null
  knowledgeLocations: string[]
  knowledgeOrganization: string[]
  preservedKnowledge: string[]
  teamMaintainedPercent: number
  knowledgeMaintenance: Maintenance | null
  sixMonthSourceOfTruth: string
}

type Errors = Partial<Record<"name" | "email" | "workLocation" | "workflow" | "ownership" | "maintenance", string>>

const errorKeyByState: Partial<Record<keyof SurveyState, keyof Errors>> = {
  name: "name",
  email: "email",
  workflowPrimary: "workflow",
  teamMaintainedPercent: "ownership",
  knowledgeMaintenance: "maintenance",
}

const initialState = (email: string): SurveyState => ({
  name: "",
  email,
  agentsUsed: [],
  workLocation: 0.5,
  workflowPrimary: null,
  workflowSecondary: null,
  knowledgeLocations: [],
  knowledgeOrganization: [],
  preservedKnowledge: [],
  teamMaintainedPercent: 50,
  knowledgeMaintenance: null,
  sixMonthSourceOfTruth: "",
})

function toggleInList(list: string[], value: string, checked: boolean) {
  return checked ? [...new Set([...list, value])] : list.filter((item) => item !== value)
}

function RequiredMark({ className }: { className?: string }) {
  return (
    <span className={cn("font-normal text-moss", className)} aria-hidden="true">
      *
    </span>
  )
}

function RequiredIndicator() {
  return (
    <>
      <RequiredMark className="ml-0.5" />
      <span className="sr-only"> (required)</span>
    </>
  )
}

function ChoiceDiagram({ children }: { children: string }) {
  return (
    <pre aria-hidden="true" className="survey-card-diagram">
      {children}
    </pre>
  )
}

function ChoiceCardBody({
  mark,
  title,
  description,
  diagram,
}: {
  mark: React.ReactNode
  title: string
  description?: string
  diagram: string
}) {
  return (
    <>
      <div className="flex items-start gap-3">
        {mark}
        <span className="min-w-0 flex-1 text-left text-sm font-semibold leading-snug text-ink">
          {title}
        </span>
      </div>
      {description ? (
        <p className="text-left text-sm leading-6 text-text-secondary">{description}</p>
      ) : null}
      <ChoiceDiagram>{diagram}</ChoiceDiagram>
    </>
  )
}

function QuestionHeading({
  number,
  title,
  description,
  required = true,
}: {
  number: string
  title: string
  description?: string
  required?: boolean
}) {
  return (
    <div className="flex max-w-[60ch] flex-col gap-2">
      <p className="font-mono text-sm leading-6 text-ink">{number}</p>
      <h2
        id={`question-${Number(number)}`}
        className="text-balance text-h3 font-semibold tracking-[-0.025em] text-ink"
      >
        {title}
        {required ? <RequiredIndicator /> : null}
      </h2>
      {description ? (
        <p className="text-pretty text-sm leading-6 text-text-secondary">{description}</p>
      ) : null}
    </div>
  )
}

export default function SurveyForm({ initialEmail }: { initialEmail: string }) {
  const [state, setState] = React.useState(() => initialState(initialEmail))
  const [errors, setErrors] = React.useState<Errors>({})
  const [preservedNotice, setPreservedNotice] = React.useState(false)

  const update = <K extends keyof SurveyState>(key: K, value: SurveyState[K]) => {
    setState((current) => ({ ...current, [key]: value }))
    const errorKey = errorKeyByState[key]
    if (errorKey) {
      setErrors((current) => {
        if (!current[errorKey]) return current
        const next = { ...current }
        delete next[errorKey]
        return next
      })
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const teamMaintained = state.teamMaintainedPercent
  const agentMaintained = 100 - teamMaintained
  const secondaryWorkflowItems = [
    { label: "No secondary workflow", value: null },
    ...workflows
      .filter((item) => item.value !== state.workflowPrimary)
      .map((item) => ({ label: item.value, value: item.value })),
  ]

  const chipClassName =
    "h-auto min-h-8 rounded-none px-3 py-1.5 text-sm font-normal data-pressed:border-ink data-pressed:bg-surface-1 data-pressed:text-ink"

  return (
    <main className="bg-background text-ink">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-12 px-4 pb-20 pt-12 sm:px-6">
        <header>
          <h1 className="text-balance text-[36px] font-normal leading-[1.08] tracking-[-0.025em] text-ink sm:text-[40px]">
            Help us understand how projects remember.
          </h1>
          <p className="mt-3 max-w-[60ch] text-pretty text-sm leading-6 text-text-secondary">
            Tell us what your current workflow actually looks like. There are no
            right answers.
          </p>
        </header>

        <form className="flex flex-col gap-16" onSubmit={handleSubmit} noValidate>
          <section className="flex flex-col gap-6" aria-labelledby="respondent-heading">
            <h2
              id="respondent-heading"
              className="text-balance text-h3 font-semibold tracking-[-0.025em] text-ink"
            >
              Name and email
              <RequiredIndicator />
            </h2>
            <FieldGroup>
              <div className="flex flex-col gap-4">
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor="survey-name">Name</FieldLabel>
                <Input
                  id="survey-name"
                  value={state.name}
                  onChange={(event) => update("name", event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  placeholder="Your name"
                  autoComplete="name"
                />
                <FieldError>{errors.name}</FieldError>
              </Field>
              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="survey-email">Email</FieldLabel>
                <Input
                  id="survey-email"
                  type="email"
                  value={state.email}
                  onChange={(event) => update("email", event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <FieldError>{errors.email}</FieldError>
              </Field>
              </div>
            </FieldGroup>
          </section>

          <Separator />

          <section className="flex flex-col gap-6" aria-labelledby="question-1">
            <QuestionHeading
              number="01"
              title="Which agents do you use regularly for software projects?"
              description="Select all that are part of your normal project work."
            />
            <FieldSet>
              <FieldLegend variant="label" className="sr-only">
                Agents used regularly
              </FieldLegend>
              <ToggleGroup
                multiple
                value={state.agentsUsed}
                onValueChange={(value) => update("agentsUsed", value)}
                className="flex w-full flex-wrap items-start"
                spacing={2}
                aria-label="Agents used regularly"
              >
                {agents.map((agentName) => (
                  <ToggleGroupItem
                    key={agentName}
                    value={agentName}
                    variant="outline"
                    className={chipClassName}
                  >
                    {agentName}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FieldSet>
          </section>

          <section className="flex flex-col gap-6" aria-labelledby="question-2">
            <QuestionHeading
              number="02"
              title="Where does most of your agent work happen?"
              description="Think about where the agent is working with your files, not where you chat with it."
            />
            <FieldSet
              id="survey-work-location"
              data-invalid={Boolean(errors.workLocation)}
              className="border border-line bg-surface-1 p-5 sm:p-7"
            >
              <FieldLegend variant="label" className="sr-only">
                Work location
              </FieldLegend>
              <div className="flex items-center justify-between gap-4 text-xs text-text-muted">
                <span>Entirely local</span>
                <span>Entirely cloud</span>
              </div>
              <Slider
                aria-label="Local to cloud work"
                getAriaLabel={() => "Work location"}
                getAriaValueText={(_, value) => {
                  const stop = workLocationStops.find((item) => item.value === value)
                  return stop?.label ?? `${Math.round(value * 100)} percent cloud`
                }}
                min={0}
                max={1}
                step={0.25}
                value={state.workLocation}
                onValueChange={(value) => {
                  const next = Array.isArray(value) ? Number(value[0]) : Number(value)
                  update("workLocation", next)
                }}
                className="survey-large-slider"
              />
              <div className="relative h-8">
                {workLocationStops.map((stop, index) => {
                  const isFirst = index === 0
                  const isLast = index === workLocationStops.length - 1
                  return (
                    <button
                      key={stop.label}
                      type="button"
                      className={cn(
                        "absolute top-0 font-mono text-[11px] text-text-muted hover:text-ink",
                        isFirst && "left-0 text-left",
                        isLast && "right-0 text-right",
                        !isFirst && !isLast && "-translate-x-1/2 text-center"
                      )}
                      style={
                        !isFirst && !isLast
                          ? { left: `${stop.value * 100}%` }
                          : undefined
                      }
                      onClick={() => {
                        update("workLocation", stop.value)
                      }}
                    >
                      {stop.label}
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-col gap-2 border-t border-line pt-4 text-xs leading-6 text-text-secondary sm:flex-row sm:justify-between sm:gap-6">
                <span>
                  <b className="font-medium text-ink">Local</b>
                  {" · terminal / IDE agents working directly on your files"}
                </span>
                <span>
                  <b className="font-medium text-ink">Cloud</b>
                  {" · browser / hosted agents working remotely"}
                </span>
              </div>
              <FieldError>{errors.workLocation}</FieldError>
            </FieldSet>
          </section>

          <section className="flex flex-col gap-6" aria-labelledby="question-3">
            <QuestionHeading
              number="03"
              title="How do you usually work with agents on a project?"
              description="Choose the closest match. You can add one secondary workflow if you use more than one."
            />
            <FieldSet id="survey-workflow" data-invalid={Boolean(errors.workflow)}>
              <FieldLegend variant="label" className="sr-only">
                Primary workflow
              </FieldLegend>
              <RadioGroup
                value={state.workflowPrimary}
                onValueChange={(value) => {
                  update("workflowPrimary", value as Workflow)
                  if (state.workflowSecondary === value) update("workflowSecondary", null)
                }}
                className="survey-choice-grid"
              >
                {workflows.map((item, index) => (
                  <FieldLabel
                    key={item.value}
                    className={cn(
                      "survey-choice-card w-full",
                      state.workflowPrimary === item.value && "is-selected"
                    )}
                  >
                    <ChoiceCardBody
                      mark={
                        <RadioGroupItem value={item.value} aria-label={item.value} />
                      }
                      title={`${String.fromCharCode(65 + index)}. ${item.value}`}
                      description={item.description}
                      diagram={item.diagram}
                    />
                  </FieldLabel>
                ))}
              </RadioGroup>
              <FieldError>{errors.workflow}</FieldError>
              <Field className="max-w-md">
                <FieldLabel htmlFor="survey-secondary">Optional secondary workflow</FieldLabel>
                <Select
                  items={secondaryWorkflowItems}
                  value={state.workflowSecondary}
                  onValueChange={(value) => update("workflowSecondary", value as Workflow | null)}
                >
                  <SelectTrigger
                    id="survey-secondary"
                    className="w-full"
                    aria-label="Optional secondary workflow"
                  >
                    <SelectValue>
                      {(value: Workflow | null) => value ?? "I also use…"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Other workflows</SelectLabel>
                      {secondaryWorkflowItems.map((item) => (
                        <SelectItem key={item.value ?? "none"} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldSet>
          </section>

          <section className="flex flex-col gap-6" aria-labelledby="question-4">
            <QuestionHeading
              number="04"
              title="Where does useful knowledge about a project currently accumulate?"
              description="Select every place where project knowledge tends to collect, even if you did not deliberately document it there."
            />
            <FieldSet>
              <FieldLegend variant="label" className="sr-only">
                Knowledge locations
              </FieldLegend>
              <div className="grid gap-8 sm:grid-cols-2">
              {knowledgeGroups.map((group) => (
                <div key={group.title} className="flex flex-col gap-3">
                  <h3 className="font-mono text-[11px] text-text-muted">{group.title}</h3>
                  {group.options.map((option) => {
                    const optionId = `knowledge-${option.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`
                    return (
                      <Field key={option} orientation="horizontal" className="items-center">
                        <Checkbox
                          id={optionId}
                          checked={state.knowledgeLocations.includes(option)}
                          onCheckedChange={(checked) =>
                            update(
                              "knowledgeLocations",
                              toggleInList(state.knowledgeLocations, option, Boolean(checked))
                            )
                          }
                        />
                        <FieldLabel htmlFor={optionId}>{option}</FieldLabel>
                      </Field>
                    )
                  })}
                </div>
              ))}
              </div>
            </FieldSet>
          </section>

          <section className="flex flex-col gap-6" aria-labelledby="question-5">
            <QuestionHeading
              number="05"
              title="How is your durable project knowledge organized?"
              description="Select all the structures that sound like your project."
            />
            <FieldSet>
              <FieldLegend variant="label" className="sr-only" id="survey-knowledge-org-legend">
                Knowledge organization
              </FieldLegend>
              <div
                role="group"
                aria-labelledby="survey-knowledge-org-legend"
                className="survey-choice-grid w-full"
              >
                {organization.map((item, index) => {
                  const checked = state.knowledgeOrganization.includes(item.value)
                  return (
                    <FieldLabel
                      key={item.value}
                      className={cn(
                        "survey-choice-card w-full",
                        checked && "is-selected"
                      )}
                    >
                      <ChoiceCardBody
                        mark={
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(next) =>
                              update(
                                "knowledgeOrganization",
                                toggleInList(
                                  state.knowledgeOrganization,
                                  item.value,
                                  Boolean(next)
                                )
                              )
                            }
                            aria-label={item.value}
                          />
                        }
                        title={`${String.fromCharCode(65 + index)}. ${item.value}`}
                        diagram={item.diagram}
                      />
                    </FieldLabel>
                  )
                })}
              </div>
            </FieldSet>
          </section>

          <section className="flex flex-col gap-6" aria-labelledby="question-6">
            <QuestionHeading
              number="06"
              title="What kinds of knowledge do you intentionally preserve?"
              description="Pick up to 5."
            />
            <FieldSet>
              <FieldLegend variant="label" className="sr-only">
                Preserved knowledge
              </FieldLegend>
              <ToggleGroup
                multiple
                value={state.preservedKnowledge}
                onValueChange={(value) => {
                  if (value.length <= 5) {
                    update("preservedKnowledge", value)
                    setPreservedNotice(false)
                  } else {
                    setPreservedNotice(true)
                  }
                }}
                className="flex w-full flex-wrap items-start"
                spacing={2}
                aria-label="Preserved knowledge"
              >
                {preserved.map((item) => (
                  <ToggleGroupItem
                    key={item}
                    value={item}
                    variant="outline"
                    disabled={
                      state.preservedKnowledge.length >= 5 &&
                      !state.preservedKnowledge.includes(item)
                    }
                    className={chipClassName}
                  >
                    {item}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <div className="flex items-center justify-between gap-4 font-mono text-[11px] tabular-nums text-text-muted">
                <span>{state.preservedKnowledge.length} of 5 selected</span>
                {preservedNotice ? (
                  <span className="text-destructive">You can select up to five.</span>
                ) : null}
              </div>
            </FieldSet>
          </section>

          <section className="flex flex-col gap-6" aria-labelledby="question-7">
            <QuestionHeading
              number="07"
              title="Who maintains that knowledge?"
              description="Set the split between your team and agents. The two percentages always total 100."
            />
            <FieldSet
              id="survey-ownership"
              data-invalid={Boolean(errors.ownership)}
              className="border border-line bg-surface-1 p-5 sm:p-7"
            >
              <FieldLegend variant="label" className="sr-only">
                Knowledge ownership split
              </FieldLegend>
              <div className="survey-ownership-bar" aria-hidden="true">
                <span style={{ width: `${teamMaintained}%` }} />
                <span style={{ width: `${agentMaintained}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div>
                  <strong className="block font-mono text-sm tabular-nums text-ink">
                    {teamMaintained}%
                  </strong>
                  <span className="text-text-muted">Me / my team</span>
                </div>
                <div>
                  <strong className="block font-mono text-sm tabular-nums text-ink">
                    {agentMaintained}%
                  </strong>
                  <span className="text-text-muted">Agents</span>
                </div>
              </div>
              <Slider
                aria-label="Knowledge maintenance split between team and agents"
                getAriaValueText={(_, value) => `${value} percent maintained by your team`}
                min={0}
                max={100}
                step={1}
                value={state.teamMaintainedPercent}
                onValueChange={(value) => {
                  const next = Array.isArray(value) ? Number(value[0]) : Number(value)
                  update("teamMaintainedPercent", next)
                }}
                className="survey-large-slider mt-4"
              />
              <div className="flex justify-between font-mono text-[11px] text-text-muted">
                <span>0%</span>
                <span>100%</span>
              </div>
              <FieldError>{errors.ownership}</FieldError>
              <div className="flex flex-col gap-3 border-t border-line pt-6">
                <FieldLabel>
                  What usually happens over time?
                  <RequiredIndicator />
                </FieldLabel>
                <ToggleGroup
                  id="survey-maintenance"
                  value={state.knowledgeMaintenance ? [state.knowledgeMaintenance] : []}
                  onValueChange={(value) =>
                    update("knowledgeMaintenance", (value[0] || null) as Maintenance | null)
                  }
                  className="flex w-full flex-wrap items-start"
                  spacing={2}
                  aria-label="Knowledge maintenance over time"
                >
                  {maintenanceOptions.map((item) => (
                    <ToggleGroupItem
                      key={item}
                      value={item}
                      variant="outline"
                      className={chipClassName}
                    >
                      {item}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <FieldError>{errors.maintenance}</FieldError>
              </div>
            </FieldSet>
          </section>

          <section className="flex flex-col gap-6" aria-labelledby="question-8">
            <QuestionHeading
              number="08"
              required={false}
              title="You return to a project after six months. Where do you look to understand what happened and why?"
              description="Leave this completely open. We want to learn what you actually trust as a source of truth."
            />
            <Field>
              <FieldLabel htmlFor="survey-source-of-truth">Your source of truth</FieldLabel>
              <Textarea
                id="survey-source-of-truth"
                value={state.sixMonthSourceOfTruth}
                onChange={(event) => update("sixMonthSourceOfTruth", event.target.value)}
                placeholder="I would start by looking at…"
                rows={6}
                className="min-h-36 resize-y"
              />
              <FieldDescription>Optional.</FieldDescription>
            </Field>
          </section>

          <div className="flex flex-col gap-4 border-t border-line pt-8">
            <Button type="submit" className="h-[44px]">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
