import type { Metadata } from "next"
import { loadSurveyFromResumeToken } from "@/app/actions"
import SurveyForm from "./survey-form"

export const metadata: Metadata = {
  title: "Early access survey | Miora",
  description: "Tell Miora how you work with agents and project knowledge.",
}

type SurveyPageProps = {
  searchParams: Promise<{ resume?: string | string[]; source?: string | string[] }>
}

export default async function SurveyPage({ searchParams }: SurveyPageProps) {
  const params = await searchParams
  const resume = Array.isArray(params.resume) ? params.resume[0] : params.resume
  const source = Array.isArray(params.source) ? params.source[0] : params.source
  const initialSurvey = resume ? await loadSurveyFromResumeToken(resume) : null

  return (
    <SurveyForm
      initialEmail={initialSurvey?.email ?? ""}
      initialSurvey={initialSurvey ?? undefined}
      fromLanding={source === "landing"}
    />
  )
}
