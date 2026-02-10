import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Search, Plus, SortAsc, FolderOpen, BookOpen, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFlashcards } from "@/components/flashcard-provider"
import DeckCard from "@/components/deck-card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

type SortOption = "newest" | "oldest" | "name" | "progress" | "cards"

export default function DecksPage() {
  const { decks } = useFlashcards()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  const filteredAndSortedDecks = useMemo(() => {
    let filtered = decks.filter(
      (deck) =>
        deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "name": return a.name.localeCompare(b.name)
        case "progress": {
          const pA = a.cards.length > 0 ? a.cards.filter(c => c.status === "known").length / a.cards.length : 0
          const pB = b.cards.length > 0 ? b.cards.filter(c => c.status === "known").length / b.cards.length : 0
          return pB - pA
        }
        case "cards": return b.cards.length - a.cards.length
        default: return 0
      }
    })
  }, [decks, searchQuery, sortBy])

  const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0)
  const knownCards = decks.reduce((sum, d) => sum + d.cards.filter(c => c.status === "known").length, 0)

  return (
    <main className="container max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/">
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </Link>
        <Link to="/create">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all gap-2">
            <Plus className="h-4 w-4" /> Tạo bộ thẻ mới
          </Button>
        </Link>
      </div>

      {/* Title & Stats */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3 mb-2">
          <FolderOpen className="h-7 w-7 text-primary" />
          Tất cả bộ thẻ
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary" className="rounded-full">{decks.length} bộ thẻ</Badge>
          <span>·</span>
          <span>{totalCards} thẻ tổng cộng</span>
          <span>·</span>
          <span className="text-green-600 dark:text-green-400">{knownCards} đã thuộc</span>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm bộ thẻ..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[160px]">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
            <SelectItem value="name">Tên A-Z</SelectItem>
            <SelectItem value="progress">Tiến độ</SelectItem>
            <SelectItem value="cards">Số thẻ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedDecks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 border-2 border-dashed rounded-xl"
        >
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-lg font-medium mb-2">Không tìm thấy bộ thẻ nào</p>
          <p className="text-muted-foreground mb-6">Hãy tạo bộ thẻ đầu tiên để bắt đầu học</p>
          <Link to="/create">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all gap-2">
              <Plus className="h-4 w-4" /> Tạo bộ thẻ mới
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredAndSortedDecks.map((deck, index) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DeckCard deck={deck} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  )
}
