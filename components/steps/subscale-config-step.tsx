"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Settings, Calculator } from "lucide-react"
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

interface SubscaleConfig {
  name: string
  questionIds: string[]
  calculationMethod: "sum" | "average"
}

interface SubscaleConfigStepProps {
  questions: Question[]
  subscaleConfig: SubscaleConfig
  setSubscaleConfig: (config: SubscaleConfig) => void
}

export default function SubscaleConfigStep({ questions, subscaleConfig, setSubscaleConfig }: SubscaleConfigStepProps) {
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
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Subscale Configuration</CardTitle>
            <CardDescription>Choose which questions to include and how to calculate the raw score</CardDescription>
          </div>
        </div>
      </CardHeader>

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
            <Label htmlFor="calculation-method">Calculation Method</Label>
            <Select
              value={subscaleConfig.calculationMethod}
              onValueChange={(value) =>
                setSubscaleConfig({
                  ...subscaleConfig,
                  calculationMethod: value as "sum" | "average",
                })
              }
            >
              <SelectTrigger id="calculation-method">
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
            <p>No questions available. Please complete the Survey Definition step first.</p>
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
                  onClick={() => handleQuestionToggle(question.id, !subscaleConfig.questionIds.includes(question.id))}
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
                      {(["A", "B", "C", "D"] as const).map((option) => (
                        <Badge key={option} variant="outline" className="text-xs">
                          {option}: {question.scores[option]}
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
              <span className="font-medium">Subscale Configuration Complete</span>
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
              <p>
                <strong>Name:</strong> {subscaleConfig.name}
              </p>
              <p>
                <strong>Questions:</strong> {subscaleConfig.questionIds.length} selected
              </p>
              <p>
                <strong>Calculation:</strong> {subscaleConfig.calculationMethod === "sum" ? "Sum" : "Average"} of scores
              </p>
            </div>
          </motion.div>
        )}

        {!isComplete && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Please enter a subscale name and select at least one question to proceed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
