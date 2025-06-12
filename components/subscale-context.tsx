"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Sex = "M" | "F"

interface NormalizationRule {
  ageMin: number
  ageMax: number
  sex: Sex
  rawScoreMin: number
  rawScoreMax: number
  normalizedScore: number
}

interface Subscale {
  id: string
  name: string
  description: string
  questions: {
    id: string
    text: string
    options: {
      text: string
      rawScore: number
    }[]
  }[]
  normalizationRules: NormalizationRule[]
}

interface SubscaleContextType {
  subscales: Subscale[]
  addSubscale: (subscale: Subscale) => void
  updateSubscale: (id: string, subscale: Partial<Subscale>) => void
  deleteSubscale: (id: string) => void
  surveyResponses: Record<string, number>
  setSurveyResponses: (responses: Record<string, number>) => void
  demographicData: {
    age: number | null
    sex: Sex | null
  }
  setDemographicData: (data: { age: number | null; sex: Sex | null }) => void
  calculatedScores: {
    rawScore: number | null
    normalizedScore: number | null
    subscaleId: string | null
  }
  calculateScores: () => void
}

const SubscaleContext = createContext<SubscaleContextType | undefined>(undefined)

export function SubscaleProvider({ children }: { children: ReactNode }) {
  const [subscales, setSubscales] = useState<Subscale[]>([
    {
      id: "anxiety",
      name: "Anxiety Assessment",
      description: "Measures anxiety levels across different situations",
      questions: [
        {
          id: "q1",
          text: "How often do you feel nervous in social situations?",
          options: [
            { text: "Never", rawScore: 1 },
            { text: "Rarely", rawScore: 2 },
            { text: "Sometimes", rawScore: 3 },
            { text: "Often", rawScore: 4 },
          ],
        },
        {
          id: "q2",
          text: "How often do you experience physical symptoms of anxiety?",
          options: [
            { text: "Never", rawScore: 1 },
            { text: "Rarely", rawScore: 2 },
            { text: "Sometimes", rawScore: 3 },
            { text: "Often", rawScore: 4 },
          ],
        },
      ],
      normalizationRules: [
        { ageMin: 13, ageMax: 17, sex: "F", rawScoreMin: 2, rawScoreMax: 4, normalizedScore: 60 },
        { ageMin: 13, ageMax: 17, sex: "F", rawScoreMin: 5, rawScoreMax: 6, normalizedScore: 75 },
        { ageMin: 13, ageMax: 17, sex: "F", rawScoreMin: 7, rawScoreMax: 8, normalizedScore: 90 },
        { ageMin: 13, ageMax: 17, sex: "M", rawScoreMin: 2, rawScoreMax: 4, normalizedScore: 50 },
        { ageMin: 13, ageMax: 17, sex: "M", rawScoreMin: 5, rawScoreMax: 6, normalizedScore: 65 },
        { ageMin: 13, ageMax: 17, sex: "M", rawScoreMin: 7, rawScoreMax: 8, normalizedScore: 80 },
        { ageMin: 18, ageMax: 99, sex: "F", rawScoreMin: 2, rawScoreMax: 4, normalizedScore: 45 },
        { ageMin: 18, ageMax: 99, sex: "F", rawScoreMin: 5, rawScoreMax: 6, normalizedScore: 60 },
        { ageMin: 18, ageMax: 99, sex: "F", rawScoreMin: 7, rawScoreMax: 8, normalizedScore: 75 },
        { ageMin: 18, ageMax: 99, sex: "M", rawScoreMin: 2, rawScoreMax: 4, normalizedScore: 40 },
        { ageMin: 18, ageMax: 99, sex: "M", rawScoreMin: 5, rawScoreMax: 6, normalizedScore: 55 },
        { ageMin: 18, ageMax: 99, sex: "M", rawScoreMin: 7, rawScoreMax: 8, normalizedScore: 70 },
      ],
    },
  ])

  const [surveyResponses, setSurveyResponses] = useState<Record<string, number>>({})
  const [demographicData, setDemographicData] = useState<{ age: number | null; sex: Sex | null }>({
    age: null,
    sex: null,
  })
  const [calculatedScores, setCalculatedScores] = useState<{
    rawScore: number | null
    normalizedScore: number | null
    subscaleId: string | null
  }>({
    rawScore: null,
    normalizedScore: null,
    subscaleId: null,
  })

  const addSubscale = (subscale: Subscale) => {
    setSubscales([...subscales, subscale])
  }

  const updateSubscale = (id: string, updatedData: Partial<Subscale>) => {
    setSubscales(subscales.map((subscale) => (subscale.id === id ? { ...subscale, ...updatedData } : subscale)))
  }

  const deleteSubscale = (id: string) => {
    setSubscales(subscales.filter((subscale) => subscale.id !== id))
  }

  const calculateScores = () => {
    if (!demographicData.age || !demographicData.sex || Object.keys(surveyResponses).length === 0) {
      return
    }

    // For simplicity, we'll just use the first subscale
    const subscale = subscales[0]

    // Calculate raw score by summing all responses
    const rawScore = Object.values(surveyResponses).reduce((sum, score) => sum + score, 0)

    // Find matching normalization rule
    const rule = subscale.normalizationRules.find(
      (rule) =>
        demographicData.age! >= rule.ageMin &&
        demographicData.age! <= rule.ageMax &&
        demographicData.sex === rule.sex &&
        rawScore >= rule.rawScoreMin &&
        rawScore <= rule.rawScoreMax,
    )

    setCalculatedScores({
      rawScore,
      normalizedScore: rule ? rule.normalizedScore : null,
      subscaleId: subscale.id,
    })
  }

  return (
    <SubscaleContext.Provider
      value={{
        subscales,
        addSubscale,
        updateSubscale,
        deleteSubscale,
        surveyResponses,
        setSurveyResponses,
        demographicData,
        setDemographicData,
        calculatedScores,
        calculateScores,
      }}
    >
      {children}
    </SubscaleContext.Provider>
  )
}

export function useSubscale() {
  const context = useContext(SubscaleContext)
  if (context === undefined) {
    throw new Error("useSubscale must be used within a SubscaleProvider")
  }
  return context
}
