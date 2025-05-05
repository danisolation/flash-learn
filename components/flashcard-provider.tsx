"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

interface Card {
  id: number;
  front: string;
  back: string;
  phonetic?: string;
  example?: string;
  status?: "known" | "unknown" | "learning";
  lastReviewed?: string;
}

interface Deck {
  id: number;
  name: string;
  description: string;
  cards: Card[];
  createdAt: string;
  progress?: number;
}

interface FlashcardContextType {
  decks: Deck[];
  addDeck: (deck: Deck) => void;
  updateDeck: (id: number, updatedDeck: Partial<Deck>) => void;
  removeDeck: (id: number) => void;
  updateCardStatus: (
    cardId: number,
    status: "known" | "unknown" | "learning"
  ) => void;
  updateDeckProgress: (deckId: number, progress: number) => void;
  importData: (decks: Deck[]) => void;
  clearAllData: () => void;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined
);

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedDecks = localStorage.getItem("flashcards-decks");
    if (savedDecks) {
      try {
        setDecks(JSON.parse(savedDecks));
      } catch (error) {
        console.error("Error parsing saved decks:", error);
      }
    } else {
      // Add sample deck for first-time users
      const sampleDeck = {
        id: 1,
        name: "Từ vựng cơ bản",
        description: "Bộ thẻ mẫu với các từ vựng tiếng Anh cơ bản",
        cards: [
          {
            id: 1,
            front: "Hello",
            back: "Xin chào",
            phonetic: "/həˈləʊ/",
            example: "Hello, how are you today?",
          },
          {
            id: 2,
            front: "Goodbye",
            back: "Tạm biệt",
            phonetic: "/ˌɡʊdˈbaɪ/",
            example: "Goodbye, see you tomorrow!",
          },
          {
            id: 3,
            front: "Thank you",
            back: "Cảm ơn",
            phonetic: "/ˈθæŋk juː/",
            example: "Thank you for your help.",
          },
        ],
        createdAt: new Date().toISOString(),
        progress: 0,
      };
      setDecks([sampleDeck]);
    }
  }, []);

  // Save to localStorage whenever decks change
  useEffect(() => {
    localStorage.setItem("flashcards-decks", JSON.stringify(decks));
  }, [decks]);

  const addDeck = (deck: Deck) => {
    setDecks((prevDecks) => [...prevDecks, deck]);
  };

  const updateDeck = (id: number, updatedDeck: Partial<Deck>) => {
    setDecks((prevDecks) =>
      prevDecks.map((deck) =>
        deck.id === id ? { ...deck, ...updatedDeck } : deck
      )
    );
  };

  const removeDeck = (id: number) => {
    setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== id));
  };

  // Sửa hàm updateCardStatus để đảm bảo đếm chính xác số thẻ đã thuộc
  const updateCardStatus = (
    cardId: number,
    status: "known" | "unknown" | "learning"
  ) => {
    if (!cardId) {
      console.warn("updateCardStatus called with invalid cardId:", cardId);
      return;
    }

    setDecks((prevDecks) => {
      // Tìm deck chứa thẻ cần cập nhật
      let updatedDeckId = -1;
      const newDecks = prevDecks.map((deck) => {
        const updatedCards = deck.cards.map((card) => {
          if (card.id === cardId) {
            updatedDeckId = deck.id;
            return { ...card, status, lastReviewed: new Date().toISOString() };
          }
          return card;
        });

        if (deck.id === updatedDeckId) {
          return { ...deck, cards: updatedCards };
        }
        return deck;
      });

      // Cập nhật tiến độ cho deck chứa thẻ đã cập nhật
      return newDecks.map((deck) => {
        if (deck.id === updatedDeckId) {
          const totalCards = deck.cards.length;
          const knownCards = deck.cards.filter(
            (card) => card.status === "known"
          ).length;
          const progress =
            totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;
          return {
            ...deck,
            progress,
          };
        }
        return deck;
      });
    });
  };

  // Sửa hàm updateDeckProgress để tính toán chính xác hơn
  const updateDeckProgress = (deckId: number, progress: number) => {
    setDecks((prevDecks) => {
      return prevDecks.map((deck) => {
        if (deck.id === deckId) {
          // Đếm số thẻ đã thuộc thực tế
          const totalCards = deck.cards.length;
          const knownCards = deck.cards.filter(
            (card) => card.status === "known"
          ).length;
          const actualProgress =
            totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;

          console.log(
            `Deck ${deck.name}: ${knownCards}/${totalCards} thẻ đã thuộc (${actualProgress}%)`
          );

          return {
            ...deck,
            progress: actualProgress,
            knownCount: knownCards, // Thêm trường này để theo dõi số thẻ đã thuộc
            totalCount: totalCards, // Thêm trường này để theo dõi tổng số thẻ
          };
        }
        return deck;
      });
    });
  };

  const importData = (importedDecks: Deck[]) => {
    setDecks(importedDecks);
  };

  const clearAllData = () => {
    setDecks([]);
  };

  return (
    <FlashcardContext.Provider
      value={{
        decks,
        addDeck,
        updateDeck,
        removeDeck,
        updateCardStatus,
        updateDeckProgress,
        importData,
        clearAllData,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error("useFlashcards must be used within a FlashcardProvider");
  }
  return context;
}
