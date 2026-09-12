import { describe, expect, test } from "bun:test"
import { sanitizeEventForTransport } from "./analytics"

describe("sanitizeEventForTransport", () => {
  test("removes query strings and fragments from captured URLs", () => {
    const event = sanitizeEventForTransport({
      uuid: "00000000-0000-0000-0000-000000000000",
      event: "$pageview",
      properties: {
        $current_url: "https://miora.example/survey?resume=secret&source=landing#answers",
        $referrer: "https://newsletter.example/article?subscriber=secret",
        $session_entry_url: "https://miora.example/survey?resume=secret",
      },
    })

    expect(event?.properties.$current_url).toBe("https://miora.example/survey")
    expect(event?.properties.$referrer).toBe("https://newsletter.example/article")
    expect(event?.properties.$session_entry_url).toBe("https://miora.example/survey")
  })

  test("removes sensitive custom properties", () => {
    const event = sanitizeEventForTransport({
      uuid: "00000000-0000-0000-0000-000000000000",
      event: "survey_submission_succeeded",
      properties: {
        origin: "landing",
        email: "person@example.com",
        name: "Person",
        answers: ["secret"],
        resume_token: "secret",
      },
      $set: {
        email: "person@example.com",
        $current_url: "https://miora.example/?email=secret",
      },
    })

    expect(event?.properties.origin).toBe("landing")
    expect(event?.properties.email).toBe(undefined)
    expect(event?.properties.name).toBe(undefined)
    expect(event?.properties.answers).toBe(undefined)
    expect(event?.properties.resume_token).toBe(undefined)
    expect(event?.$set?.email).toBe(undefined)
    expect(event?.$set?.$current_url).toBe("https://miora.example/")
  })

  test("preserves null events for PostHog to drop", () => {
    expect(sanitizeEventForTransport(null)).toBeNull()
  })
})
