"use client"

import posthog, { type BeforeSendFn, type Properties } from "posthog-js"

export type FormLocation = "hero" | "coming_soon"
export type SurveyOrigin = "landing" | "direct"

type AcquisitionTouch = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referring_domain?: string
  landing_path?: string
}

type EventProperties = {
  early_access_signup_attempted: { form_location: FormLocation }
  early_access_signup_succeeded: { form_location: FormLocation }
  early_access_signup_failed: {
    form_location: FormLocation
    failure_type: "validation" | "submission" | "resume_token"
  }
  survey_cta_clicked: { form_location: FormLocation }
  survey_viewed: { origin: SurveyOrigin }
  survey_started: { origin: SurveyOrigin }
  survey_validation_failed: {
    origin: SurveyOrigin
    invalid_sections: string[]
  }
  survey_submission_succeeded: { origin: SurveyOrigin }
  survey_submission_failed: { origin: SurveyOrigin; failure_type: "submission" }
}

export type AnalyticsEventName = keyof EventProperties

const MAX_ATTRIBUTION_LENGTH = 160
const SENSITIVE_PROPERTY_NAMES = new Set([
  "email",
  "$email",
  "name",
  "$name",
  "answers",
  "survey_answers",
  "resume",
  "resume_token",
  "resumeToken",
])
const URL_PROPERTY_NAMES = new Set([
  "$current_url",
  "$referrer",
  "$session_entry_url",
  "$session_entry_referrer",
  "$initial_current_url",
  "$initial_referrer",
])

let initialized = false
let configured = false
let firstTouch: AcquisitionTouch | null = null
let latestTouch: AcquisitionTouch | null = null

function trimValue(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed.slice(0, MAX_ATTRIBUTION_LENGTH) : undefined
}

function parseAcquisition(url: URL): AcquisitionTouch | null {
  const params = url.searchParams
  const touch: AcquisitionTouch = {
    utm_source: trimValue(params.get("utm_source")),
    utm_medium: trimValue(params.get("utm_medium")),
    utm_campaign: trimValue(params.get("utm_campaign")),
    utm_term: trimValue(params.get("utm_term")),
    utm_content: trimValue(params.get("utm_content")),
    landing_path: url.pathname,
  }

  const hasUtm = Object.keys(touch).some(
    (key) => key.startsWith("utm_") && Boolean(touch[key as keyof AcquisitionTouch]),
  )
  return hasUtm ? touch : null
}

function referringDomain() {
  if (!document.referrer) return undefined

  try {
    const referrer = new URL(document.referrer)
    if (referrer.origin === window.location.origin) return undefined
    return trimValue(referrer.hostname)
  } catch {
    return undefined
  }
}

function updateAcquisition(url: URL) {
  const touch = parseAcquisition(url)
  if (touch) {
    touch.referring_domain = referringDomain()
    if (!firstTouch) firstTouch = touch
    latestTouch = touch
    return
  }

  if (!firstTouch) {
    const domain = referringDomain()
    if (domain) {
      firstTouch = { referring_domain: domain, landing_path: url.pathname }
      latestTouch = firstTouch
    }
  }
}

function acquisitionProperties(): Properties {
  const properties: Properties = {}
  const addTouch = (prefix: "first_touch" | "latest_touch", touch: AcquisitionTouch | null) => {
    if (!touch) return
    for (const [key, value] of Object.entries(touch)) {
      if (value) properties[`${prefix}_${key}`] = value
    }
  }

  addTouch("first_touch", firstTouch)
  addTouch("latest_touch", latestTouch)
  return properties
}

function sanitizeUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined

  try {
    const origin = typeof window === "undefined" ? "https://miora.invalid" : window.location.origin
    const url = new URL(value, origin)
    return `${url.origin}${url.pathname}`
  } catch {
    return value.split(/[?#]/, 1)[0]
  }
}

export function sanitizeEventForTransport(event: Parameters<BeforeSendFn>[0]) {
  if (!event) return null

  const sanitizeProperties = (source: Properties | undefined) => {
    if (!source) return undefined

    const properties = { ...source }
    for (const key of Object.keys(properties)) {
      if (URL_PROPERTY_NAMES.has(key)) {
        const sanitized = sanitizeUrl(properties[key])
        if (sanitized) properties[key] = sanitized
      }
      if (SENSITIVE_PROPERTY_NAMES.has(key)) delete properties[key]
    }
    return properties
  }

  const properties = sanitizeProperties(event.properties) ?? {}
  const set = sanitizeProperties(event.$set)
  const setOnce = sanitizeProperties(event.$set_once)

  return {
    ...event,
    properties,
    ...(set ? { $set: set } : {}),
    ...(setOnce ? { $set_once: setOnce } : {}),
  }
}

const beforeSend: BeforeSendFn = sanitizeEventForTransport

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return
  initialized = true

  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  if (!token) return

  configured = true
  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    defaults: "2026-08-30",
    cookieless_mode: "always",
    persistence: "memory",
    person_profiles: "never",
    mask_personal_data_properties: true,
    disable_capture_url_hashes: true,
    get_current_url: (defaultUrl) => sanitizeUrl(defaultUrl) ?? defaultUrl,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    capture_heatmaps: false,
    capture_exceptions: false,
    capture_performance: false,
    capture_dead_clicks: false,
    rageclick: false,
    disable_session_recording: true,
    disable_surveys: true,
    respect_dnt: true,
    property_denylist: [...SENSITIVE_PROPERTY_NAMES],
    before_send: beforeSend,
  })
}

export function captureEvent<T extends AnalyticsEventName>(
  event: T,
  properties: EventProperties[T],
) {
  initAnalytics()
  if (!configured) return

  posthog.capture(event, {
    schema_version: 1,
    ...acquisitionProperties(),
    ...properties,
  })
}

export function capturePageview(pathname: string) {
  initAnalytics()
  if (!configured) return

  const url = new URL(window.location.href)
  updateAcquisition(url)

  const pageName =
    pathname === "/" ? "landing" : pathname === "/survey" ? "survey" : "other"

  posthog.capture("$pageview", {
    schema_version: 1,
    page_name: pageName,
    pathname,
    ...acquisitionProperties(),
  })
}
