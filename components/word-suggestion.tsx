"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Volume2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DictionaryResponse {
  word: string
  phonetic?: string
  phonetics: {
    text?: string
    audio?: string
  }[]
  meanings: {
    partOfSpeech: string
    definitions: {
      definition: string
      example?: string
    }[]
  }[]
}

interface WordSuggestionProps {
  onSelect: (word: string, meaning: string, phonetic: string, example: string) => void
}

export function WordSuggestion({ onSelect }: WordSuggestionProps) {
  const [word, setWord] = useState("")
  const [data, setData] = useState<DictionaryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const fetchWordData = async () => {
    if (!word.trim()) return

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`)

      if (!response.ok) {
        throw new Error("Không tìm thấy từ này")
      }

      const data = await response.json()
      if (data && data.length > 0) {
        setData(data[0])

        // Tìm URL âm thanh
        const phonetics = data[0].phonetics || []
        const audioPhonetic = phonetics.find((p) => p.audio && p.audio.length > 0)
        setAudioUrl(audioPhonetic?.audio || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi")
    } finally {
      setLoading(false)
    }
  }

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play().catch((e) => console.error("Không thể phát âm thanh:", e))
    }
  }

  const handleSelectMeaning = (meaning: string, partOfSpeech: string, example = "") => {
    const phonetic = data?.phonetic || data?.phonetics?.[0]?.text || ""
    onSelect(word, `${partOfSpeech}: ${meaning}`, phonetic, example)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Nhập từ tiếng Anh cần tra cứu"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWordData()}
          className="flex-1"
        />
        <Button onClick={fetchWordData} disabled={loading || !word.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Tra cứu"}
        </Button>
      </div>

      {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</div>}

      {data && (
        <Card className="overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{data.word}</h3>
                {data.phonetic && <p className="text-gray-500">{data.phonetic}</p>}
              </div>
              {audioUrl && (
                <Button variant="outline" size="icon" onClick={playAudio} title="Phát âm">
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {data.meanings.map((meaning, idx) => (
                <div key={idx} className="space-y-2">
                  <Badge variant="outline">{meaning.partOfSpeech}</Badge>

                  <ul className="space-y-2">
                    {meaning.definitions.slice(0, 3).map((def, defIdx) => (
                      <li key={defIdx} className="space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm">{def.definition}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleSelectMeaning(def.definition, meaning.partOfSpeech, def.example || "")}
                          >
                            Chọn
                          </Button>
                        </div>
                        {def.example && <p className="text-xs text-gray-500 italic">"{def.example}"</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
