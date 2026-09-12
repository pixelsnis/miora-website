"use server"

import { getSurveyByEmail, registerEmail, saveSurvey } from "@/lib/notion"
import { createSurveyResumeToken, readSurveyResumeToken } from "@/lib/survey-resume"
import {
  emptySurveySubmission,
  normalizeEmail,
  validateEmail,
  validateSurvey,
  type SurveyErrors,
  type SurveySubmissionInput,
} from "@/lib/survey"

export type ActionResult = {
  ok: boolean
  email?: string
  resumeToken?: string
  errors?: SurveyErrors
  message?: string
}

export async function submitLandingEmail(email: string): Promise<ActionResult> {
  const normalized = normalizeEmail(email)
  if (!validateEmail(normalized)) return { ok: false, errors: { email: "Enter a valid email address." } }
  try {
    const resumeToken = createSurveyResumeToken(normalized)
    await registerEmail(normalized)
    return { ok: true, email: normalized, resumeToken }
  } catch (error) {
    console.error("Landing signup failed", error)
    return { ok: false, message: "We couldn't save your email. Please try again." }
  }
}

export async function loadSurveyFromResumeToken(token: string): Promise<SurveySubmissionInput | null> {
  const email = readSurveyResumeToken(token)
  if (!email) return null

  try {
    return (await getSurveyByEmail(email)) ?? emptySurveySubmission(email)
  } catch (error) {
    console.error("Survey resume load failed", error)
    return null
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
