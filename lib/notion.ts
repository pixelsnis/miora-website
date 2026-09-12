import {
  agents,
  emptySurveySubmission,
  knowledgeLocations,
  knowledgeOrganization,
  maintenanceOptions,
  preservedKnowledge,
  normalizeEmail,
  stringifySurveyAnswers,
  type SurveySubmissionInput,
  validateEmail,
  workflows,
} from "./survey"

const NOTION_VERSION = "2026-03-11"
const API_ROOT = "https://api.notion.com/v1"
const RESPONSE_PROPERTIES = [
  "01 - Agents Used",
  "02 - Work Location",
  "03 - Workflow",
  "04 - Knowledge Locations",
  "05 - Knowledge Organization",
  "06 - Preserved Knowledge",
  "07 - Knowledge Maintenance",
  "08 - Six Month Source of Truth",
] as const

type NotionPage = {
  id: string
  last_edited_time?: string
  properties?: Record<string, NotionProperty>
}

type NotionText = {
  plain_text?: string
  text?: { content?: string }
}

type NotionProperty = {
  type?: string
  title?: NotionText[]
  rich_text?: NotionText[]
  email?: string | null
}

type NotionList<T> = {
  results?: T[]
  has_more?: boolean
  next_cursor?: string | null
}

function getConfig() {
  const apiKey = process.env.NOTION_API_KEY
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID
  if (!apiKey || !dataSourceId) throw new Error("Notion integration is not configured")
  return { apiKey, dataSourceId }
}

async function notionRequest<T>(path: string, init: RequestInit = {}) {
  const { apiKey } = getConfig()
  const response = await fetch(`${API_ROOT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
      ...init.headers,
    },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const detail = body && typeof body === "object" && "message" in body ? String(body.message) : response.statusText
    throw new Error(`Notion request failed (${response.status}): ${detail}`)
  }
  return body as T
}

function textFragments(value: string) {
  const fragments = []
  for (let index = 0; index < value.length; index += 2000) {
    fragments.push({ type: "text", text: { content: value.slice(index, index + 2000) } })
  }
  return fragments
}

function richTextProperty(value: string) {
  return { rich_text: textFragments(value) }
}

function answerProperties(input: SurveySubmissionInput) {
  return Object.fromEntries(
    Object.entries(stringifySurveyAnswers(input)).map(([name, value]) => [name, richTextProperty(value)]),
  )
}

function pageProperties(input: SurveySubmissionInput, includeAnswers: boolean) {
  return {
    Name: { title: [{ type: "text", text: { content: input.name.trim() || "Unknown" } }] },
    Email: { email: normalizeEmail(input.email) },
    ...(includeAnswers ? answerProperties(input) : {}),
  }
}

async function queryRows(email: string) {
  const { dataSourceId } = getConfig()
  const rows: NotionPage[] = []
  let cursor: string | undefined
  do {
    const body: Record<string, unknown> = {
      page_size: 100,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      filter: { property: "Email", email: { equals: normalizeEmail(email) } },
    }
    if (cursor) body.start_cursor = cursor
    const result = await notionRequest<NotionList<NotionPage>>(`/data_sources/${encodeURIComponent(dataSourceId)}/query`, {
      method: "POST",
      body: JSON.stringify(body),
    })
    rows.push(...(result.results ?? []))
    cursor = result.has_more && result.next_cursor ? result.next_cursor : undefined
  } while (cursor)
  return rows
}

function propertyText(page: NotionPage, name: string, type: "title" | "rich_text" = "rich_text") {
  const property = page.properties?.[name]
  const fragments = type === "title" ? property?.title ?? [] : property?.rich_text ?? []
  return fragments
    .map((item) => item.plain_text ?? item.text?.content ?? "")
    .join("")
    .trim()
}

function propertyEmail(page: NotionPage, name: string) {
  const value = page.properties?.[name]?.email
  return typeof value === "string" ? value : ""
}

function parseJson(value: string) {
  try {
    return JSON.parse(value) as unknown
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function allowedValues(value: unknown, allowed: readonly string[], max: number) {
  if (!Array.isArray(value)) return []
  return [...new Set(
    value.filter((item): item is string => typeof item === "string" && allowed.includes(item)),
  )].slice(0, max)
}

function parseWorkflow(value: string) {
  const parsed = parseJson(value)
  if (Array.isArray(parsed)) return allowedValues(parsed, workflows, 3)
  if (isRecord(parsed)) return allowedValues([parsed.primary, parsed.secondary], workflows, 3)
  return []
}

function parseNumber(value: unknown, fallback: number, min: number, max: number, integer = false) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isInteger(value))
    ? value
    : fallback
}

function translateSurveyRow(page: NotionPage, email: string): SurveySubmissionInput {
  const survey = emptySurveySubmission(email)
  const name = propertyText(page, "Name", "title")
  const storedEmail = normalizeEmail(propertyEmail(page, "Email"))

  survey.name = name === "Unknown" ? "" : name.slice(0, 1000)
  survey.email = validateEmail(storedEmail) ? storedEmail : survey.email
  survey.agentsUsed = allowedValues(parseJson(propertyText(page, "01 - Agents Used")), agents, agents.length)
  survey.workLocation = parseNumber(parseJson(propertyText(page, "02 - Work Location")), 0.5, 0, 1)
  survey.workflow = parseWorkflow(propertyText(page, "03 - Workflow"))
  survey.knowledgeLocations = allowedValues(
    parseJson(propertyText(page, "04 - Knowledge Locations")),
    knowledgeLocations,
    knowledgeLocations.length,
  )
  survey.knowledgeOrganization = allowedValues(
    parseJson(propertyText(page, "05 - Knowledge Organization")),
    knowledgeOrganization,
    3,
  )
  survey.preservedKnowledge = allowedValues(
    parseJson(propertyText(page, "06 - Preserved Knowledge")),
    preservedKnowledge,
    5,
  )

  const maintenance = parseJson(propertyText(page, "07 - Knowledge Maintenance"))
  if (isRecord(maintenance)) {
    survey.teamMaintainedPercent = parseNumber(maintenance.human, 50, 0, 100, true)
    survey.knowledgeMaintenance = maintenanceOptions.includes(maintenance.overTime as (typeof maintenanceOptions)[number])
      ? maintenance.overTime as (typeof maintenanceOptions)[number]
      : null
  }

  const sourceOfTruth = parseJson(propertyText(page, "08 - Six Month Source of Truth"))
  survey.sixMonthSourceOfTruth = typeof sourceOfTruth === "string" ? sourceOfTruth.slice(0, 1000) : ""
  return survey
}

function isCompleted(page: NotionPage) {
  return RESPONSE_PROPERTIES.slice(0, 7).every((name) => propertyText(page, name).length > 0)
}

export async function registerEmail(email: string) {
  const normalizedEmail = normalizeEmail(email)
  const rows = await queryRows(normalizedEmail)
  if (rows.length > 0) return normalizedEmail
  const { dataSourceId } = getConfig()
  await notionRequest<NotionPage>("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "data_source_id", data_source_id: dataSourceId },
      properties: pageProperties({
        name: "Unknown",
        email: normalizedEmail,
        agentsUsed: [],
        workLocation: 0.5,
        workflow: [],
        knowledgeLocations: [],
        knowledgeOrganization: [],
        preservedKnowledge: [],
        teamMaintainedPercent: 50,
        knowledgeMaintenance: null,
        sixMonthSourceOfTruth: "",
      }, false),
    }),
  })
  return normalizedEmail
}

export async function getSurveyByEmail(email: string): Promise<SurveySubmissionInput | null> {
  const normalizedEmail = normalizeEmail(email)
  if (!validateEmail(normalizedEmail)) return null
  const rows = await queryRows(normalizedEmail)
  const row = rows.find(isCompleted) ?? rows[0]
  return row ? translateSurveyRow(row, normalizedEmail) : null
}

export async function saveSurvey(input: SurveySubmissionInput, fromLanding: boolean) {
  const normalizedInput = { ...input, name: input.name.trim(), email: normalizeEmail(input.email) }
  if (fromLanding) {
    const rows = await queryRows(normalizedInput.email)
    const completed = rows.find(isCompleted)
    if (completed) return
    if (rows[0]) {
      await notionRequest(`/pages/${encodeURIComponent(rows[0].id)}`, {
        method: "PATCH",
        body: JSON.stringify({ properties: pageProperties(normalizedInput, true) }),
      })
      return
    }
  }

  const { dataSourceId } = getConfig()
  await notionRequest<NotionPage>("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "data_source_id", data_source_id: dataSourceId },
      properties: pageProperties(normalizedInput, true),
    }),
  })
}
