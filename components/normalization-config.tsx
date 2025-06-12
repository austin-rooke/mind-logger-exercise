"use client"

import { useState } from "react"
import { useSubscale } from "@/components/subscale-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Save } from "lucide-react"
import { motion } from "framer-motion"

export default function NormalizationConfig() {
  const { subscales, updateSubscale } = useSubscale()
  const [activeSubscaleId, setActiveSubscaleId] = useState(subscales[0]?.id || "")
  const [editMode, setEditMode] = useState(false)

  const activeSubscale = subscales.find((s) => s.id === activeSubscaleId)

  const [editedRules, setEditedRules] = useState(activeSubscale?.normalizationRules || [])

  const handleAddRule = () => {
    setEditedRules([
      ...editedRules,
      {
        ageMin: 1,
        ageMax: 99,
        sex: "M" as const,
        rawScoreMin: 1,
        rawScoreMax: 10,
        normalizedScore: 50,
      },
    ])
  }

  const handleRuleChange = (index: number, field: string, value: any) => {
    const newRules = [...editedRules]
    // @ts-ignore
    newRules[index][field] = value
    setEditedRules(newRules)
  }

  const handleDeleteRule = (index: number) => {
    setEditedRules(editedRules.filter((_, i) => i !== index))
  }

  const handleSaveRules = () => {
    if (activeSubscale) {
      updateSubscale(activeSubscale.id, {
        normalizationRules: editedRules,
      })
      setEditMode(false)
    }
  }

  const handleEditClick = () => {
    setEditedRules(activeSubscale?.normalizationRules || [])
    setEditMode(true)
  }

  if (!activeSubscale) {
    return <div>No subscales available</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{activeSubscale.name}</h2>
          <p className="text-slate-600 dark:text-slate-300">{activeSubscale.description}</p>
        </div>

        <div className="flex gap-2">
          {!editMode ? (
            <Button onClick={handleEditClick} variant="outline">
              Edit Rules
            </Button>
          ) : (
            <Button onClick={handleSaveRules} className="gap-2">
              <Save size={16} />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="rules">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rules">Normalization Rules</TabsTrigger>
          <TabsTrigger value="questions">Survey Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="pt-6">
          <div className="space-y-6">
            {editMode ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b dark:border-slate-700">
                        <th className="text-left py-3 px-4">Age Range</th>
                        <th className="text-left py-3 px-4">Sex</th>
                        <th className="text-left py-3 px-4">Raw Score Range</th>
                        <th className="text-left py-3 px-4">Normalized Score</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editedRules.map((rule, index) => (
                        <tr key={index} className="border-b dark:border-slate-700">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={rule.ageMin}
                                onChange={(e) => handleRuleChange(index, "ageMin", Number.parseInt(e.target.value))}
                                className="w-20"
                                min={1}
                                max={99}
                              />
                              <span>to</span>
                              <Input
                                type="number"
                                value={rule.ageMax}
                                onChange={(e) => handleRuleChange(index, "ageMax", Number.parseInt(e.target.value))}
                                className="w-20"
                                min={1}
                                max={99}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Select value={rule.sex} onValueChange={(value) => handleRuleChange(index, "sex", value)}>
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="M">Male</SelectItem>
                                <SelectItem value="F">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={rule.rawScoreMin}
                                onChange={(e) =>
                                  handleRuleChange(index, "rawScoreMin", Number.parseInt(e.target.value))
                                }
                                className="w-20"
                                min={1}
                              />
                              <span>to</span>
                              <Input
                                type="number"
                                value={rule.rawScoreMax}
                                onChange={(e) =>
                                  handleRuleChange(index, "rawScoreMax", Number.parseInt(e.target.value))
                                }
                                className="w-20"
                                min={1}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              value={rule.normalizedScore}
                              onChange={(e) =>
                                handleRuleChange(index, "normalizedScore", Number.parseInt(e.target.value))
                              }
                              className="w-24"
                              min={0}
                              max={100}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRule(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button onClick={handleAddRule} variant="outline" className="gap-2">
                  <PlusCircle size={16} />
                  Add Rule
                </Button>
              </>
            ) : (
              <div className="grid gap-6">
                {activeSubscale.normalizationRules.map((rule, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Age Range</div>
                          <div className="mt-1 font-medium">
                            {rule.ageMin} - {rule.ageMax} years
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {rule.sex === "M" ? "Male" : "Female"}
                          </div>
                          <div className="mt-1 font-medium">
                            Raw Score: {rule.rawScoreMin} - {rule.rawScoreMax}
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Normalized Score</div>
                          <div className="mt-1 font-medium">{rule.normalizedScore}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="pt-6">
          <div className="space-y-6">
            {activeSubscale.questions.map((question, index) => (
              <Card key={question.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300 text-xs font-medium">
                          {index + 1}
                        </span>
                        <span>{question.text}</span>
                      </h3>
                    </div>

                    <div className="grid gap-3 pl-8">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className="flex justify-between items-center p-3 rounded-md bg-slate-50 dark:bg-slate-800/50"
                        >
                          <span>{option.text}</span>
                          <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded text-sm font-medium">
                            Raw Score: {option.rawScore}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
