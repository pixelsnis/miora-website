import type { Metadata } from "next"
import SurveyForm from "./survey-form"

export const metadata: Metadata = {
  title: "Early access survey | Miora",
  description: "Tell Miora how you work with agents and project knowledge.",
}

type SurveyPageProps = {
  searchParams: Promise<{ email?: string | string[]; source?: string | string[] }>
}

export default async function SurveyPage({ searchParams }: SurveyPageProps) {
  const params = await searchParams
  const email = Array.isArray(params.email) ? params.email[0] : params.email
  const source = Array.isArray(params.source) ? params.source[0] : params.source

  return <SurveyForm initialEmail={email ?? ""} fromLanding={source === "landing"} />
}
