"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import SurveyDefinition from "@/components/survey-definition"
import UserProfileComponent from "@/components/user-profile"
import UserAnswersComponent from "@/components/user-answers"
import SubscaleConfigComponent from "@/components/subscale-config"
import NormalizationTableComponent from "@/components/normalization-table"
import ResultsDisplayComponent from "@/components/results-display"
import { Calculator, CheckCircle, AlertCircle, BarChart3 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: string
  text: string
  options: { label: string; value: number }[]
}

interface UserProfile {
  age: number | null
  sex: "M" | "F" | null
}

interface SubscaleConfig {
  name: string
  questionIds: string[]
  calculationType: "sum" | "average"
}

interface NormalizationEntry {
  ageMin: number
  ageMax: number
  sex: "M" | "F"
  rawScoreMin: number
  rawScoreMax: number
  normalizedScore: number
}

export default function SurveyPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({ age: null, sex: null })
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})
  const [subscaleConfig, setSubscaleConfig] = useState<SubscaleConfig>({
    name: "",
    questionIds: [],
    calculationType: "sum",
  })
  const [normalizationTable, setNormalizationTable] = useState<NormalizationEntry[]>([])
  const [results, setResults] = useState<{ rawScore: number; normalizedScore: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculateScores = useCallback(() => {
    setError(null)

    // Validation
    if (!userProfile.age || !userProfile.sex) {
      setError("Please complete the user profile section")
      return
    }

    if (subscaleConfig.questionIds.length === 0) {
      setError("Please configure at least one question in the subscale")
      return
    }

    if (normalizationTable.length === 0) {
      setError("Please add normalization entries")
      return
    }

    // Check if all required questions are answered
    const missingAnswers = subscaleConfig.questionIds.filter((qId) => userAnswers[qId] === undefined)
    if (missingAnswers.length > 0) {
      setError(`Please answer all questions in the subscale. Missing: ${missingAnswers.length} question(s)`)
      return
    }

    // Calculate raw score
    const scores = subscaleConfig.questionIds.map((qId) => userAnswers[qId])
    const rawScore =
      subscaleConfig.calculationType === "sum"
        ? scores.reduce((sum, score) => sum + score, 0)
        : scores.reduce((sum, score) => sum + score, 0) / scores.length

    // Find normalization entry
    const normEntry = normalizationTable.find(
      (entry) =>
        userProfile.age! >= entry.ageMin &&
        userProfile.age! <= entry.ageMax &&
        userProfile.sex === entry.sex &&
        rawScore >= entry.rawScoreMin &&
        rawScore <= entry.rawScoreMax,
    )

    if (!normEntry) {
      setError(
        `No normalization entry found for age ${userProfile.age}, sex ${userProfile.sex}, raw score ${rawScore.toFixed(2)}`,
      )
      return
    }

    setResults({
      rawScore: Math.round(rawScore * 100) / 100,
      normalizedScore: normEntry.normalizedScore,
    })
  }, [userProfile, subscaleConfig, userAnswers, normalizationTable])

  const getCompletionStatus = () => {
    const steps = [
      { name: "Survey Definition", completed: questions.length > 0 },
      { name: "User Profile", completed: userProfile.age !== null && userProfile.sex !== null },
      { name: "Survey Answers", completed: Object.keys(userAnswers).length > 0 },
      { name: "Subscale Config", completed: subscaleConfig.questionIds.length > 0 },
      { name: "Normalization Table", completed: normalizationTable.length > 0 },
    ]

    const completedSteps = steps.filter((step) => step.completed).length
    const progress = (completedSteps / steps.length) * 100

    return { steps, progress, completedSteps }
  }

  const { steps, progress, completedSteps } = getCompletionStatus()

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Survey Normalization Tool
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Calculate normalized scores from survey responses based on demographic factors like age and sex
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Progress Overview
            </CardTitle>
            <CardDescription>Complete all sections to calculate normalized scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-slate-600">{completedSteps}/5 sections completed</span>
              </div>
              <Progress value={progress} className="h-2" />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                    )}
                    <span className="text-xs font-medium">{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <SurveyDefinition questions={questions} setQuestions={setQuestions} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <UserProfileComponent userProfile={userProfile} setUserProfile={setUserProfile} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <UserAnswersComponent questions={questions} userAnswers={userAnswers} setUserAnswers={setUserAnswers} />
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <SubscaleConfigComponent
              questions={questions}
              subscaleConfig={subscaleConfig}
              setSubscaleConfig={setSubscaleConfig}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <NormalizationTableComponent
              normalizationTable={normalizationTable}
              setNormalizationTable={setNormalizationTable}
            />
          </motion.div>
        </div>
      </div>

      {/* Calculate Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex justify-center"
      >
        <Button
          onClick={calculateScores}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
          disabled={progress < 100}
        >
          <Calculator className="mr-2 h-5 w-5" />
          Calculate Normalized Score
        </Button>
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Display */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <ResultsDisplayComponent results={results} userProfile={userProfile} subscaleConfig={subscaleConfig} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
