"use client"

import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface PronunciationProps {
  text: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function Pronunciation({ text, size = "md", className = "" }: PronunciationProps) {
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)

  const speakText = () => {
    if (!text) return

    try {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel()
        setIsPlaying(false)
        return
      }

      setIsPlaying(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"

      // Tìm giọng tiếng Anh phù hợp
      const voices = speechSynthesis.getVoices()
      const englishVoice = voices.find((voice) => voice.lang.includes("en-") && voice.localService === true)

      if (englishVoice) {
        utterance.voice = englishVoice
      }

      utterance.onend = () => {
        setIsPlaying(false)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        toast({
          title: "Lỗi phát âm",
          description: "Không thể phát âm từ này.",
          variant: "destructive",
        })
      }

      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Speech synthesis error:", error)
      setIsPlaying(false)
      toast({
        title: "Không thể phát âm",
        description: "Trình duyệt của bạn không hỗ trợ tính năng phát âm.",
        variant: "destructive",
      })
    }
  }

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`${sizeClasses[size]} rounded-full hover:bg-primary/10 ${className}`}
      onClick={(e) => {
        e.stopPropagation()
        speakText()
      }}
    >
      {isPlaying ? <VolumeX className={iconSize[size]} /> : <Volume2 className={iconSize[size]} />}
      <span className="sr-only">Phát âm</span>
    </Button>
  )
}
