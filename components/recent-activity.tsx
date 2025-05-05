"use client"

import { useFlashcards } from "@/components/flashcard-provider"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

export default function RecentActivity() {
  const { decks } = useFlashcards()

  // Tạo danh sách các thẻ đã học gần đây
  const recentCards = decks
    .flatMap((deck) =>
      deck.cards
        .filter((card) => card.lastReviewed)
        .map((card) => ({
          deckName: deck.name,
          deckId: deck.id,
          cardId: card.id,
          front: card.front,
          back: card.back,
          status: card.status,
          lastReviewed: new Date(card.lastReviewed || Date.now()),
        })),
    )
    .sort((a, b) => b.lastReviewed.getTime() - a.lastReviewed.getTime())
    .slice(0, 5)

  if (recentCards.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Chưa có hoạt động nào</p>
          <p className="text-sm mt-2">Bắt đầu học để xem hoạt động gần đây</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {recentCards.map((activity) => (
        <Card key={`${activity.deckId}-${activity.cardId}`}>
          <CardContent className="p-4 flex items-center gap-3">
            {activity.status === "learning" && (
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            {activity.status === "known" && (
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            )}
            {activity.status === "unknown" && (
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            )}
            <div className="flex-grow">
              <p className="text-sm font-medium">
                {activity.front} - {activity.back}
              </p>
              <p className="text-xs text-muted-foreground">{activity.deckName}</p>
            </div>
            <div className="text-xs text-muted-foreground">{formatRelativeTime(activity.lastReviewed)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Vừa xong"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} phút trước`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} giờ trước`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ngày trước`
  }
}
