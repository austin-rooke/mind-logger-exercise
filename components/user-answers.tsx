"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ClipboardList, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: string
  text: string
  options: { label: string; value: number }[]
}

interface UserAnswersProps {
  questions: Question[]
  userAnswers: Record<string, number>
  setUserAnswers: (answers: Record<string, number>) => void
}

export default function UserAnswers({ questions, userAnswers, setUserAnswers }: UserAnswersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const answeredCount = Object.keys(userAnswers).length
  const totalQuestions = questions.length

  const handleAnswerChange = (questionId: string, value: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: value,
    })
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader
        className="cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <ClipboardList className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl">Survey Answers</CardTitle>
              <CardDescription>Record which options the user selected</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {totalQuestions > 0 && (
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
            )}
            <Button variant="ghost" size="sm">
              {isExpanded ? "−" : "+"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-6">
              {questions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No questions defined yet. Please add questions in the Survey Definition section.</p>
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
                        value={userAnswers[question.id]?.toString() || ""}
                        onValueChange={(value) => handleAnswerChange(question.id, Number(value))}
                        className="grid gap-3"
                      >
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all
                              ${
                                userAnswers[question.id] === option.value
                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700"
                                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              }`}
                            onClick={() => handleAnswerChange(question.id, option.value)}
                          >
                            <RadioGroupItem value={option.value.toString()} id={`${question.id}-${optIndex}`} />
                            <Label htmlFor={`${question.id}-${optIndex}`} className="flex-1 cursor-pointer font-medium">
                              Option {option.label}
                            </Label>
                            <Badge variant="outline" className="text-xs">
                              Score: {option.value}
                            </Badge>
                          </div>
                        ))}
                      </RadioGroup>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
