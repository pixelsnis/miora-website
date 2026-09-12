export const agents = [
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

export const workflows = [
  "One continuous agent",
  "Separate threads by task",
  "Different agents for different roles",
  "Lead agent + subagents",
  "Parallel / swarm",
  "Other",
] as const

export const knowledgeLocations = [
  "Source code",
  "README / top-level Markdown",
  "/docs or similar",
  "AGENTS.md, CLAUDE.md, rules files, etc.",
  "Notion / Confluence",
  "Linear / GitHub Issues",
  "Figma",
  "Personal notes / Markdown",
  "Google Docs / similar",
  "Chat histories",
  "Agent memory / saved context",
  "Mostly in my head",
  "Other",
] as const

export const knowledgeOrganization = [
  "A few canonical files",
  "A documentation tree",
  "Knowledge near the thing it describes",
  "Organized primarily in an external tool",
  "Distributed across several places",
  "There isn't much structure",
  "Other",
] as const

export const preservedKnowledge = [
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

export const maintenanceOptions = [
  "Mostly stays current",
  "Some stays current",
  "Mostly goes stale",
  "I don't really maintain it",
] as const

export type SurveySubmissionInput = {
  name: string
  email: string
  agentsUsed: string[]
  workLocation: number
  workflow: string[]
  knowledgeLocations: string[]
  knowledgeOrganization: string[]
  preservedKnowledge: string[]
  teamMaintainedPercent: number
  knowledgeMaintenance: string | null
  sixMonthSourceOfTruth: string
}

export function emptySurveySubmission(email: string): SurveySubmissionInput {
  return {
    name: "",
    email: normalizeEmail(email),
    agentsUsed: [],
    workLocation: 0.5,
    workflow: [],
    knowledgeLocations: [],
    knowledgeOrganization: [],
    preservedKnowledge: [],
    teamMaintainedPercent: 50,
    knowledgeMaintenance: null,
    sixMonthSourceOfTruth: "",
  }
}

export type SurveyErrors = Partial<Record<
  | "name"
  | "email"
  | "agentsUsed"
  | "workLocation"
  | "workflow"
  | "knowledgeLocations"
  | "knowledgeOrganization"
  | "preservedKnowledge"
  | "ownership"
  | "maintenance"
  | "sourceOfTruth"
  | "form",
  string
>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isUniqueAllowed(values: unknown, allowed: readonly string[]): values is string[] {
  return Array.isArray(values) &&
    values.every((value) => typeof value === "string") &&
    values.length === new Set(values).size &&
    values.every((value) => allowed.includes(value))
}

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

export function validateEmail(value: string) {
  const email = normalizeEmail(value)
  return email.length <= 200 && emailPattern.test(email)
}

export function validateSurvey(input: SurveySubmissionInput): SurveyErrors {
  const errors: SurveyErrors = {}
  if (!input || typeof input !== "object") return { form: "Invalid survey submission." }
  const name = typeof input.name === "string" ? input.name.trim() : ""
  const email = normalizeEmail(input.email)

  if (!name) errors.name = "Please enter your name."
  else if (name.length > 1000) errors.name = "Name must be 1,000 characters or fewer."
  if (!validateEmail(email)) errors.email = "Enter a valid email address."
  if (!isUniqueAllowed(input.agentsUsed, agents)) errors.agentsUsed = "Choose valid agent options."
  else if (input.agentsUsed.length === 0) errors.agentsUsed = "Select at least one agent."
  if (!Number.isFinite(input.workLocation) || input.workLocation < 0 || input.workLocation > 1) {
    errors.workLocation = "Choose a work location."
  }
  if (!isUniqueAllowed(input.workflow, workflows)) {
    errors.workflow = "Choose valid workflow options."
  } else if (input.workflow.length === 0) {
    errors.workflow = "Select at least one workflow."
  } else if (input.workflow.length > 3) {
    errors.workflow = "Choose up to three workflows."
  }
  if (!isUniqueAllowed(input.knowledgeLocations, knowledgeLocations)) {
    errors.knowledgeLocations = "Choose valid knowledge locations."
  } else if (input.knowledgeLocations.length === 0) {
    errors.knowledgeLocations = "Select at least one knowledge location."
  }
  if (!isUniqueAllowed(input.knowledgeOrganization, knowledgeOrganization)) {
    errors.knowledgeOrganization = "Choose valid knowledge structures."
  } else if (input.knowledgeOrganization.length === 0) {
    errors.knowledgeOrganization = "Select at least one knowledge structure."
  } else if (input.knowledgeOrganization.length > 3) {
    errors.knowledgeOrganization = "Choose up to three knowledge structures."
  }
  if (!isUniqueAllowed(input.preservedKnowledge, preservedKnowledge)) {
    errors.preservedKnowledge = "Choose valid preserved knowledge options."
  } else if (input.preservedKnowledge.length === 0) {
    errors.preservedKnowledge = "Select at least one kind of knowledge."
  } else if (input.preservedKnowledge.length > 5) {
    errors.preservedKnowledge = "Choose up to five kinds of knowledge."
  }
  if (!Number.isInteger(input.teamMaintainedPercent) || input.teamMaintainedPercent < 0 || input.teamMaintainedPercent > 100) {
    errors.ownership = "Choose a percentage from 0 to 100."
  }
  if (!maintenanceOptions.includes(input.knowledgeMaintenance as (typeof maintenanceOptions)[number])) {
    errors.maintenance = "Choose what usually happens over time."
  }
  if (typeof input.sixMonthSourceOfTruth !== "string") {
    errors.sourceOfTruth = "Enter a valid response."
  } else if (input.sixMonthSourceOfTruth.length > 1000) {
    errors.sourceOfTruth = "Please keep this response to 1,000 characters or fewer."
  }

  return errors
}

export function stringifySurveyAnswers(input: SurveySubmissionInput) {
  return {
    "01 - Agents Used": JSON.stringify(input.agentsUsed),
    "02 - Work Location": JSON.stringify(input.workLocation),
    "03 - Workflow": JSON.stringify(input.workflow),
    "04 - Knowledge Locations": JSON.stringify(input.knowledgeLocations),
    "05 - Knowledge Organization": JSON.stringify(input.knowledgeOrganization),
    "06 - Preserved Knowledge": JSON.stringify(input.preservedKnowledge),
    "07 - Knowledge Maintenance": JSON.stringify({
      human: input.teamMaintainedPercent,
      agent: 100 - input.teamMaintainedPercent,
      overTime: input.knowledgeMaintenance,
    }),
    "08 - Six Month Source of Truth": JSON.stringify(input.sixMonthSourceOfTruth),
  }
}
