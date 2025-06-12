"use client"

import { useEffect, useRef } from "react"
import { useSubscale } from "@/components/subscale-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { motion } from "framer-motion"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export default function ResultsVisualization() {
  const { calculatedScores, demographicData, subscales } = useSubscale()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  const subscale = subscales.find((s) => s.id === calculatedScores.subscaleId)

  useEffect(() => {
    if (chartRef.current && calculatedScores.normalizedScore !== null) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "gauge",
          data: {
            datasets: [
              {
                value: calculatedScores.normalizedScore,
                data: [25, 50, 75, 100],
                backgroundColor: ["#f87171", "#fbbf24", "#34d399", "#60a5fa"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              tooltip: {
                enabled: false,
              },
            },
            needle: {
              radiusPercentage: 2,
              widthPercentage: 3.2,
              lengthPercentage: 80,
              color: "rgba(0, 0, 0, 0.9)",
            },
            valueLabel: {
              display: true,
              formatter: (value: number) => `${value}`,
              color: "#334155",
              backgroundColor: "#f8fafc",
              borderRadius: 5,
              padding: {
                top: 10,
                bottom: 10,
              },
            },
          },
        } as any)
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [calculatedScores.normalizedScore])

  if (!calculatedScores.rawScore || !calculatedScores.normalizedScore) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium mb-2">No Results Available</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Please complete the survey to see your normalized scores.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Score Summary</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Raw Score</div>
                    <div className="text-3xl font-bold mt-1">{calculatedScores.rawScore}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                    <div className="text-sm font-medium text-violet-600 dark:text-violet-300">Normalized Score</div>
                    <div className="text-3xl font-bold mt-1 text-violet-700 dark:text-violet-300">
                      {calculatedScores.normalizedScore}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Age</div>
                    <div className="text-xl font-medium mt-1">{demographicData.age} years</div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Sex</div>
                    <div className="text-xl font-medium mt-1">{demographicData.sex === "M" ? "Male" : "Female"}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Normalized Score Visualization</h3>
            <div className="aspect-square max-w-[300px] mx-auto">
              <canvas ref={chartRef} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Interpretation</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Based on your responses and demographic information, your normalized score is{" "}
            <strong>{calculatedScores.normalizedScore}</strong> for the <strong>{subscale?.name}</strong> subscale.
          </p>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <h4 className="font-medium mb-2">What this means:</h4>
            <p className="text-slate-600 dark:text-slate-300">
              {calculatedScores.normalizedScore >= 75
                ? "Your score is in the high range compared to your demographic group. This may indicate a higher level of the measured trait."
                : calculatedScores.normalizedScore >= 50
                  ? "Your score is in the moderate range compared to your demographic group. This suggests an average level of the measured trait."
                  : "Your score is in the lower range compared to your demographic group. This may indicate a lower level of the measured trait."}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" className="gap-2">
          <ArrowLeft size={16} />
          Back to Survey
        </Button>

        <Button className="gap-2">
          <Download size={16} />
          Export Results
        </Button>
      </div>
    </motion.div>
  )
}
