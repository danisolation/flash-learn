"use client"

import { useEffect, useState } from "react"
import { useFlashcards } from "@/components/flashcard-provider"
import { Flame, Target, Zap, Calendar } from "lucide-react"

interface Card {
  id: number
  front: string
  back: string
  phonetic?: string
  example?: string
  status?: "known" | "unknown" | "learning"
  lastReviewed?: string
}

interface Deck {
  id: number
  name: string
  description: string
  cards: Card[]
  createdAt: string
  progress?: number
}

interface StudyStats {
  streak: number
  todayCards: number
  dailyGoal: number
  totalXp: number
  weeklyProgress: number[]
}

export function useStudyStats() {
  const { decks } = useFlashcards()
  const [stats, setStats] = useState<StudyStats>({
    streak: 0,
    todayCards: 0,
    dailyGoal: 20,
    totalXp: 0,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  })

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("flashlearn-stats")
    const today = new Date().toDateString()
    
    let currentStats: StudyStats = savedStats 
      ? JSON.parse(savedStats) 
      : {
          streak: 0,
          todayCards: 0,
          dailyGoal: 20,
          totalXp: 0,
          weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
          lastStudyDate: null,
        }

    // Calculate today's cards from deck data
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    let todayCards = 0
    let totalXp = 0

    decks.forEach((deck: Deck) => {
      deck.cards.forEach((card: Card) => {
        if (card.lastReviewed) {
          const reviewDate = new Date(card.lastReviewed)
          if (reviewDate >= todayStart) {
            todayCards++
            if (card.status === "known") {
              totalXp += 10
            } else if (card.status === "learning") {
              totalXp += 5
            }
          }
          // Count total XP
          if (card.status === "known") {
            totalXp += 10
          }
        }
      })
    })

    // Update weekly progress
    const dayOfWeek = new Date().getDay()
    const weeklyProgress = [...currentStats.weeklyProgress]
    weeklyProgress[dayOfWeek] = todayCards

    // Calculate streak
    let streak = currentStats.streak || 0
    const lastStudyDate = localStorage.getItem("flashlearn-last-study")
    
    if (todayCards > 0) {
      if (!lastStudyDate || lastStudyDate !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (lastStudyDate === yesterday.toDateString()) {
          streak++
        } else if (lastStudyDate !== today) {
          streak = 1
        }
        localStorage.setItem("flashlearn-last-study", today)
      }
    }

    const newStats = {
      ...currentStats,
      streak,
      todayCards,
      totalXp,
      weeklyProgress,
    }

    setStats(newStats)
    localStorage.setItem("flashlearn-stats", JSON.stringify(newStats))
  }, [decks])

  const updateDailyGoal = (goal: number) => {
    const newStats = { ...stats, dailyGoal: goal }
    setStats(newStats)
    localStorage.setItem("flashlearn-stats", JSON.stringify(newStats))
  }

  return { stats, updateDailyGoal }
}

interface StreakBadgeProps {
  streak: number
  size?: "sm" | "md" | "lg"
}

export function StreakBadge({ streak, size = "md" }: StreakBadgeProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  }

  return (
    <div className={`relative flex flex-col items-center justify-center ${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white font-bold shadow-lg`}>
      <Flame className={`${iconSizes[size]} animate-fire`} />
      <span className="absolute -bottom-5 text-foreground font-semibold">{streak}</span>
    </div>
  )
}

interface DailyGoalRingProps {
  current: number
  goal: number
  size?: number
}

export function DailyGoalRing({ current, goal, size = 60 }: DailyGoalRingProps) {
  const progress = Math.min((current / goal) * 100, 100)
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="progress-ring" width={size} height={size}>
        <circle
          className="text-muted/30"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary progress-ring__circle"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <Target className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold">{current}/{goal}</span>
      </div>
    </div>
  )
}

interface XpBadgeProps {
  xp: number
}

export function XpBadge({ xp }: XpBadgeProps) {
  const level = Math.floor(xp / 100) + 1
  const currentLevelXp = xp % 100

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-400/20 border border-yellow-400/30">
      <Zap className="h-4 w-4 text-yellow-500" />
      <div className="flex flex-col">
        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Lv.{level}</span>
        <span className="text-[10px] text-muted-foreground">{currentLevelXp}/100 XP</span>
      </div>
    </div>
  )
}

interface WeeklyCalendarProps {
  progress: number[]
  goal: number
}

export function WeeklyCalendar({ progress, goal }: WeeklyCalendarProps) {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
  const today = new Date().getDay()

  return (
    <div className="flex items-center gap-1">
      {days.map((day, index) => {
        const isToday = index === today
        const completed = progress[index] >= goal
        const partial = progress[index] > 0 && progress[index] < goal

        return (
          <div
            key={day}
            className={`flex flex-col items-center gap-1 p-1 rounded ${
              isToday ? "bg-primary/10" : ""
            }`}
          >
            <span className="text-[10px] text-muted-foreground">{day}</span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                completed
                  ? "bg-green-500 text-white"
                  : partial
                  ? "bg-yellow-400 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {completed ? "✓" : progress[index] || "-"}
            </div>
          </div>
        )
      })}
    </div>
  )
}
