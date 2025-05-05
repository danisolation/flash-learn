"use client"

import { useFlashcards } from "@/components/flashcard-provider"

export const useDecks = () => {
  const { decks } = useFlashcards()
  return { decks }
}
