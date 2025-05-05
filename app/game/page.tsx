"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Clock, X, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFlashcards } from "@/components/flashcard-provider";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Confetti from "@/components/confetti";

export default function GamePage() {
  const { decks } = useFlashcards();
  const { toast } = useToast();
  const [gameMode, setGameMode] = useState<
    "select" | "match" | "speed" | "complete"
  >("select");
  const [selectedDeck, setSelectedDeck] = useState<number | null>(null);
  const [gameCards, setGameCards] = useState<any[]>([]);
  const [matchPairs, setMatchPairs] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [speedGameCards, setSpeedGameCards] = useState<any[]>([]);
  const [currentSpeedCard, setCurrentSpeedCard] = useState(0);
  const [speedGameTime, setSpeedGameTime] = useState(60);
  const [speedGameScore, setSpeedGameScore] = useState(0);

  // Chọn bộ thẻ để chơi
  const handleSelectDeck = (deckId: number) => {
    setSelectedDeck(deckId);
    const deck = decks.find((d) => d.id === deckId);

    if (deck && deck.cards.length >= 6) {
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
      toast({
        title: "Không đủ thẻ",
        description: "Bộ thẻ cần có ít nhất 6 thẻ để chơi trò chơi.",
        variant: "destructive",
      });
    }
  };

  // Bắt đầu trò chơi ghép cặp
  const startMatchGame = () => {
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
    setTimerInterval(interval);
  };

  // Bắt đầu trò chơi tốc độ
  const startSpeedGame = () => {
    setGameMode("speed");
    setGameStarted(true);
    setCurrentSpeedCard(0);
    setSpeedGameScore(0);
    setSpeedGameTime(60);

    // Bắt đầu đếm ngược thời gian
    const interval = setInterval(() => {
      setSpeedGameTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endSpeedGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  // Kết thúc trò chơi tốc độ
  const endSpeedGame = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    setGameMode("complete");
    setGameCompleted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Xử lý khi người chơi lật thẻ trong trò chơi ghép cặp
  const handleCardFlip = (cardId: number) => {
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
          if (timerInterval) {
            clearInterval(timerInterval);
          }

          // Tính điểm dựa trên số lượt và thời gian
          const timeBonus = Math.max(0, 300 - timer);
          const moveBonus = Math.max(0, 100 - moves * 5);
          const finalScore = timeBonus + moveBonus;

          setScore(finalScore);
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
    setGameMode("select");
    setGameStarted(false);
    setGameCompleted(false);
    setSelectedDeck(null);
  };

  // Dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

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
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h1 className="text-2xl font-bold">Trò chơi học tập</h1>
        </div>
      </div>

      {gameMode === "select" && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-none shadow-md">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Học qua trò chơi</h2>
                  <p className="text-muted-foreground max-w-md">
                    Chơi các trò chơi thú vị để ghi nhớ từ vựng nhanh hơn và
                    hiệu quả hơn.
                  </p>
                </div>
                <div className="hidden md:block">
                  <Trophy className="h-24 w-24 text-amber-500/80" />
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4">Chọn bộ thẻ để chơi</h2>

          {decks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Bạn chưa có bộ thẻ nào
                </p>
                <Link href="/create">
                  <Button>Tạo bộ thẻ mới</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decks.map((deck) => (
                <Card
                  key={deck.id}
                  className={`cursor-pointer transition-all ${
                    selectedDeck === deck.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelectDeck(deck.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle>{deck.name}</CardTitle>
                    <CardDescription>
                      {deck.description || "Không có mô tả"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      {deck.cards.length} thẻ
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedDeck !== null && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trò chơi ghép cặp</CardTitle>
                  <CardDescription>
                    Ghép từ vựng với nghĩa tương ứng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Lật các thẻ để tìm cặp từ vựng và nghĩa tương ứng. Hoàn
                    thành càng nhanh, điểm càng cao.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={startMatchGame}>
                    Bắt đầu chơi
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trò chơi tốc độ</CardTitle>
                  <CardDescription>Trả lời nhanh trong 60 giây</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Xem từ vựng và chọn nhanh xem bạn đã thuộc hay chưa. Trả lời
                    đúng để ghi điểm.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={startSpeedGame}>
                    Bắt đầu chơi
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      )}

      {gameMode === "match" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary">
                Lượt: {moves}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{formatTime(timer)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {matchPairs.map((card, index) => (
              <div
                key={card.id}
                className="perspective-1000"
                onClick={() => handleCardFlip(index)}
              >
                <div
                  className={`relative h-24 md:h-32 w-full cursor-pointer transition-transform duration-500 transform-style-3d ${
                    flippedCards.includes(index) ||
                    matchedPairs.includes(card.pairId)
                      ? "rotate-y-180"
                      : ""
                  }`}
                >
                  <div className="absolute inset-0 backface-hidden bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                    ?
                  </div>
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-gray-800 rounded-lg border p-2 flex items-center justify-center text-center">
                    <span className="text-sm">{card.content}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={playAgain}>
              <RotateCcw className="mr-2 h-4 w-4" /> Chơi lại
            </Button>
          </div>
        </div>
      )}

      {gameMode === "speed" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary">
                Điểm: {speedGameScore}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span
                className={`font-bold ${
                  speedGameTime <= 10 ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                {speedGameTime}s
              </span>
            </div>
          </div>

          <Progress value={(speedGameTime / 60) * 100} className="h-2" />

          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSpeedCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="w-full shadow-lg">
                    <CardContent className="p-6 flex flex-col items-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        Từ vựng
                      </div>
                      <div className="text-3xl font-bold text-center mb-4">
                        {speedGameCards[currentSpeedCard]?.front}
                      </div>
                      <div className="text-sm text-muted-foreground mb-6">
                        {speedGameCards[currentSpeedCard]?.phonetic}
                      </div>
                      <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground">
                          Bạn có biết nghĩa của từ này không?
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:border-red-800 dark:text-red-400"
                        onClick={() => handleSpeedAnswer(false)}
                      >
                        <X className="mr-2 h-4 w-4" /> Không biết
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 border-green-200 text-green-600 hover:text-green-700 dark:bg-green-950/30 dark:hover:bg-green-950/50 dark:border-green-800 dark:text-green-400"
                        onClick={() => handleSpeedAnswer(true)}
                      >
                        <Check className="mr-2 h-4 w-4" /> Đã thuộc
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={playAgain}>
              <RotateCcw className="mr-2 h-4 w-4" /> Kết thúc
            </Button>
          </div>
        </div>
      )}

      {gameMode === "complete" && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-none shadow-md">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                  <Trophy className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold">Chúc mừng!</h2>
                <p className="text-muted-foreground">
                  {gameMode === "match"
                    ? `Bạn đã hoàn thành trò chơi với ${moves} lượt trong ${formatTime(
                        timer
                      )}.`
                    : `Bạn đã đạt được ${speedGameScore} điểm trong 60 giây.`}
                </p>

                {gameMode === "match" && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-xs">
                    <p className="text-center font-bold text-2xl text-primary">
                      {score} điểm
                    </p>
                  </div>
                )}

                <div className="flex gap-4 mt-4">
                  <Button variant="outline" onClick={playAgain}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Chơi lại
                  </Button>
                  <Link href="/">
                    <Button>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Về trang chủ
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
