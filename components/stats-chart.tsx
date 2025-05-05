"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFlashcards } from "@/components/flashcard-provider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DailyProgress {
  date: string
  cardsLearned: number
  cardsKnown: number
}

export default function StatsChart() {
  const { decks } = useFlashcards()
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([])
  const [chartType, setChartType] = useState<"weekly" | "monthly">("weekly")

  useEffect(() => {
    // Tạo dữ liệu tiến độ học tập theo ngày
    const progressData: Record<string, { cardsLearned: number; cardsKnown: number }> = {}

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

      if (!progressData[dateStr]) {
        progressData[dateStr] = { cardsLearned: 0, cardsKnown: 0 }
      }

      progressData[dateStr].cardsLearned += 1
      if (card.status === "known") {
        progressData[dateStr].cardsKnown += 1
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

    // Lấy 7 ngày gần nhất nếu là weekly, 30 ngày nếu là monthly
    const limit = chartType === "weekly" ? 7 : 30
    setDailyProgress(sortedProgress.slice(-limit))
  }, [decks, chartType])

  // Tạo dữ liệu cho biểu đồ
  const chartData = dailyProgress.map((day) => ({
    date: new Date(day.date).toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" }),
    learned: day.cardsLearned,
    known: day.cardsKnown,
  }))

  // Tính tổng số thẻ đã học và đã thuộc
  const totalLearned = dailyProgress.reduce((sum, day) => sum + day.cardsLearned, 0)
  const totalKnown = dailyProgress.reduce((sum, day) => sum + day.cardsKnown, 0)

  // Tính trung bình mỗi ngày
  const avgLearned = dailyProgress.length > 0 ? Math.round(totalLearned / dailyProgress.length) : 0
  const avgKnown = dailyProgress.length > 0 ? Math.round(totalKnown / dailyProgress.length) : 0

  if (dailyProgress.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thống kê học tập</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Chưa có dữ liệu học tập</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Thống kê học tập</CardTitle>
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalLearned}</p>
            <p className="text-xs text-muted-foreground">Tổng đã học</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{totalKnown}</p>
            <p className="text-xs text-muted-foreground">Tổng đã thuộc</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-center">
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{avgLearned}</p>
            <p className="text-xs text-muted-foreground">TB mỗi ngày</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {totalLearned > 0 ? Math.round((totalKnown / totalLearned) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Tỷ lệ thuộc</p>
          </div>
        </div>

        <div className="h-[200px] relative">
          {chartData.length > 0 ? (
            <>
              <div className="absolute inset-0 flex items-end">
                {chartData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="w-full px-1 flex flex-col items-center space-y-1">
                      <div
                        className="w-full max-w-[30px] bg-green-500 rounded-t"
                        style={{ height: `${(day.known / Math.max(...chartData.map((d) => d.learned))) * 100}%` }}
                      ></div>
                      <div
                        className="w-full max-w-[30px] bg-blue-300 rounded-t"
                        style={{
                          height: `${((day.learned - day.known) / Math.max(...chartData.map((d) => d.learned))) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap">
                      {day.date}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute top-0 left-0 w-full flex justify-between px-2">
                <div className="text-xs text-muted-foreground">Đã thuộc</div>
                <div className="text-xs text-muted-foreground">Đang học</div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
