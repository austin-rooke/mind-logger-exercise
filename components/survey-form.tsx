"use client"

import type React from "react"

import { useState } from "react"
import { useSubscale } from "@/components/subscale-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

interface SurveyFormProps {
  onComplete: () => void
}

export default function SurveyForm({ onComplete }: SurveyFormProps) {
  const { subscales, surveyResponses, setSurveyResponses, demographicData, setDemographicData, calculateScores } =
    useSubscale()

  const [currentSubscaleIndex, setCurrentSubscaleIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentSubscale = subscales[currentSubscaleIndex]

  const handleResponseChange = (questionId: string, rawScore: number) => {
    setSurveyResponses({
      ...surveyResponses,
      [questionId]: rawScore,
    })

    // Clear error for this question if it exists
    if (errors[questionId]) {
      const newErrors = { ...errors }
      delete newErrors[questionId]
      setErrors(newErrors)
    }
  }

  const handleAgeChange = (value: string) => {
    const age = Number.parseInt(value)
    setDemographicData({
      ...demographicData,
      age: isNaN(age) ? null : age,
    })

    // Clear error for age if it exists
    if (errors.age) {
      const newErrors = { ...errors }
      delete newErrors.age
      setErrors(newErrors)
    }
  }

  const handleSexChange = (value: string) => {
    setDemographicData({
      ...demographicData,
      sex: value as "M" | "F",
    })

    // Clear error for sex if it exists
    if (errors.sex) {
      const newErrors = { ...errors }
      delete newErrors.sex
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Check if all questions are answered
    currentSubscale.questions.forEach((question) => {
      if (surveyResponses[question.id] === undefined) {
        newErrors[question.id] = "Please answer this question"
      }
    })

    // Check demographic data
    if (!demographicData.age) {
      newErrors.age = "Please enter your age"
    } else if (demographicData.age < 1 || demographicData.age > 99) {
      newErrors.age = "Age must be between 1 and 99"
    }

    if (!demographicData.sex) {
      newErrors.sex = "Please select your sex"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      calculateScores()
      onComplete()
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {currentSubscale.questions.map((question, index) => (
            <Card key={question.id} className="p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300 font-medium text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-medium">{question.text}</h3>
                </div>

                <RadioGroup
                  value={surveyResponses[question.id]?.toString()}
                  onValueChange={(value) => handleResponseChange(question.id, Number.parseInt(value))}
                  className="grid gap-3"
                >
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors
                        ${
                          surveyResponses[question.id] === option.rawScore
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 dark:border-violet-700"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      onClick={() => handleResponseChange(question.id, option.rawScore)}
                    >
                      <RadioGroupItem value={option.rawScore.toString()} id={`${question.id}-${optIndex}`} />
                      <Label htmlFor={`${question.id}-${optIndex}`} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {errors[question.id] && <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age (1-99)</Label>
            <Input
              id="age"
              type="number"
              min="1"
              max="99"
              value={demographicData.age || ""}
              onChange={(e) => handleAgeChange(e.target.value)}
              placeholder="Enter your age"
              className={errors.age ? "border-red-500" : ""}
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Select value={demographicData.sex || ""} onValueChange={handleSexChange}>
              <SelectTrigger id="sex" className={errors.sex ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.sex && <p className="text-red-500 text-sm">{errors.sex}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white"
          >
            Calculate Normalized Score
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
