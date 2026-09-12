import {
  normalizeEmail,
  stringifySurveyAnswers,
  type SurveySubmissionInput,
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
  properties?: Record<string, NotionProperty>
}

type NotionProperty = {
  type?: string
  rich_text?: Array<{ plain_text?: string; text?: { content?: string } }>
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

function propertyText(page: NotionPage, name: string) {
  return (page.properties?.[name]?.rich_text ?? [])
    .map((item) => item.plain_text ?? item.text?.content ?? "")
    .join("")
    .trim()
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
        workflowPrimary: null,
        workflowSecondary: null,
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
