import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { createSurveyResumeToken, readSurveyResumeToken } from "./survey-resume"

const secret = "test-survey-resume-secret-with-enough-entropy"
const originalSecret = process.env.SURVEY_RESUME_SECRET
const originalDateNow = Date.now

describe("survey resume tokens", () => {
  beforeEach(() => {
    process.env.SURVEY_RESUME_SECRET = secret
    Date.now = originalDateNow
  })

  afterEach(() => {
    Date.now = originalDateNow
    if (originalSecret === undefined) delete process.env.SURVEY_RESUME_SECRET
    else process.env.SURVEY_RESUME_SECRET = originalSecret
  })

  test("round-trips a normalized email", () => {
    const token = createSurveyResumeToken("  PERSON@Example.com ")
    expect(readSurveyResumeToken(token)).toBe("person@example.com")
    expect(token).not.toContain("person@example.com")
  })

  test("rejects tampered, malformed, and expired tokens", () => {
    const token = createSurveyResumeToken("person@example.com")
    const parts = token.split(".")
    parts[3] = `${parts[3]}tampered`

    expect(readSurveyResumeToken(parts.join("."))).toBeNull()
    expect(readSurveyResumeToken("not-a-token")).toBeNull()
    expect(readSurveyResumeToken(null)).toBeNull()

    Date.now = () => originalDateNow() + 31 * 24 * 60 * 60 * 1000
    expect(readSurveyResumeToken(token)).toBeNull()
  })

  test("rejects tokens after the signing secret changes", () => {
    const token = createSurveyResumeToken("person@example.com")
    process.env.SURVEY_RESUME_SECRET = `${secret}-rotated`
    expect(readSurveyResumeToken(token)).toBeNull()
  })
})
