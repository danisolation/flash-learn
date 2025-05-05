"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFlashcards } from "@/components/flashcard-provider"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Pronunciation from "@/components/pronunciation"

interface SearchResult {
  deckId: number
  deckName: string
  cardId: number
  front: string
  back: string
  phonetic?: string
}

export default function SearchBar() {
  const { decks } = useFlashcards()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (query.trim().length >= 2) {
      const searchResults: SearchResult[] = []

      decks.forEach((deck) => {
        deck.cards.forEach((card) => {
          if (
            card.front.toLowerCase().includes(query.toLowerCase()) ||
            card.back.toLowerCase().includes(query.toLowerCase())
          ) {
            searchResults.push({
              deckId: deck.id,
              deckName: deck.name,
              cardId: card.id,
              front: card.front,
              back: card.back,
              phonetic: card.phonetic,
            })
          }
        })
      })

      setResults(searchResults)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [query, decks])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Tìm kiếm từ vựng..."
          className="pl-10 pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) {
              setShowResults(true)
            }
          }}
        />
        {query && (
          <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={clearSearch}>
            <X className="h-4 w-4" />
            <span className="sr-only">Xóa tìm kiếm</span>
          </Button>
        )}
      </form>

      {showResults && (
        <Card className="absolute z-50 w-full mt-1 max-h-[300px] overflow-y-auto shadow-lg">
          <CardContent className="p-2">
            {results.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">Không tìm thấy kết quả</p>
            ) : (
              <ul className="space-y-1">
                {results.map((result, index) => (
                  <li key={`${result.deckId}-${result.cardId}-${index}`}>
                    <Link href={`/study/${result.deckId}`}>
                      <div className="p-2 hover:bg-muted rounded-md flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{result.front}</span>
                            {result.phonetic && (
                              <span className="text-xs text-muted-foreground">{result.phonetic}</span>
                            )}
                            <Pronunciation text={result.front} size="sm" />
                          </div>
                          <div className="text-sm text-muted-foreground">{result.back}</div>
                          <div className="text-xs text-muted-foreground mt-1">Bộ thẻ: {result.deckName}</div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
