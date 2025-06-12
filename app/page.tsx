import type { Metadata } from "next"
import SurveyWizard from "@/components/survey-wizard"

export const metadata: Metadata = {
  title: "Survey Normalization Tool",
  description: "Calculate normalized scores from survey responses based on demographic factors",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <SurveyWizard />
    </div>
  )
}
