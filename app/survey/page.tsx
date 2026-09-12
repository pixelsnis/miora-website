import type { Metadata } from "next"
import SurveyForm from "./survey-form"

export const metadata: Metadata = {
  title: "Early access survey | Miora",
  description: "Tell Miora how you work with agents and project knowledge.",
}

type SurveyPageProps = {
  searchParams: Promise<{ email?: string | string[] }>
}

export default async function SurveyPage({ searchParams }: SurveyPageProps) {
  const params = await searchParams
  const email = Array.isArray(params.email) ? params.email[0] : params.email

  return <SurveyForm initialEmail={email ?? ""} />
}
