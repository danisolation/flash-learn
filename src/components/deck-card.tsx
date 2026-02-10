"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, MoreVertical, Pencil, Trash2, Clock, Flame, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import { useFlashcards } from "@/components/flashcard-provider"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Deck {
  id: number
  name: string
  description: string
  cards: any[]
  createdAt: string
  progress?: number
}

interface DeckCardProps {
  deck: Deck
}

function ProgressRing({ progress, size = 48 }: { progress: number; size?: number }) {
  const strokeWidth = 3
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
      <span className="absolute text-xs font-bold">{progress}%</span>
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

function getDifficultyBadge(cards: any[]) {
  const knownCount = cards.filter(c => c.status === "known").length
  const ratio = cards.length > 0 ? knownCount / cards.length : 0

  if (ratio >= 0.8) {
    return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Dễ</Badge>
  } else if (ratio >= 0.4) {
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Trung bình</Badge>
  } else {
    return <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Khó</Badge>
  }
}

export default function DeckCard({ deck }: DeckCardProps) {
  const { removeDeck } = useFlashcards()
  const { toast } = useToast()

  const handleDeleteDeck = () => {
    removeDeck(deck.id)
    toast({
      title: "Đã xóa bộ thẻ",
      description: `Bộ thẻ "${deck.name}" đã được xóa.`,
    })
  }

  // Calculate progress
  const knownCards = deck.cards.filter(c => c.status === "known").length
  const progress = deck.cards.length > 0 ? Math.round((knownCards / deck.cards.length) * 100) : 0

  const formattedDate = new Date(deck.createdAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const lastStudied = getLastStudiedText(deck.cards)

  return (
    <Card className="h-full flex flex-col card-hover group overflow-hidden">
      {/* Gradient accent bar */}
      <div className={cn(
        "h-1 w-full",
        progress >= 80 ? "bg-gradient-to-r from-green-400 to-emerald-500" :
        progress >= 40 ? "bg-gradient-to-r from-yellow-400 to-amber-500" :
        "bg-gradient-to-r from-blue-400 to-indigo-500"
      )} />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
              {deck.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {deck.description || "Không có mô tả"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ProgressRing progress={progress} size={44} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to={`/edit/${deck.id}`}>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                  </DropdownMenuItem>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Xóa
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này sẽ xóa vĩnh viễn bộ thẻ "{deck.name}" và tất cả các thẻ trong đó.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteDeck} className="bg-destructive text-destructive-foreground">
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 flex-grow">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              {deck.cards.length} thẻ
            </span>
            {getDifficultyBadge(deck.cards)}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {lastStudied}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {knownCards}/{deck.cards.length} đã thuộc
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link to={`/study/${deck.id}`} className="w-full">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all group-hover:shadow-lg group-hover:shadow-primary/20"
          >
            <BookOpen className="mr-2 h-4 w-4" /> Học ngay
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
