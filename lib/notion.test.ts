import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { getSurveyByEmail } from "./notion"

const originalFetch = globalThis.fetch
const originalApiKey = process.env.NOTION_API_KEY
const originalDataSourceId = process.env.NOTION_DATA_SOURCE_ID

function richText(value: string) {
  return { type: "rich_text", rich_text: [{ plain_text: value }] }
}

function completeRow(workflow: unknown, overrides: Record<string, unknown> = {}) {
  return {
    id: "survey-row",
    last_edited_time: "2026-09-12T00:00:00.000Z",
    properties: {
      Name: { type: "title", title: [{ plain_text: "Ada Lovelace" }] },
      Email: { type: "email", email: "ada@example.com" },
      "01 - Agents Used": richText(JSON.stringify(["Cursor"])),
      "02 - Work Location": richText(JSON.stringify(0.75)),
      "03 - Workflow": richText(JSON.stringify(workflow)),
      "04 - Knowledge Locations": richText(JSON.stringify(["Source code"])),
      "05 - Knowledge Organization": richText(JSON.stringify(["A few canonical files"])),
      "06 - Preserved Knowledge": richText(JSON.stringify(["Architecture"])),
      "07 - Knowledge Maintenance": richText(JSON.stringify({
        human: 60,
        agent: 40,
        overTime: "Some stays current",
      })),
      "08 - Six Month Source of Truth": richText(JSON.stringify("DECISIONS.md")),
      ...overrides,
    },
  }
}

function mockNotionRows(rows: unknown[]) {
  globalThis.fetch = (async () => new Response(JSON.stringify({ results: rows, has_more: false }), { status: 200 })) as typeof fetch
}

describe("getSurveyByEmail", () => {
  beforeEach(() => {
    process.env.NOTION_API_KEY = "test-key"
    process.env.NOTION_DATA_SOURCE_ID = "test-data-source"
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    if (originalApiKey === undefined) delete process.env.NOTION_API_KEY
    else process.env.NOTION_API_KEY = originalApiKey
    if (originalDataSourceId === undefined) delete process.env.NOTION_DATA_SOURCE_ID
    else process.env.NOTION_DATA_SOURCE_ID = originalDataSourceId
  })

  test("translates a current row and prefers it over an incomplete placeholder", async () => {
    mockNotionRows([
      { id: "placeholder", properties: { Email: { type: "email", email: "ada@example.com" } } },
      completeRow(["One continuous agent", "Separate threads by task"]),
    ])

    const survey = await getSurveyByEmail(" ADA@EXAMPLE.COM ")

    expect(survey).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      agentsUsed: ["Cursor"],
      workLocation: 0.75,
      workflow: ["One continuous agent", "Separate threads by task"],
      knowledgeLocations: ["Source code"],
      knowledgeOrganization: ["A few canonical files"],
      preservedKnowledge: ["Architecture"],
      teamMaintainedPercent: 60,
      knowledgeMaintenance: "Some stays current",
      sixMonthSourceOfTruth: "DECISIONS.md",
    })
  })

  test("translates legacy workflow objects without migrating the row", async () => {
    mockNotionRows([completeRow({ primary: "One continuous agent", secondary: "Separate threads by task" })])

    const survey = await getSurveyByEmail("ada@example.com")

    expect(survey?.workflow).toEqual(["One continuous agent", "Separate threads by task"])
  })

  test("returns safe defaults for a landing-only placeholder", async () => {
    mockNotionRows([{
      id: "placeholder",
      properties: {
        Name: { type: "title", title: [{ plain_text: "Unknown" }] },
        Email: { type: "email", email: "ada@example.com" },
      },
    }])

    const survey = await getSurveyByEmail("ada@example.com")

    expect(survey).toEqual({
      name: "",
      email: "ada@example.com",
      agentsUsed: [],
      workLocation: 0.5,
      workflow: [],
      knowledgeLocations: [],
      knowledgeOrganization: [],
      preservedKnowledge: [],
      teamMaintainedPercent: 50,
      knowledgeMaintenance: null,
      sixMonthSourceOfTruth: "",
    })
  })
})
