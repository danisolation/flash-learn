"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFlashcards } from "@/components/flashcard-provider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Calendar, Flame, Target, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyProgress {
  date: string
  cardsLearned: number
  cardsKnown: number
}

export default function StatsChart() {
  const { decks } = useFlashcards()
  const [chartType, setChartType] = useState<"weekly" | "monthly">("weekly")

  const dailyProgress = useMemo(() => {
    // Tạo dữ liệu tiến độ học tập theo ngày
    const progressData: Record<string, { cardsLearned: number; cardsKnown: number }> = {}

    // Tạo ngày trống cho tuần/tháng
    const today = new Date()
    const limit = chartType === "weekly" ? 7 : 30
    
    for (let i = limit - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      progressData[dateStr] = { cardsLearned: 0, cardsKnown: 0 }
    }

    // Lấy tất cả các thẻ có lastReviewed
    const reviewedCards = decks.flatMap((deck) =>
      deck.cards
        .filter((card) => card.lastReviewed)
        .map((card) => ({
          status: card.status,
          lastReviewed: new Date(card.lastReviewed || Date.now()),
        })),
    )

    // Nhóm theo ngày
    reviewedCards.forEach((card) => {
      const dateStr = card.lastReviewed.toISOString().split("T")[0]

      if (progressData[dateStr]) {
        progressData[dateStr].cardsLearned += 1
        if (card.status === "known") {
          progressData[dateStr].cardsKnown += 1
        }
      }
    })

    // Chuyển đổi thành mảng và sắp xếp theo ngày
    const sortedProgress = Object.entries(progressData)
      .map(([date, stats]) => ({
        date,
        cardsLearned: stats.cardsLearned,
        cardsKnown: stats.cardsKnown,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return sortedProgress
  }, [decks, chartType])

  // Tạo dữ liệu cho biểu đồ
  const { chartData, totalLearned, totalKnown, avgLearned, trend, maxCards, bestDay, currentStreak } = useMemo(() => {
    const cd = dailyProgress.map((day) => ({
      date: new Date(day.date).toLocaleDateString("vi-VN", { 
        weekday: chartType === "weekly" ? "short" : undefined, 
        day: "numeric", 
        month: chartType === "monthly" ? "numeric" : undefined 
      }),
      fullDate: new Date(day.date).toLocaleDateString("vi-VN", { 
        weekday: "long", 
        day: "numeric", 
        month: "long" 
      }),
      learned: day.cardsLearned,
      known: day.cardsKnown,
    }))

    const tl = dailyProgress.reduce((sum, day) => sum + day.cardsLearned, 0)
    const tk = dailyProgress.reduce((sum, day) => sum + day.cardsKnown, 0)
    const ad = dailyProgress.filter(d => d.cardsLearned > 0).length
    const al = ad > 0 ? Math.round(tl / ad) : 0
    const halfLength = Math.floor(dailyProgress.length / 2)
    const firstHalf = dailyProgress.slice(0, halfLength).reduce((sum, d) => sum + d.cardsLearned, 0)
    const secondHalf = dailyProgress.slice(halfLength).reduce((sum, d) => sum + d.cardsLearned, 0)
    const t = secondHalf - firstHalf
    const mc = Math.max(...cd.map(d => d.learned), 1)
    const bd = cd.reduce((best, day) => day.learned > best.learned ? day : best, cd[0])

    let cs = 0
    for (let i = dailyProgress.length - 1; i >= 0; i--) {
      if (dailyProgress[i].cardsLearned > 0) cs++
      else break
    }

    return { chartData: cd, totalLearned: tl, totalKnown: tk, avgLearned: al, trend: t, maxCards: mc, bestDay: bd, currentStreak: cs }
  }, [dailyProgress, chartType])

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getTrendText = () => {
    if (trend > 0) return "Tăng"
    if (trend < 0) return "Giảm"
    return "Ổn định"
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Thống kê học tập</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Theo dõi tiến độ của bạn
            </p>
          </div>
          <Tabs value={chartType} onValueChange={(v) => setChartType(v as "weekly" | "monthly")}>
            <TabsList className="h-8">
              <TabsTrigger value="weekly" className="text-xs px-3">
                7 ngày
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs px-3">
                30 ngày
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Tổng đã học</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalLearned}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Đã thuộc</span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalKnown}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{currentStreak} ngày</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              {getTrendIcon()}
              <span className="text-xs text-muted-foreground">Xu hướng</span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{getTrendText()}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[180px] relative">
          <div className="absolute inset-0 flex items-end gap-1">
            {chartData.map((day, i) => {
              const barHeight = maxCards > 0 ? (day.learned / maxCards) * 100 : 0
              const knownHeight = day.learned > 0 ? (day.known / day.learned) * barHeight : 0
              const isToday = i === chartData.length - 1

              return (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col items-center justify-end h-full relative group"
                >
                  {/* Tooltip */}
                  {day.learned > 0 && (
                    <div className="absolute bottom-full mb-2 z-10 bg-popover border rounded-lg shadow-lg p-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="font-medium">{day.fullDate}</p>
                      <p className="text-blue-600">Đã học: {day.learned}</p>
                      <p className="text-green-600">Đã thuộc: {day.known}</p>
                    </div>
                  )}
                  
                  {/* Bar */}
                  <div 
                    className={cn(
                      "w-full rounded-t-md transition-all duration-300 relative overflow-hidden",
                      "bg-gradient-to-t from-blue-400 to-blue-300",
                      isToday && "ring-2 ring-primary ring-offset-1",
                      "group-hover:scale-105"
                    )}
                    style={{ 
                      height: `${Math.max(barHeight, day.learned > 0 ? 10 : 0)}%`,
                      minHeight: day.learned > 0 ? '8px' : '0'
                    }}
                  >
                    {/* Known portion */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 to-green-400"
                      style={{ height: `${knownHeight}%` }}
                    />
                  </div>
                  
                  {/* Date label */}
                  <div className={cn(
                    "text-[10px] mt-1 text-center",
                    isToday ? "text-primary font-semibold" : "text-muted-foreground"
                  )}>
                    {chartType === "weekly" ? day.date : (i % 5 === 0 || i === chartData.length - 1 ? day.date : "")}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-blue-400 to-blue-300" />
            <span className="text-muted-foreground">Đang học</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-green-500 to-green-400" />
            <span className="text-muted-foreground">Đã thuộc</span>
          </div>
        </div>

        {/* Best day badge */}
        {bestDay && bestDay.learned > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Ngày học tốt nhất</span>
            </div>
            <Badge variant="secondary">
              {bestDay.fullDate} - {bestDay.learned} thẻ
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
