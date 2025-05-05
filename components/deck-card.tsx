"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, MoreVertical, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
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

interface Deck {
  id: number
  name: string
  description: string
  cards: any[]
  createdAt: string
}

interface DeckCardProps {
  deck: Deck
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

  const formattedDate = new Date(deck.createdAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{deck.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/edit/${deck.id}`} passHref>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                </DropdownMenuItem>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
                    <AlertDialogAction onClick={handleDeleteDeck}>Xóa</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{deck.description || "Không có mô tả"}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{deck.cards.length} thẻ</span>
          <span>Tạo: {formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/study/${deck.id}`} className="w-full">
          <Button variant="default" className="w-full">
            <BookOpen className="mr-2 h-4 w-4" /> Học ngay
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
