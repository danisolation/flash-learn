"use client"

import type React from "react"

import { useState } from "react"
import { Upload, AlertCircle, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useFlashcards } from "@/components/flashcard-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CSVCard {
  front: string
  back: string
  phonetic?: string
  example?: string
  status?: "valid" | "invalid" | "duplicate"
  error?: string
}

export default function CSVImport() {
  const { toast } = useToast()
  const { decks, addDeck } = useFlashcards()
  const [deckName, setDeckName] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [parsedCards, setParsedCards] = useState<CSVCard[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload")
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Kiểm tra định dạng file
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Vui lòng tải lên file CSV")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string
        const cards = parseCSV(csvText)

        if (cards.length === 0) {
          setError("Không tìm thấy dữ liệu trong file CSV")
          return
        }

        setParsedCards(cards)
        setError(null)
        setStep("preview")
      } catch (error) {
        console.error("Error parsing CSV:", error)
        setError("Không thể đọc file CSV. Vui lòng kiểm tra định dạng.")
      }
    }

    reader.onerror = () => {
      setError("Lỗi khi đọc file")
    }

    reader.readAsText(file)
  }

  const parseCSV = (csvText: string): CSVCard[] => {
    // Tách các dòng
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "")

    // Kiểm tra xem có dữ liệu không
    if (lines.length <= 1) {
      throw new Error("CSV không có dữ liệu")
    }

    // Tách header
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

    // Kiểm tra các cột bắt buộc
    if (!headers.includes("front") || !headers.includes("back")) {
      throw new Error("CSV phải có cột 'front' và 'back'")
    }

    const frontIndex = headers.indexOf("front")
    const backIndex = headers.indexOf("back")
    const phoneticIndex = headers.indexOf("phonetic")
    const exampleIndex = headers.indexOf("example")

    // Tạo danh sách thẻ
    const cards: CSVCard[] = []
    const existingFronts = new Set<string>()

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())

      if (values.length < 2) continue

      const front = values[frontIndex]
      const back = values[backIndex]

      // Kiểm tra dữ liệu hợp lệ
      if (!front || !back) {
        cards.push({
          front: front || "",
          back: back || "",
          status: "invalid",
          error: "Từ vựng và nghĩa không được để trống",
        })
        continue
      }

      // Kiểm tra trùng lặp
      if (existingFronts.has(front.toLowerCase())) {
        cards.push({
          front,
          back,
          phonetic: phoneticIndex !== -1 ? values[phoneticIndex] : undefined,
          example: exampleIndex !== -1 ? values[exampleIndex] : undefined,
          status: "duplicate",
          error: "Từ vựng bị trùng lặp",
        })
        continue
      }

      existingFronts.add(front.toLowerCase())

      cards.push({
        front,
        back,
        phonetic: phoneticIndex !== -1 ? values[phoneticIndex] : undefined,
        example: exampleIndex !== -1 ? values[exampleIndex] : undefined,
        status: "valid",
      })
    }

    return cards
  }

  const handleCreateDeck = () => {
    if (!deckName.trim()) {
      toast({
        title: "Tên bộ thẻ không được để trống",
        description: "Vui lòng nhập tên cho bộ thẻ của bạn.",
        variant: "destructive",
      })
      return
    }

    const validCards = parsedCards
      .filter((card) => card.status === "valid")
      .map((card, index) => ({
        id: Date.now() + index,
        front: card.front,
        back: card.back,
        phonetic: card.phonetic || "",
        example: card.example || "",
      }))

    if (validCards.length === 0) {
      toast({
        title: "Không có thẻ hợp lệ",
        description: "Không có thẻ hợp lệ để tạo bộ thẻ.",
        variant: "destructive",
      })
      return
    }

    const newDeck = {
      id: Date.now(),
      name: deckName,
      description: deckDescription,
      cards: validCards,
      createdAt: new Date().toISOString(),
    }

    addDeck(newDeck)
    toast({
      title: "Đã tạo bộ thẻ",
      description: `Bộ thẻ "${deckName}" với ${validCards.length} thẻ đã được tạo thành công.`,
    })

    setStep("complete")
  }

  const resetForm = () => {
    setDeckName("")
    setDeckDescription("")
    setParsedCards([])
    setError(null)
    setStep("upload")
    setIsDialogOpen(false)
  }

  const validCardsCount = parsedCards.filter((card) => card.status === "valid").length
  const invalidCardsCount = parsedCards.filter((card) => card.status !== "valid").length

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" /> Nhập từ CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nhập từ vựng từ file CSV</DialogTitle>
          <DialogDescription>Tải lên file CSV chứa danh sách từ vựng để tạo bộ thẻ mới.</DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="csv-file">File CSV</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} />
              <p className="text-xs text-muted-foreground">
                File CSV phải có các cột: front, back, phonetic (tùy chọn), example (tùy chọn)
              </p>
            </div>

            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium mb-2">Mẫu CSV:</p>
              <code className="text-xs">
                front,back,phonetic,example
                <br />
                hello,xin chào,/həˈləʊ/,"Hello, how are you?"
                <br />
                goodbye,tạm biệt,/ˌɡʊdˈbaɪ/,"Goodbye, see you later!"
              </code>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deck-name">Tên bộ thẻ</Label>
                <Input
                  id="deck-name"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder="Nhập tên bộ thẻ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deck-description">Mô tả (tùy chọn)</Label>
                <Input
                  id="deck-description"
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  placeholder="Nhập mô tả"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Xem trước ({parsedCards.length} thẻ)</h3>
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-500">{validCardsCount} hợp lệ</span>
                  {invalidCardsCount > 0 && <span className="text-red-500 ml-2">{invalidCardsCount} không hợp lệ</span>}
                </div>
              </div>

              <div className="border rounded-md max-h-[200px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Từ vựng</TableHead>
                      <TableHead>Nghĩa</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedCards.map((card, index) => (
                      <TableRow key={index}>
                        <TableCell>{card.front}</TableCell>
                        <TableCell>{card.back}</TableCell>
                        <TableCell>
                          {card.status === "valid" ? (
                            <span className="flex items-center text-green-500">
                              <Check className="h-3 w-3 mr-1" /> Hợp lệ
                            </span>
                          ) : (
                            <span className="flex items-center text-red-500">
                              <X className="h-3 w-3 mr-1" /> {card.error}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="py-6 text-center space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium">Nhập thành công!</h3>
            <p className="text-muted-foreground">
              Đã tạo bộ thẻ "{deckName}" với {validCardsCount} thẻ.
            </p>
          </div>
        )}

        <DialogFooter>
          {step === "upload" && (
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => setStep("upload")}>
                Quay lại
              </Button>
              <Button onClick={handleCreateDeck}>Tạo bộ thẻ</Button>
            </>
          )}

          {step === "complete" && <Button onClick={resetForm}>Đóng</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
