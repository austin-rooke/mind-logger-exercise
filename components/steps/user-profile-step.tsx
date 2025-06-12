"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface UserProfile {
  age: number | null
  sex: "male" | "female" | null
}

interface UserProfileStepProps {
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void
}

export default function UserProfileStep({ userProfile, setUserProfile }: UserProfileStepProps) {
  const isComplete = userProfile.age !== null && userProfile.sex !== null

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <User className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-xl">User Profile</CardTitle>
            <CardDescription>Enter the user's age and sex for demographic-based normalization</CardDescription>
          </div>
        </div>
      </CardHeader>

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
                  sex: value as "male" | "female",
                })
              }
            >
              <SelectTrigger id="sex" className="text-lg font-medium">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
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
              {userProfile.age} year old {userProfile.sex}
            </p>
          </motion.div>
        )}

        {!isComplete && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Please enter both age and sex to proceed to the next step.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
