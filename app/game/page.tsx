"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlashcards } from "@/components/flashcard-provider";
import { useToast } from "@/components/ui/use-toast";
import Confetti from "@/components/confetti";
import GameSelect from "./_components/game-select";
import MatchGame from "./_components/match-game";
import SpeedGame from "./_components/speed-game";
import GameComplete from "./_components/game-complete";

export default function GamePage() {
  const { decks } = useFlashcards();
  const { toast } = useToast();
  const [gameMode, setGameMode] = useState<
    "select" | "match" | "speed" | "complete"
  >("select");
  const [previousGameMode, setPreviousGameMode] = useState<"match" | "speed">("match");
  const [selectedDeck, setSelectedDeck] = useState<number | null>(null);
  const [gameCards, setGameCards] = useState<any[]>([]);
  const [matchPairs, setMatchPairs] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [speedGameCards, setSpeedGameCards] = useState<any[]>([]);
  const [currentSpeedCard, setCurrentSpeedCard] = useState(0);
  const [speedGameTime, setSpeedGameTime] = useState(60);
  const [speedGameScore, setSpeedGameScore] = useState(0);

  // Chọn bộ thẻ để chơi
  const handleSelectDeck = (deckId: number) => {
    const deck = decks.find((d) => d.id === deckId);

    if (deck && deck.cards.length >= 4) {
      setSelectedDeck(deckId);
      // Lấy tối đa 12 thẻ để chơi
      const cardsToPlay = deck.cards.slice(0, Math.min(12, deck.cards.length));
      setGameCards(cardsToPlay);

      // Tạo các cặp thẻ cho trò chơi ghép cặp
      const pairs: any[] = [];
      cardsToPlay.forEach((card, index) => {
        pairs.push({
          id: index * 2,
          type: "front",
          content: card.front,
          pairId: index,
        });
        pairs.push({
          id: index * 2 + 1,
          type: "back",
          content: card.back,
          pairId: index,
        });
      });

      // Xáo trộn các cặp thẻ
      const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5);
      setMatchPairs(shuffledPairs);

      // Chuẩn bị thẻ cho trò chơi tốc độ
      setSpeedGameCards([...cardsToPlay].sort(() => Math.random() - 0.5));
    } else {
      setSelectedDeck(null);
      setGameCards([]);
      setMatchPairs([]);
      setSpeedGameCards([]);
      toast({
        title: "Không đủ thẻ",
        description: "Bộ thẻ cần có ít nhất 4 thẻ để chơi trò chơi.",
        variant: "destructive",
      });
    }
  };

  // Bắt đầu trò chơi ghép cặp
  const startMatchGame = () => {
    if (matchPairs.length === 0 || gameCards.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn bộ thẻ trước khi bắt đầu.",
        variant: "destructive",
      });
      return;
    }
    setGameMode("match");
    setGameStarted(true);
    setMoves(0);
    setMatchedPairs([]);
    setFlippedCards([]);
    setTimer(0);

    // Bắt đầu đếm thời gian
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    timerIntervalRef.current = interval;
  };

  // Bắt đầu trò chơi tốc độ
  const startSpeedGame = () => {
    if (speedGameCards.length === 0 || gameCards.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn bộ thẻ trước khi bắt đầu.",
        variant: "destructive",
      });
      return;
    }
    setGameMode("speed");
    setGameStarted(true);
    setCurrentSpeedCard(0);
    setSpeedGameScore(0);
    setSpeedGameTime(60);

    // Bắt đầu đếm ngược thời gian
    let timeLeft = 60;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setSpeedGameTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        timerIntervalRef.current = null;
        setPreviousGameMode("speed");
        setGameMode("complete");
        setGameCompleted(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 1000);
    timerIntervalRef.current = interval;
  };

  // Kết thúc trò chơi tốc độ
  const endSpeedGame = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setPreviousGameMode("speed");
    setGameMode("complete");
    setGameCompleted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Xử lý khi người chơi lật thẻ trong trò chơi ghép cặp
  const handleCardFlip = (cardId: number) => {
    if (!matchPairs[cardId]) return;

    // Không cho phép lật thẻ đã ghép cặp
    if (matchedPairs.includes(matchPairs[cardId].pairId)) {
      return;
    }

    // Không cho phép lật quá 2 thẻ cùng lúc
    if (flippedCards.length >= 2) {
      return;
    }

    // Không cho phép lật lại thẻ đã lật
    if (flippedCards.includes(cardId)) {
      return;
    }

    // Lật thẻ
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Nếu đã lật 2 thẻ, kiểm tra xem có ghép cặp không
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      const firstCard = matchPairs[newFlippedCards[0]];
      const secondCard = matchPairs[newFlippedCards[1]];

      // Nếu 2 thẻ có cùng pairId, tức là ghép cặp thành công
      if (firstCard.pairId === secondCard.pairId) {
        setMatchedPairs((prev) => [...prev, firstCard.pairId]);
        setFlippedCards([]);

        // Kiểm tra xem đã hoàn thành trò chơi chưa
        if (matchedPairs.length + 1 === gameCards.length) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }

          // Tính điểm dựa trên số lượt và thời gian
          const timeBonus = Math.max(0, 300 - timer);
          const moveBonus = Math.max(0, 100 - moves * 5);
          const finalScore = timeBonus + moveBonus;

          setScore(finalScore);
          setPreviousGameMode("match");
          setGameMode("complete");
          setGameCompleted(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      } else {
        // Nếu không ghép cặp, đợi 1 giây rồi lật lại
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Xử lý khi người chơi trả lời trong trò chơi tốc độ
  const handleSpeedAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setSpeedGameScore((prev) => prev + 10);
    } else {
      setSpeedGameScore((prev) => Math.max(0, prev - 5));
    }

    // Chuyển sang thẻ tiếp theo
    if (currentSpeedCard < speedGameCards.length - 1) {
      setCurrentSpeedCard((prev) => prev + 1);
    } else {
      // Nếu đã hết thẻ, xáo trộn lại và bắt đầu lại
      setSpeedGameCards([...speedGameCards].sort(() => Math.random() - 0.5));
      setCurrentSpeedCard(0);
    }
  };

  // Chơi lại
  const playAgain = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setGameMode("select");
    setGameStarted(false);
    setGameCompleted(false);
    setSelectedDeck(null);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimer(0);
    setScore(0);
    setSpeedGameScore(0);
    setSpeedGameTime(60);
    setCurrentSpeedCard(0);
  };

  // Dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, []);

  // Format thời gian
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <main className="container max-w-4xl mx-auto px-4 py-8">
      {showConfetti && <Confetti />}

      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-xl font-bold">Trò chơi học tập</h1>
        </div>
      </div>

      {gameMode === "select" && (
        <GameSelect
          decks={decks}
          selectedDeck={selectedDeck}
          onSelectDeck={handleSelectDeck}
          onStartMatchGame={startMatchGame}
          onStartSpeedGame={startSpeedGame}
        />
      )}

      {gameMode === "match" && (
        <MatchGame
          matchPairs={matchPairs}
          flippedCards={flippedCards}
          matchedPairs={matchedPairs}
          moves={moves}
          timer={timer}
          onCardFlip={handleCardFlip}
          onPlayAgain={playAgain}
          formatTime={formatTime}
        />
      )}

      {gameMode === "speed" && (
        <SpeedGame
          speedGameCards={speedGameCards}
          currentSpeedCard={currentSpeedCard}
          speedGameTime={speedGameTime}
          speedGameScore={speedGameScore}
          onSpeedAnswer={handleSpeedAnswer}
          onPlayAgain={playAgain}
        />
      )}

      {gameMode === "complete" && (
        <GameComplete
          previousGameMode={previousGameMode}
          moves={moves}
          timer={timer}
          score={score}
          speedGameScore={speedGameScore}
          onPlayAgain={playAgain}
          formatTime={formatTime}
        />
      )}
    </main>
  );
}
