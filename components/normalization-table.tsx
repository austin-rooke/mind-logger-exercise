"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Database, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NormalizationEntry {
  ageMin: number
  ageMax: number
  sex: "M" | "F"
  rawScoreMin: number
  rawScoreMax: number
  normalizedScore: number
}

interface NormalizationTableProps {
  normalizationTable: NormalizationEntry[]
  setNormalizationTable: (table: NormalizationEntry[]) => void
}

export default function NormalizationTable({ normalizationTable, setNormalizationTable }: NormalizationTableProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [newEntry, setNewEntry] = useState<NormalizationEntry>({
    ageMin: 1,
    ageMax: 99,
    sex: "M",
    rawScoreMin: 1,
    rawScoreMax: 10,
    normalizedScore: 50,
  })

  const addEntry = () => {
    setNormalizationTable([...normalizationTable, { ...newEntry }])
    setNewEntry({
      ageMin: 1,
      ageMax: 99,
      sex: "M",
      rawScoreMin: 1,
      rawScoreMax: 10,
      normalizedScore: 50,
    })
  }

  const deleteEntry = (index: number) => {
    setNormalizationTable(normalizationTable.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, field: keyof NormalizationEntry, value: any) => {
    const updated = [...normalizationTable]
    // @ts-ignore
    updated[index][field] = value
    setNormalizationTable(updated)
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader
        className="cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-xl">Normalization Table</CardTitle>
              <CardDescription>Define lookup table mapping raw scores to normalized scores</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {normalizationTable.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {normalizationTable.length} entries
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
              {/* Add New Entry */}
              <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Normalization Entry
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Age Min</Label>
                    <Input
                      type="number"
                      value={newEntry.ageMin}
                      onChange={(e) => setNewEntry({ ...newEntry, ageMin: Number(e.target.value) })}
                      min={1}
                      max={99}
                      className="text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Age Max</Label>
                    <Input
                      type="number"
                      value={newEntry.ageMax}
                      onChange={(e) => setNewEntry({ ...newEntry, ageMax: Number(e.target.value) })}
                      min={1}
                      max={99}
                      className="text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Sex</Label>
                    <Select
                      value={newEntry.sex}
                      onValueChange={(value) => setNewEntry({ ...newEntry, sex: value as "M" | "F" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Raw Min</Label>
                    <Input
                      type="number"
                      value={newEntry.rawScoreMin}
                      onChange={(e) => setNewEntry({ ...newEntry, rawScoreMin: Number(e.target.value) })}
                      className="text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Raw Max</Label>
                    <Input
                      type="number"
                      value={newEntry.rawScoreMax}
                      onChange={(e) => setNewEntry({ ...newEntry, rawScoreMax: Number(e.target.value) })}
                      className="text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Normalized</Label>
                    <Input
                      type="number"
                      value={newEntry.normalizedScore}
                      onChange={(e) => setNewEntry({ ...newEntry, normalizedScore: Number(e.target.value) })}
                      className="text-center"
                    />
                  </div>
                </div>

                <Button onClick={addEntry} className="w-full mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </div>

              {/* Existing Entries */}
              {normalizationTable.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Normalization Entries</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                          <th className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                            Age Range
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                            Sex
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                            Raw Score Range
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                            Normalized Score
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {normalizationTable.map((entry, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-1 text-sm">
                                <Input
                                  type="number"
                                  value={entry.ageMin}
                                  onChange={(e) => updateEntry(index, "ageMin", Number(e.target.value))}
                                  className="w-16 h-8 text-xs text-center"
                                  min={1}
                                  max={99}
                                />
                                <span className="text-slate-400">-</span>
                                <Input
                                  type="number"
                                  value={entry.ageMax}
                                  onChange={(e) => updateEntry(index, "ageMax", Number(e.target.value))}
                                  className="w-16 h-8 text-xs text-center"
                                  min={1}
                                  max={99}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Select value={entry.sex} onValueChange={(value) => updateEntry(index, "sex", value)}>
                                <SelectTrigger className="w-20 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="M">M</SelectItem>
                                  <SelectItem value="F">F</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-1 text-sm">
                                <Input
                                  type="number"
                                  value={entry.rawScoreMin}
                                  onChange={(e) => updateEntry(index, "rawScoreMin", Number(e.target.value))}
                                  className="w-16 h-8 text-xs text-center"
                                />
                                <span className="text-slate-400">-</span>
                                <Input
                                  type="number"
                                  value={entry.rawScoreMax}
                                  onChange={(e) => updateEntry(index, "rawScoreMax", Number(e.target.value))}
                                  className="w-16 h-8 text-xs text-center"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="number"
                                value={entry.normalizedScore}
                                onChange={(e) => updateEntry(index, "normalizedScore", Number(e.target.value))}
                                className="w-20 h-8 text-xs text-center"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteEntry(index)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
