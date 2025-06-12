"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { User, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface UserProfile {
  age: number | null
  sex: "M" | "F" | null
}

interface UserProfileProps {
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void
}

export default function UserProfile({ userProfile, setUserProfile }: UserProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isComplete = userProfile.age !== null && userProfile.sex !== null

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader
        className="cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl">User Profile</CardTitle>
              <CardDescription>Capture user's age and sex for normalization</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isComplete && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
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
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (1-99)</Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="99"
                    value={userProfile.age || ""}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        age: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="Enter age"
                    className="text-center text-lg font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select
                    value={userProfile.sex || ""}
                    onValueChange={(value) =>
                      setUserProfile({
                        ...userProfile,
                        sex: value as "M" | "F",
                      })
                    }
                  >
                    <SelectTrigger id="sex" className="text-lg font-medium">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Profile Complete</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {userProfile.age} year old {userProfile.sex === "M" ? "male" : "female"}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
