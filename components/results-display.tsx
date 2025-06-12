"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Download, Share, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

interface UserProfile {
  age: number | null
  sex: "M" | "F" | null
}

interface SubscaleConfig {
  name: string
  questionIds: string[]
  calculationType: "sum" | "average"
}

interface ResultsDisplayProps {
  results: {
    rawScore: number
    normalizedScore: number
  }
  userProfile: UserProfile
  subscaleConfig: SubscaleConfig
}

export default function ResultsDisplay({ results, userProfile, subscaleConfig }: ResultsDisplayProps) {
  const getScoreInterpretation = (score: number) => {
    if (score >= 80)
      return {
        level: "High",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        description: "Significantly above average",
      }
    if (score >= 60)
      return {
        level: "Above Average",
        color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
        description: "Moderately above average",
      }
    if (score >= 40)
      return {
        level: "Average",
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        description: "Within normal range",
      }
    if (score >= 20)
      return {
        level: "Below Average",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        description: "Moderately below average",
      }
    return {
      level: "Low",
      color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
      description: "Significantly below average",
    }
  }

  const interpretation = getScoreInterpretation(results.normalizedScore)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl">Normalization Results</CardTitle>
          </div>
          <CardDescription className="text-lg">Calculated scores for {subscaleConfig.name}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Score Display */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">Raw Score</h3>
              <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">{results.rawScore}</div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subscaleConfig.calculationType === "sum" ? "Sum" : "Average"} of selected responses
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30"
            >
              <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">Normalized Score</h3>
              <div className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-2">{results.normalizedScore}</div>
              <Badge className={interpretation.color}>{interpretation.level}</Badge>
            </motion.div>
          </div>

          {/* Score Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50"
          >
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Score Distribution
            </h3>

            <div className="relative">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>

              <div className="h-8 bg-gradient-to-r from-green-200 via-yellow-200 via-orange-200 to-red-200 dark:from-green-800 dark:via-yellow-800 dark:via-orange-800 dark:to-red-800 rounded-full relative">
                <motion.div
                  initial={{ left: "0%" }}
                  animate={{ left: `${results.normalizedScore}%` }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                  className="absolute top-0 w-4 h-8 bg-blue-600 rounded-full transform -translate-x-2 shadow-lg"
                />
              </div>

              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mt-2">
                <span>Low</span>
                <span>Below Avg</span>
                <span>Average</span>
                <span>Above Avg</span>
                <span>High</span>
              </div>
            </div>
          </motion.div>

          {/* Demographics & Interpretation */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h3 className="text-lg font-medium mb-4">Demographics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Age:</span>
                  <span className="font-medium">{userProfile.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Sex:</span>
                  <span className="font-medium">{userProfile.sex === "M" ? "Male" : "Female"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Subscale:</span>
                  <span className="font-medium">{subscaleConfig.name}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <h3 className="text-lg font-medium mb-4">Interpretation</h3>
              <div className="space-y-3">
                <Badge className={`${interpretation.color} text-sm px-3 py-1`}>{interpretation.level}</Badge>
                <p className="text-slate-600 dark:text-slate-300">{interpretation.description}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  This score is based on normalization data for {userProfile.sex === "M" ? "males" : "females"}
                  aged {userProfile.age} years.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center pt-6 border-t border-slate-200 dark:border-slate-700"
          >
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Results
            </Button>
            <Button variant="outline" className="gap-2">
              <Share className="h-4 w-4" />
              Share Results
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <TrendingUp className="h-4 w-4" />
              View Detailed Analysis
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
