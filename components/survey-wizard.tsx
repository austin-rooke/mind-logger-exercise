"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Step Components
import SurveyDefinitionStep from "@/components/steps/survey-definition-step"
import UserProfileStep from "@/components/steps/user-profile-step"
import SurveyAnswersStep from "@/components/steps/survey-answers-step"
import SubscaleConfigStep from "@/components/steps/subscale-config-step"
import NormalizationTableStep from "@/components/steps/normalization-table-step"
import ResultsStep from "@/components/steps/results-step"

// Types
interface Question {
  id: string
  text: string
  scores: {
    A: number
    B: number
    C: number
    D: number
  }
}

interface UserProfile {
  age: number | null
  sex: "male" | "female" | null
}

interface UserAnswer {
  questionId: string
  selectedOption: "A" | "B" | "C" | "D"
}

interface SubscaleConfig {
  name: string
  questionIds: string[]
  calculationMethod: "sum" | "average"
}

interface NormalizationEntry {
  age: number
  sex: "male" | "female"
  rawScore: number
  normalizedScore: number
}

interface CalculationResult {
  rawScore: number
  normalizedScore: number | null
  error?: string
}

const STEPS = [
  { id: "definition", title: "Survey Definition", description: "Define questions and assign scores" },
  { id: "profile", title: "User Profile", description: "Enter age and sex" },
  { id: "answers", title: "Survey Answers", description: "Record user responses" },
  { id: "subscale", title: "Subscale Config", description: "Configure calculation method" },
  { id: "normalization", title: "Normalization Table", description: "Set up lookup table" },
  { id: "results", title: "Results", description: "View calculated scores" },
]

export default function SurveyWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({ age: null, sex: null })
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [subscaleConfig, setSubscaleConfig] = useState<SubscaleConfig>({
    name: "",
    questionIds: [],
    calculationMethod: "sum",
  })
  const [normalizationTable, setNormalizationTable] = useState<NormalizationEntry[]>([])
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null)

  // Validation functions for each step
  const isStepValid = useCallback(
    (stepIndex: number): boolean => {
      switch (stepIndex) {
        case 0: // Survey Definition
          return questions.length > 0
        case 1: // User Profile
          return userProfile.age !== null && userProfile.sex !== null
        case 2: // Survey Answers
          return userAnswers.length > 0
        case 3: // Subscale Config
          return subscaleConfig.name.trim() !== "" && subscaleConfig.questionIds.length > 0
        case 4: // Normalization Table
          return normalizationTable.length > 0
        case 5: // Results
          return true
        default:
          return false
      }
    },
    [questions, userProfile, userAnswers, subscaleConfig, normalizationTable],
  )

  const canProceedToStep = useCallback(
    (stepIndex: number): boolean => {
      // Can always go to first step
      if (stepIndex === 0) return true
      // Can only proceed if all previous steps are valid
      for (let i = 0; i < stepIndex; i++) {
        if (!isStepValid(i)) return false
      }
      return true
    },
    [isStepValid],
  )

  const calculateRawScore = useCallback((): number | null => {
    if (!subscaleConfig || userAnswers.length === 0) return null

    const scores: number[] = []

    for (const questionId of subscaleConfig.questionIds) {
      const answer = userAnswers.find((a) => a.questionId === questionId)
      if (!answer) return null // Missing answer

      const question = questions.find((q) => q.id === questionId)
      if (!question) return null

      const score = question.scores[answer.selectedOption]
      scores.push(score)
    }

    if (subscaleConfig.calculationMethod === "sum") {
      return scores.reduce((sum, score) => sum + score, 0)
    } else {
      // average
      const sum = scores.reduce((sum, score) => sum + score, 0)
      return Math.round((sum / scores.length) * 100) / 100 // Round to 2 decimals
    }
  }, [subscaleConfig, userAnswers, questions])

  const calculateNormalizedScore = useCallback((): CalculationResult | null => {
    // Validate all required data is present
    if (
      !userProfile.age ||
      !userProfile.sex ||
      !subscaleConfig ||
      userAnswers.length === 0 ||
      normalizationTable.length === 0
    ) {
      return {
        rawScore: 0,
        normalizedScore: null,
        error: "Missing required data for calculation",
      }
    }

    // Step 1: Calculate raw score
    const rawScore = calculateRawScore()
    if (rawScore === null) {
      return {
        rawScore: 0,
        normalizedScore: null,
        error: "Could not calculate raw score - missing answers for subscale questions",
      }
    }

    // Step 2: Find matching normalization entry
    const normEntry = normalizationTable.find(
      (entry) => entry.age === userProfile.age && entry.sex === userProfile.sex && entry.rawScore === rawScore,
    )

    // Step 3: Return result
    if (!normEntry) {
      return {
        rawScore,
        normalizedScore: null,
        error: `No matching normalized score found for age ${userProfile.age}, sex ${userProfile.sex}, raw score ${rawScore}`,
      }
    }

    return {
      rawScore,
      normalizedScore: normEntry.normalizedScore,
    }
  }, [userProfile, subscaleConfig, userAnswers, normalizationTable, calculateRawScore])

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1)

      // If moving to results step, calculate scores
      if (currentStep + 1 === 5) {
        const result = calculateNormalizedScore()
        setCalculationResult(result)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (canProceedToStep(stepIndex)) {
      setCurrentStep(stepIndex)

      // If moving to results step, calculate scores
      if (stepIndex === 5) {
        const result = calculateNormalizedScore()
        setCalculationResult(result)
      }
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <SurveyDefinitionStep questions={questions} setQuestions={setQuestions} />
      case 1:
        return <UserProfileStep userProfile={userProfile} setUserProfile={setUserProfile} />
      case 2:
        return <SurveyAnswersStep questions={questions} userAnswers={userAnswers} setUserAnswers={setUserAnswers} />
      case 3:
        return (
          <SubscaleConfigStep
            questions={questions}
            subscaleConfig={subscaleConfig}
            setSubscaleConfig={setSubscaleConfig}
          />
        )
      case 4:
        return (
          <NormalizationTableStep
            normalizationTable={normalizationTable}
            setNormalizationTable={setNormalizationTable}
          />
        )
      case 5:
        return (
          <ResultsStep
            result={calculationResult}
            userProfile={userProfile}
            subscaleConfig={subscaleConfig}
            questions={questions}
            userAnswers={userAnswers}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Survey Normalization Tool
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Follow the step-by-step process to calculate normalized scores from survey responses
        </p>
      </motion.div>

      {/* Progress Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-xl">Progress</CardTitle>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {STEPS.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  disabled={!canProceedToStep(index)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    index === currentStep
                      ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500"
                      : canProceedToStep(index)
                        ? "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700"
                        : "bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {isStepValid(index) ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                    )}
                    <span className="text-xs font-medium">{step.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center mt-8"
      >
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{STEPS[currentStep].title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{STEPS[currentStep].description}</p>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentStep === STEPS.length - 1 || !canProceedToStep(currentStep + 1)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Validation Alert */}
      {!isStepValid(currentStep) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please complete this step before proceeding to the next one.</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  )
}
