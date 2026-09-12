"use server"

import { registerEmail, saveSurvey } from "@/lib/notion"
import { normalizeEmail, validateEmail, validateSurvey, type SurveyErrors, type SurveySubmissionInput } from "@/lib/survey"

export type ActionResult = {
  ok: boolean
  email?: string
  errors?: SurveyErrors
  message?: string
}

export async function submitLandingEmail(email: string): Promise<ActionResult> {
  const normalized = normalizeEmail(email)
  if (!validateEmail(normalized)) return { ok: false, errors: { email: "Enter a valid email address." } }
  try {
    await registerEmail(normalized)
    return { ok: true, email: normalized }
  } catch (error) {
    console.error("Landing signup failed", error)
    return { ok: false, message: "We couldn't save your email. Please try again." }
  }
}

export async function submitSurvey(input: SurveySubmissionInput, fromLanding: boolean): Promise<ActionResult> {
  const errors = validateSurvey(input)
  if (Object.keys(errors).length > 0) return { ok: false, errors }
  try {
    await saveSurvey(input, fromLanding)
    return { ok: true }
  } catch (error) {
    console.error("Survey submission failed", error)
    return { ok: false, errors: { form: "We couldn't save your response. Please try again." } }
  }
}
