"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Settings, CheckCircle, Calculator } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: string
  text: string
  options: { label: string; value: number }[]
}

interface SubscaleConfig {
  name: string
  questionIds: string[]
  calculationType: "sum" | "average"
}

interface SubscaleConfigProps {
  questions: Question[]
  subscaleConfig: SubscaleConfig
  setSubscaleConfig: (config: SubscaleConfig) => void
}

export default function SubscaleConfig({ questions, subscaleConfig, setSubscaleConfig }: SubscaleConfigProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isComplete = subscaleConfig.name.trim() !== "" && subscaleConfig.questionIds.length > 0

  const handleQuestionToggle = (questionId: string, checked: boolean) => {
    const newQuestionIds = checked
      ? [...subscaleConfig.questionIds, questionId]
      : subscaleConfig.questionIds.filter((id) => id !== questionId)

    setSubscaleConfig({
      ...subscaleConfig,
      questionIds: newQuestionIds,
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
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl">Subscale Configuration</CardTitle>
              <CardDescription>Choose which questions to include and how to calculate scores</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isComplete && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Configured
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
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="subscale-name">Subscale Name</Label>
                  <Input
                    id="subscale-name"
                    value={subscaleConfig.name}
                    onChange={(e) =>
                      setSubscaleConfig({
                        ...subscaleConfig,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter subscale name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calculation-type">Calculation Method</Label>
                  <Select
                    value={subscaleConfig.calculationType}
                    onValueChange={(value) =>
                      setSubscaleConfig({
                        ...subscaleConfig,
                        calculationType: value as "sum" | "average",
                      })
                    }
                  >
                    <SelectTrigger id="calculation-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sum">Sum of scores</SelectItem>
                      <SelectItem value="average">Average of scores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No questions available. Please add questions in the Survey Definition section.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Select Questions to Include</Label>
                    <Badge variant="outline">
                      {subscaleConfig.questionIds.length}/{questions.length} selected
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {questions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer
                          ${
                            subscaleConfig.questionIds.includes(question.id)
                              ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700"
                              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          }`}
                        onClick={() =>
                          handleQuestionToggle(question.id, !subscaleConfig.questionIds.includes(question.id))
                        }
                      >
                        <Checkbox
                          id={question.id}
                          checked={subscaleConfig.questionIds.includes(question.id)}
                          onCheckedChange={(checked) => handleQuestionToggle(question.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium text-xs">
                              {index + 1}
                            </div>
                            <Label htmlFor={question.id} className="cursor-pointer font-medium">
                              {question.text}
                            </Label>
                          </div>
                          <div className="flex gap-1 ml-8">
                            {question.options.map((option, optIndex) => (
                              <Badge key={optIndex} variant="outline" className="text-xs">
                                {option.label}: {option.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 mb-2">
                    <Calculator className="h-4 w-4" />
                    <span className="font-medium">Subscale Configuration</span>
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
                    <p>
                      <strong>Name:</strong> {subscaleConfig.name}
                    </p>
                    <p>
                      <strong>Questions:</strong> {subscaleConfig.questionIds.length} selected
                    </p>
                    <p>
                      <strong>Calculation:</strong> {subscaleConfig.calculationType === "sum" ? "Sum" : "Average"} of
                      scores
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
