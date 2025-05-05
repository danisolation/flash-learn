"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useFlashcards } from "@/components/flashcard-provider"
import { motion, AnimatePresence } from "framer-motion"
import CSVImport from "@/components/csv-import"
import Pronunciation from "@/components/pronunciation"
import { WordSuggestion } from "@/components/word-suggestion"

export default function CreatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addDeck } = useFlashcards()
  const [deckName, setDeckName] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [cards, setCards] = useState([
    { id: 1, front: "", back: "", phonetic: "", example: "" },
    { id: 2, front: "", back: "", phonetic: "", example: "" },
  ])
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)

  const handleAddCard = () => {
    setCards([...cards, { id: Date.now(), front: "", back: "", phonetic: "", example: "" }])
  }

  const handleRemoveCard = (id: number) => {
    if (cards.length <= 1) {
      toast({
        title: "Không thể xóa",
        description: "Bộ thẻ phải có ít nhất một thẻ.",
        variant: "destructive",
      })
      return
    }
    setCards(cards.filter((card) => card.id !== id))
  }

  const handleCardChange = (id: number, field: string, value: string) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, [field]: value } : card)))
  }

  const handleSaveDeck = () => {
    if (!deckName.trim()) {
      toast({
        title: "Tên bộ thẻ không được để trống",
        description: "Vui lòng nhập tên cho bộ thẻ của bạn.",
        variant: "destructive",
      })
      return
    }

    const validCards = cards.filter((card) => card.front.trim() && card.back.trim())
    if (validCards.length === 0) {
      toast({
        title: "Không có thẻ hợp lệ",
        description: "Mỗi thẻ phải có ít nhất mặt trước và mặt sau.",
        variant: "destructive",
      })
      return
    }

    const newDeck = {
      id: Date.now(),
      name: deckName,
      description: deckDescription,
      cards: validCards.map((card) => ({
        ...card,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: "new",
      })),
      createdAt: new Date().toISOString(),
    }

    addDeck(newDeck)
    toast({
      title: "Đã lưu bộ thẻ",
      description: `Bộ thẻ "${deckName}" với ${validCards.length} thẻ đã được tạo thành công.`,
    })
    router.push("/")
  }

  const handleWordSelect = (index: number, word: string, meaning: string, phonetic: string, example: string) => {
    const cardId = cards[index].id
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, front: word, back: meaning, phonetic: phonetic, example: example } : card,
      ),
    )
    setActiveCardIndex(null)
  }

  return (
    <main className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </Link>
        <div className="flex gap-2">
          <CSVImport />
          <Button onClick={handleSaveDeck}>
            <Save className="mr-2 h-4 w-4" /> Lưu bộ thẻ
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tạo bộ thẻ mới</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="deck-name">Tên bộ thẻ</Label>
            <Input
              id="deck-name"
              placeholder="Nhập tên bộ thẻ"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deck-description">Mô tả (tùy chọn)</Label>
            <Textarea
              id="deck-description"
              placeholder="Nhập mô tả cho bộ thẻ"
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Thẻ ({cards.length})</h2>

      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Thẻ {index + 1}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveCard(card.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Xóa thẻ</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeCardIndex === index && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Tra cứu từ điển</h3>
                    <WordSuggestion
                      onSelect={(word, meaning, phonetic, example) =>
                        handleWordSelect(index, word, meaning, phonetic, example)
                      }
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`front-${card.id}`}>Mặt trước (từ vựng)</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`front-${card.id}`}
                        placeholder="Nhập từ vựng"
                        value={card.front}
                        onChange={(e) => handleCardChange(card.id, "front", e.target.value)}
                        onFocus={() => setActiveCardIndex(index)}
                      />
                      {card.front && <Pronunciation text={card.front} size="sm" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`back-${card.id}`}>Mặt sau (nghĩa)</Label>
                    <Input
                      id={`back-${card.id}`}
                      placeholder="Nhập nghĩa của từ"
                      value={card.back}
                      onChange={(e) => handleCardChange(card.id, "back", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`phonetic-${card.id}`}>Phiên âm (tùy chọn)</Label>
                    <Input
                      id={`phonetic-${card.id}`}
                      placeholder="Nhập phiên âm"
                      value={card.phonetic}
                      onChange={(e) => handleCardChange(card.id, "phonetic", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`example-${card.id}`}>Ví dụ (tùy chọn)</Label>
                    <Input
                      id={`example-${card.id}`}
                      placeholder="Nhập câu ví dụ"
                      value={card.example}
                      onChange={(e) => handleCardChange(card.id, "example", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button variant="outline" className="w-full mb-8" onClick={handleAddCard}>
        <Plus className="mr-2 h-4 w-4" /> Thêm thẻ mới
      </Button>
    </main>
  )
}
