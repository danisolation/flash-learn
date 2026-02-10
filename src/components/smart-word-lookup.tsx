"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  Volume2, 
  BookOpen, 
  Sparkles, 
  Plus,
  Loader2,
  ExternalLink,
  Languages
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface WordDefinition {
  word: string
  phonetic: string
  meanings: {
    partOfSpeech: string
    definitions: {
      definition: string
      example?: string
      synonyms?: string[]
    }[]
  }[]
  synonyms: string[]
  antonyms: string[]
  examples: string[]
}

interface SmartWordLookupProps {
  onAddCard?: (word: string, meaning: string, phonetic: string, example: string) => void
  compact?: boolean
}

export default function SmartWordLookup({ onAddCard, compact = false }: SmartWordLookupProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [definition, setDefinition] = useState<WordDefinition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flashlearn-recent-searches')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const searchWord = async (word: string) => {
    if (!word.trim()) return
    
    setIsLoading(true)
    setError(null)
    setDefinition(null)

    try {
      // Using Free Dictionary API
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`
      )

      if (!response.ok) {
        throw new Error('Không tìm thấy từ này')
      }

      const data = await response.json()
      const entry = data[0]

      // Extract phonetic
      let phonetic = ""
      if (entry.phonetic) {
        phonetic = entry.phonetic
      } else if (entry.phonetics?.length > 0) {
        const phoneticWithText = entry.phonetics.find((p: any) => p.text)
        if (phoneticWithText) {
          phonetic = phoneticWithText.text
        }
      }

      // Extract meanings
      const meanings = entry.meanings.map((m: any) => ({
        partOfSpeech: m.partOfSpeech,
        definitions: m.definitions.slice(0, 3).map((d: any) => ({
          definition: d.definition,
          example: d.example,
          synonyms: d.synonyms?.slice(0, 5),
        })),
      }))

      // Collect all synonyms and antonyms
      const allSynonyms: string[] = []
      const allAntonyms: string[] = []
      const allExamples: string[] = []

      entry.meanings.forEach((m: any) => {
        if (m.synonyms) allSynonyms.push(...m.synonyms)
        if (m.antonyms) allAntonyms.push(...m.antonyms)
        m.definitions.forEach((d: any) => {
          if (d.example) allExamples.push(d.example)
        })
      })

      setDefinition({
        word: entry.word,
        phonetic,
        meanings,
        synonyms: [...new Set(allSynonyms)].slice(0, 8),
        antonyms: [...new Set(allAntonyms)].slice(0, 8),
        examples: [...new Set(allExamples)].slice(0, 3),
      })

      // Save to recent searches
      const updated = [word, ...recentSearches.filter(s => s !== word)].slice(0, 10)
      setRecentSearches(updated)
      localStorage.setItem('flashlearn-recent-searches', JSON.stringify(updated))

    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchWord(searchTerm)
  }

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleAddCard = () => {
    if (!definition || !onAddCard) return
    
    const mainMeaning = definition.meanings[0]?.definitions[0]
    onAddCard(
      definition.word,
      mainMeaning?.definition || '',
      definition.phonetic || '',
      mainMeaning?.example || definition.examples[0] || ''
    )
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tra từ tiếng Anh..."
              className="pl-9"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tra"}
          </Button>
        </form>

        {definition && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-muted/50 rounded-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold">{definition.word}</span>
                <span className="text-sm text-muted-foreground">{definition.phonetic}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all"
                  onClick={() => speakWord(definition.word)}
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              </div>
              {onAddCard && (
                <Button 
                  size="sm" 
                  onClick={handleAddCard}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Plus className="h-3 w-3 mr-1" /> Thêm
                </Button>
              )}
            </div>
            <p className="text-sm">
              {definition.meanings[0]?.definitions[0]?.definition}
            </p>
            {definition.examples[0] && (
              <p className="text-xs text-muted-foreground italic">
                "{definition.examples[0]}"
              </p>
            )}
          </motion.div>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }

  return (
    <Card className="border-2 border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
            <Languages className="h-4 w-4 text-white" />
          </div>
          Từ điển thông minh
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" /> AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập từ tiếng Anh cần tra..."
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" /> Tra cứu
              </>
            )}
          </Button>
        </form>

        {/* Recent Searches */}
        {!definition && !isLoading && recentSearches.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Tìm kiếm gần đây:</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 5).map((word) => (
                <Badge
                  key={word}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => {
                    setSearchTerm(word)
                    searchWord(word)
                  }}
                >
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="text-4xl mb-2">😕</div>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Hãy thử một từ khác hoặc kiểm tra chính tả
            </p>
          </motion.div>
        )}

        {/* Definition Result */}
        <AnimatePresence mode="wait">
          {definition && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Word Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold">{definition.word}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speakWord(definition.word)}
                      className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {definition.phonetic && (
                    <p className="text-muted-foreground">{definition.phonetic}</p>
                  )}
                </div>
                {onAddCard && (
                  <Button 
                    onClick={handleAddCard} 
                    className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus className="h-4 w-4" /> Thêm vào thẻ
                  </Button>
                )}
              </div>

              {/* Meanings */}
              <div className="space-y-4">
                {definition.meanings.map((meaning, index) => (
                  <div key={index} className="space-y-2">
                    <Badge variant="secondary" className="font-normal">
                      {meaning.partOfSpeech}
                    </Badge>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      {meaning.definitions.map((def, defIndex) => (
                        <li key={defIndex} className="text-sm">
                          <span>{def.definition}</span>
                          {def.example && (
                            <p className="text-muted-foreground italic ml-5 mt-1">
                              "{def.example}"
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>

              {/* Examples */}
              {definition.examples.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Ví dụ
                  </h4>
                  <ul className="space-y-1">
                    {definition.examples.map((example, index) => (
                      <li key={index} className="text-sm italic text-muted-foreground">
                        • "{example}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Synonyms & Antonyms */}
              <div className="grid grid-cols-2 gap-4">
                {definition.synonyms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Từ đồng nghĩa</h4>
                    <div className="flex flex-wrap gap-1">
                      {definition.synonyms.map((syn) => (
                        <Badge
                          key={syn}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-muted"
                          onClick={() => {
                            setSearchTerm(syn)
                            searchWord(syn)
                          }}
                        >
                          {syn}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {definition.antonyms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Từ trái nghĩa</h4>
                    <div className="flex flex-wrap gap-1">
                      {definition.antonyms.map((ant) => (
                        <Badge
                          key={ant}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-muted"
                          onClick={() => {
                            setSearchTerm(ant)
                            searchWord(ant)
                          }}
                        >
                          {ant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
