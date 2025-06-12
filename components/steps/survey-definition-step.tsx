"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, FileText } from "lucide-react"
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

interface SurveyDefinitionStepProps {
  questions: Question[]
  setQuestions: (questions: Question[]) => void
}

export default function SurveyDefinitionStep({ questions, setQuestions }: SurveyDefinitionStepProps) {
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    scores: { A: 1, B: 2, C: 3, D: 4 },
  })

  const addQuestion = () => {
    if (newQuestion.text.trim()) {
      const question: Question = {
        id: `q${Date.now()}`,
        text: newQuestion.text,
        scores: { ...newQuestion.scores },
      }
      setQuestions([...questions, question])
      setNewQuestion({
        text: "",
        scores: { A: 1, B: 2, C: 3, D: 4 },
      })
    }
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateScore = (option: "A" | "B" | "C" | "D", value: number) => {
    setNewQuestion({
      ...newQuestion,
      scores: { ...newQuestion.scores, [option]: value },
    })
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Survey Definition</CardTitle>
            <CardDescription>Define questions and assign numeric scores to answer options (A, B, C, D)</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add New Question */}
        <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Question
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="question-text">Question Text</Label>
              <Input
                id="question-text"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                placeholder="Enter your question here..."
                className="mt-1"
              />
            </div>

            <div>
              <Label>Answer Options & Scores</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {(["A", "B", "C", "D"] as const).map((option) => (
                  <div key={option} className="space-y-1">
                    <Label className="text-xs text-slate-500">Option {option}</Label>
                    <Input
                      type="number"
                      value={newQuestion.scores[option]}
                      onChange={(e) => updateScore(option, Number(e.target.value))}
                      className="text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={addQuestion} className="w-full" disabled={!newQuestion.text.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Existing Questions */}
        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Defined Questions</h3>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              >
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{question.text}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(["A", "B", "C", "D"] as const).map((option) => (
                    <div
                      key={option}
                      className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-sm"
                    >
                      <span className="font-medium">{option}</span>
                      <Badge variant="outline" className="text-xs">
                        {question.scores[option]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {questions.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No questions defined yet. Add your first question above to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
