"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ClipboardList, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

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

interface UserAnswer {
  questionId: string
  selectedOption: "A" | "B" | "C" | "D"
}

interface SurveyAnswersStepProps {
  questions: Question[]
  userAnswers: UserAnswer[]
  setUserAnswers: (answers: UserAnswer[]) => void
}

export default function SurveyAnswersStep({ questions, userAnswers, setUserAnswers }: SurveyAnswersStepProps) {
  const answeredCount = userAnswers.length
  const totalQuestions = questions.length

  const handleAnswerChange = (questionId: string, selectedOption: "A" | "B" | "C" | "D") => {
    const existingAnswerIndex = userAnswers.findIndex((answer) => answer.questionId === questionId)

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      const updatedAnswers = [...userAnswers]
      updatedAnswers[existingAnswerIndex] = { questionId, selectedOption }
      setUserAnswers(updatedAnswers)
    } else {
      // Add new answer
      setUserAnswers([...userAnswers, { questionId, selectedOption }])
    }
  }

  const getSelectedOption = (questionId: string): string => {
    const answer = userAnswers.find((a) => a.questionId === questionId)
    return answer ? answer.selectedOption : ""
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <ClipboardList className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Survey Answers</CardTitle>
            <CardDescription>Record which options the user selected for each question</CardDescription>
          </div>
        </div>
        {totalQuestions > 0 && (
          <div className="flex items-center gap-2 mt-4">
            <Badge
              variant="secondary"
              className={`${
                answeredCount === totalQuestions
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
              }`}
            >
              {answeredCount === totalQuestions && <CheckCircle className="h-3 w-3 mr-1" />}
              {answeredCount}/{totalQuestions} answered
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No questions available. Please complete the Survey Definition step first.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium text-sm">
                    {index + 1}
                  </div>
                  <h3 className="font-medium text-lg">{question.text}</h3>
                </div>

                <RadioGroup
                  value={getSelectedOption(question.id)}
                  onValueChange={(value) => handleAnswerChange(question.id, value as "A" | "B" | "C" | "D")}
                  className="grid gap-3"
                >
                  {(["A", "B", "C", "D"] as const).map((option) => (
                    <div
                      key={option}
                      className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all
                        ${
                          getSelectedOption(question.id) === option
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      onClick={() => handleAnswerChange(question.id, option)}
                    >
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label htmlFor={`${question.id}-${option}`} className="flex-1 cursor-pointer font-medium">
                        Option {option}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        Score: {question.scores[option]}
                      </Badge>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            ))}
          </div>
        )}

        {questions.length > 0 && answeredCount < totalQuestions && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Please answer all {totalQuestions} questions to proceed to the next step.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
