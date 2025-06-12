"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Database, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface NormalizationEntry {
  age: number
  sex: "male" | "female"
  rawScore: number
  normalizedScore: number
}

interface NormalizationTableStepProps {
  normalizationTable: NormalizationEntry[]
  setNormalizationTable: (table: NormalizationEntry[]) => void
}

export default function NormalizationTableStep({
  normalizationTable,
  setNormalizationTable,
}: NormalizationTableStepProps) {
  const [newEntry, setNewEntry] = useState<NormalizationEntry>({
    age: 25,
    sex: "male",
    rawScore: 4,
    normalizedScore: 50,
  })

  const addEntry = () => {
    setNormalizationTable([...normalizationTable, { ...newEntry }])
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
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Normalization Table</CardTitle>
            <CardDescription>
              Define lookup table mapping raw scores to normalized scores by demographics
            </CardDescription>
          </div>
        </div>
        {normalizationTable.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              {normalizationTable.length} entries
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add New Entry */}
        <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Normalization Entry
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Age</Label>
              <Input
                type="number"
                value={newEntry.age}
                onChange={(e) => setNewEntry({ ...newEntry, age: Number(e.target.value) })}
                min={1}
                max={99}
                className="text-center"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Sex</Label>
              <Select
                value={newEntry.sex}
                onValueChange={(value) => setNewEntry({ ...newEntry, sex: value as "male" | "female" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Raw Score</Label>
              <Input
                type="number"
                value={newEntry.rawScore}
                onChange={(e) => setNewEntry({ ...newEntry, rawScore: Number(e.target.value) })}
                className="text-center"
                step="0.01"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Normalized Score</Label>
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
        {normalizationTable.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Normalization Entries</h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-300">Age</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-300">Sex</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                      Raw Score
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
                        <Input
                          type="number"
                          value={entry.age}
                          onChange={(e) => updateEntry(index, "age", Number(e.target.value))}
                          className="w-20 h-8 text-xs text-center"
                          min={1}
                          max={99}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Select value={entry.sex} onValueChange={(value) => updateEntry(index, "sex", value)}>
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="number"
                          value={entry.rawScore}
                          onChange={(e) => updateEntry(index, "rawScore", Number(e.target.value))}
                          className="w-20 h-8 text-xs text-center"
                          step="0.01"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="number"
                          value={entry.normalizedScore}
                          onChange={(e) => updateEntry(index, "normalizedScore", Number(e.target.value))}
                          className="w-24 h-8 text-xs text-center"
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
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No normalization entries yet. Add your first entry above to get started.</p>
          </div>
        )}

        {normalizationTable.length === 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Please add at least one normalization entry to proceed to the results.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
