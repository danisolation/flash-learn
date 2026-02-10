"use client";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Flame, Target, Zap, ChevronRight, Sparkles, Ear, Gamepad2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFlashcards } from "@/components/flashcard-provider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ProgressRing({ progress, size = 56 }: { progress: number; size?: number }) {
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
          className={cn(
            "progress-ring__circle",
            progress >= 80 ? "text-green-500" : progress >= 40 ? "text-yellow-500" : "text-blue-500"
          )}
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
      <span className="absolute text-sm font-bold">{progress}%</span>
    </div>
  )
}

function getLastStudiedText(cards: any[]): string {
  const reviewedCards = cards.filter(c => c.lastReviewed)
  if (reviewedCards.length === 0) return "Chưa học"
  
  const lastReview = reviewedCards.reduce((latest, card) => {
    const cardDate = new Date(card.lastReviewed)
    return cardDate > latest ? cardDate : latest
  }, new Date(0))

  const now = new Date()
  const diffMs = now.getTime() - lastReview.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Vừa xong"
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`
  return lastReview.toLocaleDateString("vi-VN")
}

// Sửa hàm tính toán tiến độ trong StudyPage
export default function StudyPage() {
  const { decks } = useFlashcards();

  // Tính toán lại tiến độ cho mỗi bộ thẻ để đảm bảo hiển thị chính xác
  const decksWithUpdatedProgress = decks.map((deck) => {
    const totalCards = deck.cards.length;
    const knownCards = deck.cards.filter(
      (card) => card.status === "known"
    ).length;
    const learningCards = deck.cards.filter(
      (card) => card.status === "learning"
    ).length;
    const progress =
      totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;

    return {
      ...deck,
      progress,
      knownCount: knownCards,
      learningCount: learningCards,
      totalCount: totalCards,
      lastStudied: getLastStudiedText(deck.cards),
    };
  });

  // Sort by last studied (most recent first) and then by progress
  const sortedDecks = [...decksWithUpdatedProgress].sort((a, b) => {
    if (a.progress < 100 && b.progress === 100) return -1;
    if (a.progress === 100 && b.progress < 100) return 1;
    return 0;
  });

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="md:hidden">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Học tập</h1>
          <p className="text-muted-foreground text-sm">
            {decks.length} bộ thẻ · {decks.reduce((sum, d) => sum + d.cards.length, 0)} thẻ tổng cộng
          </p>
        </div>
      </div>

      {/* Study Modes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none card-hover cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Flashcard</h3>
                <p className="text-sm text-white/80">Học với thẻ ghi nhớ</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-none card-hover cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Ear className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Luyện nghe</h3>
                <p className="text-sm text-white/80">Nghe và gõ từ vựng</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Link href="/game">
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-none card-hover cursor-pointer h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Trò chơi</h3>
                  <p className="text-sm text-white/80">Học qua game</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Start Suggestion */}
      {sortedDecks.length > 0 && sortedDecks[0].progress < 100 && (
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none shadow-lg overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Đề xuất tiếp tục</p>
                  <h3 className="font-semibold text-lg">{sortedDecks[0].name}</h3>
                  <p className="text-white/70 text-sm">
                    {sortedDecks[0].knownCount}/{sortedDecks[0].totalCount} thẻ đã thuộc
                  </p>
                </div>
              </div>
              <Link href={`/study/${sortedDecks[0].id}`}>
                <Button className="bg-white text-indigo-600 hover:bg-white/90">
                  Học ngay
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {sortedDecks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Bạn chưa có bộ thẻ nào</h3>
                <p className="text-muted-foreground mb-4">Tạo bộ thẻ đầu tiên để bắt đầu học</p>
              </div>
              <Link href="/create">
                <Button className="gradient-primary">Tạo bộ thẻ mới</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedDecks.map((deck) => (
            <Card key={deck.id} className="card-hover group overflow-hidden">
              <div className={cn(
                "h-1 w-full transition-all",
                deck.progress >= 100 
                  ? "bg-gradient-to-r from-green-400 to-emerald-500" 
                  : deck.progress >= 50 
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                    : "bg-gradient-to-r from-blue-400 to-indigo-500"
              )} />
              
              <div className="flex items-center p-4 gap-4">
                {/* Progress Ring */}
                <ProgressRing progress={deck.progress} />
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                        {deck.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {deck.description || "Không có mô tả"}
                      </p>
                    </div>
                    {deck.progress === 100 && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shrink-0">
                        Hoàn thành
                      </Badge>
                    )}
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {deck.totalCount} thẻ
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3.5 w-3.5 text-green-500" />
                      {deck.knownCount} thuộc
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {deck.lastStudied}
                    </span>
                  </div>
                </div>
                
                {/* Action Button */}
                <Link href={`/study/${deck.id}`} className="shrink-0">
                  <Button 
                    className={cn(
                      "transition-all",
                      deck.progress === 100 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "gradient-primary hover:shadow-lg hover:shadow-primary/20"
                    )}
                  >
                    {deck.progress === 100 ? "Ôn tập" : "Học ngay"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
