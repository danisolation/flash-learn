"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFlashcards } from "@/components/flashcard-provider"
import DeckCard from "@/components/deck-card"

export default function DecksPage() {
  const { decks } = useFlashcards()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDecks = decks.filter(
    (deck) =>
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </Link>
        <Link href="/create">
          <Button>Tạo bộ thẻ mới</Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Tất cả bộ thẻ</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Tìm kiếm bộ thẻ..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredDecks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Không tìm thấy bộ thẻ nào</p>
          <Link href="/create">
            <Button>Tạo bộ thẻ mới</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDecks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </main>
  )
}
