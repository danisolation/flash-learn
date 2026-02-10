"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Save, Trash2, Sparkles, Wand2, BookOpen, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useFlashcards } from "@/components/flashcard-provider"
import { motion, AnimatePresence } from "framer-motion"
import CSVImport from "@/components/csv-import"
import Pronunciation from "@/components/pronunciation"
import { WordSuggestion } from "@/components/word-suggestion"
import SmartWordLookup from "@/components/smart-word-lookup"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

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
      cards: validCards.map((card, index) => ({
        ...card,
        id: Date.now() + index,
        status: "unknown" as const,
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

  // Handler for smart word lookup
  const handleSmartWordAdd = (word: string, meaning: string, phonetic: string, example: string) => {
    setCards([...cards, { 
      id: Date.now(), 
      front: word, 
      back: meaning, 
      phonetic: phonetic, 
      example: example 
    }])
    toast({
      title: "Đã thêm thẻ mới",
      description: `Từ "${word}" đã được thêm vào bộ thẻ.`,
    })
  }

  const deckCategories = [
    { value: "vocabulary", label: "Từ vựng" },
    { value: "grammar", label: "Ngữ pháp" },
    { value: "idioms", label: "Thành ngữ" },
    { value: "phrases", label: "Cụm từ" },
    { value: "business", label: "Kinh doanh" },
    { value: "academic", label: "Học thuật" },
    { value: "other", label: "Khác" },
  ]

  return (
    <main className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>
        </Link>
        <div className="flex gap-2">
          <CSVImport />
          <Button onClick={handleSaveDeck} className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all">
            <Save className="h-4 w-4" /> Lưu bộ thẻ
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <Card className="mb-8 overflow-hidden border-none bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-xl relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute right-1/4 bottom-0 w-20 h-20 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>
        
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/25 backdrop-blur-sm shadow-lg">
                <Wand2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1 text-white drop-shadow-md">Tạo bộ thẻ mới</h1>
                <p className="text-white/90 text-sm md:text-base drop-shadow-sm">Sử dụng từ điển thông minh để tạo thẻ nhanh hơn</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/25 backdrop-blur-sm">
                <Languages className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Tiếng Anh</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/25 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">{cards.filter(c => c.front && c.back).length} thẻ</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deck Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Thông tin bộ thẻ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="deck-name">Tên bộ thẻ *</Label>
                <Input
                  id="deck-name"
                  placeholder="VD: Từ vựng IELTS, Business English..."
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  className="text-lg"
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

          {/* Cards Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Thẻ
              <Badge variant="secondary" className="rounded-full">{cards.length}</Badge>
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddCard}
              className="gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Plus className="h-4 w-4" /> Thêm thẻ
            </Button>
          </div>

          <AnimatePresence>
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.3 }}
              >
                <Card className={cn(
                  "mb-4 transition-all",
                  activeCardIndex === index && "ring-2 ring-primary"
                )}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <CardTitle className="text-base">
                          {card.front || "Thẻ mới"}
                        </CardTitle>
                        {card.front && card.back && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            ✓ Hoàn chỉnh
                          </Badge>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveCard(card.id)}
                        className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
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

          <Button 
            variant="outline" 
            className="w-full gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5 h-12 transition-all" 
            onClick={handleAddCard}
          >
            <Plus className="h-5 w-5" /> Thêm thẻ mới
          </Button>
        </div>

        {/* Sidebar - Smart Word Lookup */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-4">
            <SmartWordLookup onAddCard={handleSmartWordAdd} />
            
            {/* Quick Tips */}
            <Card className="mt-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
              <CardContent className="p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Mẹo tạo thẻ
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Sử dụng từ điển để tra nghĩa chính xác</li>
                  <li>• Thêm phiên âm để luyện phát âm</li>
                  <li>• Câu ví dụ giúp nhớ từ lâu hơn</li>
                  <li>• Import file CSV để thêm nhiều thẻ</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
