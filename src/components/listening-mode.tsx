"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Volume2, 
  VolumeX, 
  SkipForward, 
  RotateCcw, 
  Trophy,
  Ear,
  Keyboard,
  CheckCircle2,
  XCircle,
  Lightbulb
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Confetti from "@/components/confetti"

interface ListeningCard {
  id: number
  front: string
  back: string
  phonetic?: string
  example?: string
}

interface ListeningModeProps {
  cards: ListeningCard[]
  onComplete: (results: ListeningResult[]) => void
  onExit: () => void
}

interface ListeningResult {
  cardId: number
  correct: boolean
  userAnswer: string
  correctAnswer: string
  attempts: number
}

export default function ListeningMode({ cards, onComplete, onExit }: ListeningModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [results, setResults] = useState<ListeningResult[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [speed, setSpeed] = useState<number>(1)
  const [autoPlay, setAutoPlay] = useState(true)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100

  // Text-to-Speech function
  const speak = useCallback((text: string, rate: number = 1) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = rate
      utterance.pitch = 1
      
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  // Auto-play on card change
  useEffect(() => {
    if (currentCard && autoPlay && !showAnswer) {
      const timer = setTimeout(() => {
        speak(currentCard.front, speed)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, currentCard, autoPlay, speak, speed, showAnswer])

  // Focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [currentIndex])

  const handlePlayAudio = () => {
    if (currentCard) {
      speak(currentCard.front, speed)
    }
  }

  const handleSlowPlay = () => {
    if (currentCard) {
      speak(currentCard.front, 0.5)
    }
  }

  const normalizeAnswer = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
  }

  const checkAnswer = () => {
    if (!currentCard) return

    const normalizedInput = normalizeAnswer(userInput)
    const normalizedAnswer = normalizeAnswer(currentCard.front)
    const correct = normalizedInput === normalizedAnswer

    setIsCorrect(correct)
    setAttempts(prev => prev + 1)

    if (correct) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
      
      // Record result and move to next
      const result: ListeningResult = {
        cardId: currentCard.id,
        correct: true,
        userAnswer: userInput,
        correctAnswer: currentCard.front,
        attempts: attempts + 1,
      }
      setResults(prev => [...prev, result])
      
      setTimeout(() => {
        moveToNext()
      }, 1500)
    } else if (attempts >= 2) {
      // Show answer after 3 attempts
      setShowAnswer(true)
    }
  }

  const handleSkip = () => {
    if (currentCard) {
      const result: ListeningResult = {
        cardId: currentCard.id,
        correct: false,
        userAnswer: userInput,
        correctAnswer: currentCard.front,
        attempts: attempts,
      }
      setResults(prev => [...prev, result])
    }
    moveToNext()
  }

  const moveToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      resetCardState()
    } else {
      // Complete
      const finalResults = [...results]
      if (currentCard && !results.find(r => r.cardId === currentCard.id)) {
        finalResults.push({
          cardId: currentCard.id,
          correct: isCorrect || false,
          userAnswer: userInput,
          correctAnswer: currentCard.front,
          attempts: attempts,
        })
      }
      onComplete(finalResults)
    }
  }

  const resetCardState = () => {
    setUserInput("")
    setShowHint(false)
    setShowAnswer(false)
    setAttempts(0)
    setIsCorrect(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showAnswer) {
      checkAnswer()
    } else if (e.key === 'Enter' && showAnswer) {
      moveToNext()
    }
  }

  const getHint = (): string => {
    if (!currentCard) return ""
    const word = currentCard.front
    const hintLength = Math.ceil(word.length / 3)
    return word.slice(0, hintLength) + "..."
  }

  const correctCount = results.filter(r => r.correct).length

  return (
    <div className="max-w-2xl mx-auto p-4">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <Ear className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold">Chế độ nghe</h2>
            <p className="text-sm text-muted-foreground">
              Nghe và gõ từ vựng
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={onExit}
          className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20 transition-all"
        >
          Thoát
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Tiến độ: {currentIndex + 1}/{cards.length}</span>
          <span className="text-green-600">Đúng: {correctCount}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Card */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-6">
          {/* Audio Controls */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayAudio}
              disabled={isPlaying}
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center transition-all",
                "bg-gradient-to-br from-purple-500 to-indigo-600",
                "shadow-lg hover:shadow-xl",
                isPlaying && "animate-pulse"
              )}
            >
              <Volume2 className="h-10 w-10 text-white" />
            </motion.button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSlowPlay}
                disabled={isPlaying}
                className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:hover:bg-amber-900/20 transition-all"
              >
                🐢 Chậm
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayAudio}
                disabled={isPlaying}
                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 transition-all"
              >
                🔊 Phát lại
              </Button>
            </div>
          </div>

          {/* Hint */}
          {showHint && !showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4"
            >
              <Badge variant="secondary" className="text-lg px-4 py-1">
                💡 Gợi ý: {getHint()}
              </Badge>
            </motion.div>
          )}

          {/* Answer Display */}
          <AnimatePresence mode="wait">
            {showAnswer ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-3"
              >
                <div className="text-2xl font-bold text-red-500">
                  {currentCard?.front}
                </div>
                {currentCard?.phonetic && (
                  <div className="text-muted-foreground">
                    {currentCard.phonetic}
                  </div>
                )}
                <div className="text-lg">{currentCard?.back}</div>
                {currentCard?.example && (
                  <div className="text-sm text-muted-foreground italic">
                    "{currentCard.example}"
                  </div>
                )}
                <Button 
                  onClick={moveToNext} 
                  className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Tiếp tục
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Input */}
                <div className="relative">
                  <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Gõ từ bạn nghe được..."
                    className={cn(
                      "pl-10 text-lg h-12",
                      isCorrect === true && "border-green-500 bg-green-50 dark:bg-green-900/20",
                      isCorrect === false && "border-red-500 bg-red-50 dark:bg-red-900/20"
                    )}
                    disabled={isCorrect === true}
                  />
                  
                  {/* Result Icon */}
                  {isCorrect !== null && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Feedback */}
                {isCorrect === false && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 text-center"
                  >
                    Chưa đúng! Thử lại ({3 - attempts - 1} lần còn lại)
                  </motion.p>
                )}

                {/* Actions */}
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={checkAnswer} 
                    disabled={!userInput.trim()}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    Kiểm tra
                  </Button>
                  {!showHint && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowHint(true)}
                      className="hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 dark:hover:bg-yellow-900/20 transition-all"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Gợi ý
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={handleSkip}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    Bỏ qua
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Vietnamese meaning as hint */}
      <Card className="bg-muted/50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Nghĩa tiếng Việt:</p>
          <p className="font-medium">{currentCard?.back}</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Results Component
interface ListeningResultsProps {
  results: ListeningResult[]
  onRetry: () => void
  onExit: () => void
}

export function ListeningResults({ results, onRetry, onExit }: ListeningResultsProps) {
  const correctCount = results.filter(r => r.correct).length
  const accuracy = Math.round((correctCount / results.length) * 100)

  const getGrade = () => {
    if (accuracy >= 90) return { label: "Xuất sắc!", emoji: "🏆", color: "text-yellow-500" }
    if (accuracy >= 70) return { label: "Tốt lắm!", emoji: "⭐", color: "text-green-500" }
    if (accuracy >= 50) return { label: "Cố gắng thêm!", emoji: "💪", color: "text-blue-500" }
    return { label: "Cần luyện tập thêm", emoji: "📚", color: "text-orange-500" }
  }

  const grade = getGrade()

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            {grade.emoji}
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">{grade.label}</h2>
          <p className="opacity-80">Bạn đã hoàn thành bài luyện nghe</p>
        </div>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-xl">
              <p className="text-2xl font-bold text-green-600">{correctCount}</p>
              <p className="text-sm text-muted-foreground">Đúng</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-xl">
              <p className="text-2xl font-bold text-red-600">{results.length - correctCount}</p>
              <p className="text-sm text-muted-foreground">Sai</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-xl">
              <p className="text-2xl font-bold">{accuracy}%</p>
              <p className="text-sm text-muted-foreground">Độ chính xác</p>
            </div>
          </div>

          {/* Wrong answers review */}
          {results.filter(r => !r.correct).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Từ cần ôn lại:</h3>
              <div className="space-y-2">
                {results.filter(r => !r.correct).map((result, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{result.correctAnswer}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        (Bạn gõ: {result.userAnswer || "-"})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button 
              onClick={onRetry} 
              variant="outline"
              className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-900/20 transition-all"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Làm lại
            </Button>
            <Button 
              onClick={onExit}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              Hoàn thành
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
