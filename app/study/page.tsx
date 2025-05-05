"use client"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useFlashcards } from "@/components/flashcard-provider"

// Đảm bảo hiển thị tiến độ chính xác trên trang danh sách bộ thẻ
export default function StudyPage() {
  const { decks } = useFlashcards()

  // Tính toán lại tiến độ cho mỗi bộ thẻ để đảm bảo hiển thị chính xác
  const decksWithUpdatedProgress = decks.map((deck) => {
    const totalCards = deck.cards.length
    const knownCards = deck.cards.filter((card) => card.status === "known").length
    const progress = totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0
    return {
      ...deck,
      progress,
    }
  })

  return (
    <main className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Chọn bộ thẻ để học</h1>

      {decksWithUpdatedProgress.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Bạn chưa có bộ thẻ nào</p>
          <Link href="/create">
            <Button>Tạo bộ thẻ mới</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {decksWithUpdatedProgress.map((deck) => (
            <Card key={deck.id}>
              <CardHeader className="pb-2">
                <CardTitle>{deck.name}</CardTitle>
                <CardDescription>{deck.description || "Không có mô tả"}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">{deck.cards.length} thẻ</p>
                {deck.progress !== undefined && (
                  <div className="mt-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${deck.progress}%` }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Tiến độ: {deck.progress}%</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/study/${deck.id}`} className="w-full">
                  <Button className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" /> Học ngay
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
