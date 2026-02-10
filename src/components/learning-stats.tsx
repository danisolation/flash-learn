"use client"

import { useFlashcards } from "@/components/flashcard-provider"
import { Card as CardUI, CardContent } from "@/components/ui/card"
import { Flame, Target, Zap, BookOpen, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface FlashCard {
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
  cards: FlashCard[]
  createdAt: string
  progress?: number
}

interface LearningStatsProps {
  variant?: "full" | "compact" | "mobile"
}

interface Stats {
  streak: number
  todayCards: number
  totalXp: number
  totalDecks: number
  totalCards: number
  knownCards: number
}

export default function LearningStats({ variant = "full" }: LearningStatsProps) {
  const { decks } = useFlashcards()
  const [stats, setStats] = useState<Stats>({
    streak: 0,
    todayCards: 0,
    totalXp: 0,
    totalDecks: 0,
    totalCards: 0,
    knownCards: 0,
  })

  useEffect(() => {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    let todayCards = 0
    let totalXp = 0
    let totalCards = 0
    let knownCards = 0

    decks.forEach((deck: Deck) => {
      totalCards += deck.cards.length
      deck.cards.forEach((card: FlashCard) => {
        if (card.status === "known") {
          knownCards++
          totalXp += 10
        }
        if (card.lastReviewed) {
          const reviewDate = new Date(card.lastReviewed)
          if (reviewDate >= todayStart) {
            todayCards++
          }
        }
      })
    })

    // Calculate streak from localStorage
    const savedStreak = localStorage.getItem("flashlearn-streak")
    const lastStudyDate = localStorage.getItem("flashlearn-last-study")
    const today = new Date().toDateString()
    
    let streak = savedStreak ? parseInt(savedStreak) : 0
    
    if (todayCards > 0 && lastStudyDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastStudyDate === yesterday.toDateString()) {
        streak++
      } else if (!lastStudyDate) {
        streak = 1
      } else {
        streak = 1
      }
      localStorage.setItem("flashlearn-last-study", today)
      localStorage.setItem("flashlearn-streak", streak.toString())
    }

    setStats({
      streak,
      todayCards,
      totalXp,
      totalDecks: decks.length,
      totalCards,
      knownCards,
    })
  }, [decks])

  if (variant === "compact") {
    return (
      <>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-orange-300" />
            <span className="text-sm opacity-80">Chuỗi</span>
          </div>
          <p className="text-2xl font-bold">{stats.streak} ngày</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-5 w-5 text-green-300" />
            <span className="text-sm opacity-80">Hôm nay</span>
          </div>
          <p className="text-2xl font-bold">{stats.todayCards} thẻ</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5 text-yellow-300" />
            <span className="text-sm opacity-80">Điểm XP</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalXp}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-blue-300" />
            <span className="text-sm opacity-80">Đã thuộc</span>
          </div>
          <p className="text-2xl font-bold">{stats.knownCards}</p>
        </div>
      </>
    )
  }

  if (variant === "mobile") {
    return (
      <div className="grid grid-cols-4 gap-2">
        <CardUI className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200/50 dark:border-orange-800/30">
          <CardContent className="p-3 text-center">
            <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
            <p className="text-lg font-bold">{stats.streak}</p>
            <p className="text-[10px] text-muted-foreground">Chuỗi</p>
          </CardContent>
        </CardUI>
        <CardUI className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/50 dark:border-green-800/30">
          <CardContent className="p-3 text-center">
            <Target className="h-5 w-5 mx-auto text-green-500 mb-1" />
            <p className="text-lg font-bold">{stats.todayCards}</p>
            <p className="text-[10px] text-muted-foreground">Hôm nay</p>
          </CardContent>
        </CardUI>
        <CardUI className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200/50 dark:border-yellow-800/30">
          <CardContent className="p-3 text-center">
            <Zap className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
            <p className="text-lg font-bold">{stats.totalXp}</p>
            <p className="text-[10px] text-muted-foreground">XP</p>
          </CardContent>
        </CardUI>
        <CardUI className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/50 dark:border-blue-800/30">
          <CardContent className="p-3 text-center">
            <BookOpen className="h-5 w-5 mx-auto text-blue-500 mb-1" />
            <p className="text-lg font-bold">{stats.knownCards}</p>
            <p className="text-[10px] text-muted-foreground">Thuộc</p>
          </CardContent>
        </CardUI>
      </div>
    )
  }

  // Full variant
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <CardUI className="card-hover">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.streak}</p>
              <p className="text-xs text-muted-foreground">Ngày liên tiếp</p>
            </div>
          </div>
        </CardContent>
      </CardUI>
      <CardUI className="card-hover">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.todayCards}</p>
              <p className="text-xs text-muted-foreground">Thẻ hôm nay</p>
            </div>
          </div>
        </CardContent>
      </CardUI>
      <CardUI className="card-hover">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalXp}</p>
              <p className="text-xs text-muted-foreground">Tổng XP</p>
            </div>
          </div>
        </CardContent>
      </CardUI>
      <CardUI className="card-hover">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.knownCards}/{stats.totalCards}</p>
              <p className="text-xs text-muted-foreground">Đã thuộc</p>
            </div>
          </div>
        </CardContent>
      </CardUI>
    </div>
  )
}
