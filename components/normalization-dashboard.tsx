"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SurveyForm from "@/components/survey-form"
import NormalizationConfig from "@/components/normalization-config"
import ResultsVisualization from "@/components/results-visualization"
import { SubscaleProvider } from "@/components/subscale-context"

export default function NormalizationDashboard() {
  const [activeTab, setActiveTab] = useState("survey")

  return (
    <SubscaleProvider>
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            Survey Normalization System
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl text-center">
            Translate raw survey scores to normalized scores based on demographic data
          </p>
        </div>

        <Tabs defaultValue="survey" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="survey" className="text-sm sm:text-base">
                Survey
              </TabsTrigger>
              <TabsTrigger value="config" className="text-sm sm:text-base">
                Configuration
              </TabsTrigger>
              <TabsTrigger value="results" className="text-sm sm:text-base">
                Results
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid gap-8">
            <TabsContent value="survey" className="mt-0">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Survey Response</CardTitle>
                  <CardDescription>Enter survey responses, age, and sex to calculate normalized scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <SurveyForm onComplete={() => setActiveTab("results")} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="config" className="mt-0">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Normalization Configuration</CardTitle>
                  <CardDescription>Configure subscales and normalization parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <NormalizationConfig />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-0">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Normalization Results</CardTitle>
                  <CardDescription>View raw and normalized scores with visualizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResultsVisualization />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </SubscaleProvider>
  )
}
