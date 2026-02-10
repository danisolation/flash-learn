"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  X,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFlashcards } from "@/components/flashcard-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Confetti from "@/components/confetti";
import Pronunciation from "@/components/pronunciation";

export default function StudyDeckPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { decks, updateCardStatus, updateDeckProgress } = useFlashcards();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [autoFlipEnabled, setAutoFlipEnabled] = useState(false);
  const [autoFlipTimer, setAutoFlipTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [autoFlipSeconds, setAutoFlipSeconds] = useState(5);
  const [autoFlipCountdown, setAutoFlipCountdown] = useState(5);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [studyMode, setStudyMode] = useState<"standard" | "quiz" | "choice">(
    "standard"
  );
  const [shuffledCards, setShuffledCards] = useState<number[]>([]);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>(
    []
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Tìm deck theo ID
  const deckId = Number.parseInt(resolvedParams.deckId);
  const currentDeck = decks.find((deck) => deck.id === deckId);

  // Lấy thẻ từ deck hiện tại
  const cards = currentDeck?.cards || [];

  // Khởi tạo danh sách thẻ đã thuộc
  useEffect(() => {
    if (cards.length > 0) {
      const initialKnownCards = cards
        .map((card, index) => (card.status === "known" ? index : -1))
        .filter((index) => index !== -1);

      setKnownCards(initialKnownCards);

      // Khởi tạo thứ tự xáo trộn
      const initialShuffled = Array.from({ length: cards.length }, (_, i) => i);
      setShuffledCards(initialShuffled);
    }
  }, [cards]);

  useEffect(() => {
    if (!currentDeck) {
      toast({
        title: "Không tìm thấy bộ thẻ",
        description: "Bộ thẻ này không tồn tại hoặc đã bị xóa.",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    if (cards.length === 0) {
      toast({
        title: "Bộ thẻ trống",
        description: "Bộ thẻ này không có thẻ nào.",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    // Tính toán tiến độ
    const newProgress = (currentCardIndex / cards.length) * 100;
    setProgress(newProgress);

    // Reset quiz state when changing cards
    setQuizAnswer("");
    setQuizResult(null);
    setSelectedOption(null);

    // Tạo các lựa chọn cho chế độ trắc nghiệm
    if (studyMode === "choice") {
      generateMultipleChoiceOptions();
    }

    // Clear any existing timer
    if (autoFlipTimer) {
      clearInterval(autoFlipTimer);
      setAutoFlipTimer(null);
    }

    // Start auto-flip timer if enabled
    if (autoFlipEnabled && !isFlipped) {
      setAutoFlipCountdown(autoFlipSeconds);
      const timer = setInterval(() => {
        setAutoFlipCountdown((prev) => {
          if (prev <= 1) {
            setIsFlipped(true);
            clearInterval(timer);
            return autoFlipSeconds;
          }
          return prev - 1;
        });
      }, 1000);
      setAutoFlipTimer(timer);
    }

    return () => {
      if (autoFlipTimer) {
        clearInterval(autoFlipTimer);
      }
    };
  }, [
    currentCardIndex,
    cards.length,
    currentDeck,
    router,
    toast,
    autoFlipEnabled,
    isFlipped,
    autoFlipSeconds,
    studyMode,
  ]);

  const currentCard = cards[currentCardIndex];

  // Tạo các lựa chọn cho chế độ trắc nghiệm
  const generateMultipleChoiceOptions = () => {
    if (!currentCard || cards.length < 4) return;

    // Lấy đáp án đúng
    const correctAnswer = currentCard.back;

    // Lấy 3 đáp án ngẫu nhiên khác
    const otherOptions: string[] = [];
    const usedIndices = new Set([currentCardIndex]);

    while (otherOptions.length < 3 && otherOptions.length < cards.length - 1) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      if (
        !usedIndices.has(randomIndex) &&
        cards[randomIndex].back !== correctAnswer
      ) {
        usedIndices.add(randomIndex);
        otherOptions.push(cards[randomIndex].back);
      }
    }

    // Kết hợp và xáo trộn các lựa chọn
    const allOptions = [correctAnswer, ...otherOptions];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    setMultipleChoiceOptions(allOptions);
  };

  // Sửa hàm handleKnown để đảm bảo cập nhật đúng trạng thái thẻ
  const handleKnown = () => {
    if (!knownCards.includes(currentCardIndex)) {
      setKnownCards((prev) => [...prev, currentCardIndex]);
    }

    // Luôn cập nhật trạng thái thẻ khi đánh dấu là đã thuộc
    if (currentCard && currentCard.id) {
      // Đảm bảo cập nhật trạng thái thẻ
      updateCardStatus(currentCard.id, "known");

      // Nếu là thẻ cuối cùng, đợi một chút để đảm bảo trạng thái được cập nhật
      if (currentCardIndex === cards.length - 1) {
        setTimeout(() => {
          // Cập nhật tiến độ một lần nữa để đảm bảo chính xác
          if (currentDeck) {
            updateDeckProgress(currentDeck.id, 100);
          }
        }, 100);
      }
    }

    handleNext();
  };

  // Sửa hàm handleNext để cập nhật tiến độ chính xác khi hoàn thành
  const handleNext = () => {
    setIsFlipped(false);
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // Hoàn thành phiên học
      // Đếm số thẻ đã thuộc thực tế, bao gồm cả thẻ vừa được đánh dấu
      const updatedKnownCards = [...knownCards];
      if (!updatedKnownCards.includes(currentCardIndex)) {
        updatedKnownCards.push(currentCardIndex);
      }

      const knownCardsCount = cards.filter(
        (card, index) =>
          card.status === "known" || updatedKnownCards.includes(index)
      ).length;

      const completionRate = (knownCardsCount / cards.length) * 100;

      // Update deck progress
      if (currentDeck) {
        updateDeckProgress(currentDeck.id, completionRate);

        // Log để debug
        console.log(
          `Hoàn thành: ${knownCardsCount}/${cards.length} thẻ (${Math.round(
            completionRate
          )}%)`
        );
      }

      // Show confetti for good performance
      if (completionRate >= 70) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      toast({
        title: "Hoàn thành!",
        description: `Bạn đã học ${knownCardsCount} / ${
          cards.length
        } thẻ (${Math.round(completionRate)}%).`,
      });

      // Đợi lâu hơn một chút để đảm bảo dữ liệu được lưu
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  // Sửa hàm handleUnknown để đảm bảo cập nhật đúng trạng thái thẻ
  const handleUnknown = () => {
    if (knownCards.includes(currentCardIndex)) {
      setKnownCards((prev) => prev.filter((idx) => idx !== currentCardIndex));
    }

    if (currentCard && currentCard.id && currentDeck?.id) {
      updateCardStatus(currentCard.id, "unknown");
    }

    handleNext();
  };

  const shuffleCards = () => {
    // Tạo mảng chỉ số và xáo trộn
    const indices = Array.from({ length: cards.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    setShuffledCards(indices);
    setCurrentCardIndex(0);
    setIsFlipped(false);

    toast({
      title: "Đã xáo trộn thẻ",
      description: "Thứ tự các thẻ đã được xáo trộn ngẫu nhiên.",
    });
  };

  const handleFlipCard = () => {
    // Clear auto-flip timer if it exists
    if (autoFlipTimer) {
      clearInterval(autoFlipTimer);
      setAutoFlipTimer(null);
    }

    setIsFlipped(!isFlipped);
  };

  const toggleAutoFlip = () => {
    setAutoFlipEnabled(!autoFlipEnabled);
  };

  const handleQuizSubmit = () => {
    const isCorrect =
      quizAnswer.toLowerCase().trim() === currentCard.back.toLowerCase().trim();
    setQuizResult(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      if (!knownCards.includes(currentCardIndex)) {
        setKnownCards((prev) => [...prev, currentCardIndex]);
        if (currentCard && currentCard.id) {
          updateCardStatus(currentCard.id, "known");
        }
      }

      // Auto advance after correct answer
      setTimeout(() => {
        setQuizAnswer("");
        setQuizResult(null);
        handleNext();
      }, 1500);
    }
  };

  const handleChoiceSelect = (option: string) => {
    setSelectedOption(option);
    const isCorrect = option === currentCard.back;

    if (isCorrect) {
      if (!knownCards.includes(currentCardIndex)) {
        setKnownCards((prev) => [...prev, currentCardIndex]);
        if (currentCard && currentCard.id) {
          updateCardStatus(currentCard.id, "known");
        }
      }

      // Hiển thị hiệu ứng đúng
      setTimeout(() => {
        setSelectedOption(null);
        handleNext();
      }, 1000);
    } else {
      // Hiển thị hiệu ứng sai
      setTimeout(() => {
        setSelectedOption(null);
      }, 1000);
    }
  };

  const handleModeChange = (mode: string) => {
    setStudyMode(mode as "standard" | "quiz" | "choice");
    if (mode === "choice") {
      generateMultipleChoiceOptions();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (studyMode !== "standard") return;
      
      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault();
          handleFlipCard();
          break;
        case "ArrowLeft":
          if (currentCardIndex > 0) handlePrevious();
          break;
        case "ArrowRight":
          if (currentCardIndex < cards.length - 1) handleNext();
          break;
        case "1":
          handleUnknown();
          break;
        case "2":
          handleKnown();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCardIndex, cards.length, studyMode, isFlipped]);

  if (!currentCard) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Không có thẻ nào</h1>
        <p className="text-muted-foreground mb-6">
          Hãy tạo một số thẻ trước khi bắt đầu học.
        </p>
        <Link href="/create">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all">
            Tạo thẻ mới
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {showConfetti && <Confetti />}

      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container max-w-3xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/study">
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
              </Button>
            </Link>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={autoFlipEnabled ? "default" : "outline"} 
                      size="sm" 
                      onClick={toggleAutoFlip}
                      className={autoFlipEnabled ? "bg-primary" : ""}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {autoFlipEnabled ? `${autoFlipCountdown}s` : "Tự động"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tự động lật thẻ sau {autoFlipSeconds} giây</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={shuffleCards}
                className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-900/20 transition-all"
              >
                <Shuffle className="mr-2 h-4 w-4" /> Xáo trộn
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-3xl mx-auto px-4 py-6">
        {/* Header with Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-bold">{currentDeck?.name}</h1>
              <p className="text-sm text-muted-foreground">
                {knownCards.length} / {cards.length} thẻ đã thuộc
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-1 bg-primary/10 text-primary font-bold">
              {currentCardIndex + 1} / {cards.length}
            </Badge>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative">
            <Progress value={progress} className="h-3" />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-lg border-2 border-white dark:border-gray-800 transition-all"
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>
          
          {/* Keyboard Shortcuts Hint */}
          <div className="hidden md:flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-muted font-mono">Space</kbd> Lật thẻ
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-muted font-mono">←</kbd> Trước
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-muted font-mono">→</kbd> Tiếp
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-muted font-mono">1</kbd> Chưa thuộc
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-muted font-mono">2</kbd> Đã thuộc
            </span>
          </div>
        </div>

        {/* Study Mode Tabs */}
        <Tabs
          defaultValue="standard"
          className="mb-6"
          onValueChange={handleModeChange}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="standard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Học thẻ
            </TabsTrigger>
            <TabsTrigger value="quiz" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Nhập nghĩa
            </TabsTrigger>
            <TabsTrigger value="choice" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Trắc nghiệm
            </TabsTrigger>
          </TabsList>

        <TabsContent value="standard">
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md perspective-1000">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCardIndex + (isFlipped ? "-flipped" : "")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Card
                    className={`w-full h-72 sm:h-80 cursor-pointer flex items-center justify-center p-6 transition-all duration-500 transform-style-3d ${
                      isFlipped ? "rotate-y-180" : ""
                    } shadow-xl hover:shadow-2xl border-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800`}
                    onClick={handleFlipCard}
                  >
                    <div
                      className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 ${
                        isFlipped ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className="text-xs">Từ vựng</Badge>
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {currentCard.front}
                      </div>
                      {currentCard.phonetic && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>{currentCard.phonetic}</span>
                          <Pronunciation text={currentCard.front} />
                        </div>
                      )}
                      <div className="absolute bottom-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="animate-pulse">Nhấn để xem nghĩa</span>
                      </div>
                    </div>
                    <div
                      className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-lg ${
                        isFlipped ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Nghĩa</Badge>
                      </div>
                      <div className="text-2xl sm:text-3xl font-semibold text-center">
                        {currentCard.back}
                      </div>
                      {currentCard.example && (
                        <div className="mt-4 text-sm italic text-muted-foreground text-center bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg max-w-sm">
                          <span className="text-primary">"</span>
                          {currentCard.example}
                          <span className="text-primary">"</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center max-w-md mx-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Trước</span>
            </Button>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-xl hover:shadow-red-500/30"
                onClick={handleUnknown}
              >
                <X className="mr-2 h-5 w-5" /> Chưa thuộc
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-xl hover:shadow-green-500/30"
                onClick={handleKnown}
              >
                <Check className="mr-2 h-5 w-5" /> Đã thuộc
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handleNext}
              disabled={currentCardIndex === cards.length - 1}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Tiếp</span>
            </Button>
          </div>
          
          {/* Swipe hint for mobile */}
          <p className="text-center text-xs text-muted-foreground mt-4 md:hidden">
            Vuốt trái/phải để điều hướng
          </p>
        </TabsContent>

        <TabsContent value="quiz">
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCardIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="w-full shadow-lg p-6">
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        Từ vựng
                      </div>
                      <div className="text-3xl font-bold text-center mb-4">
                        {currentCard.front}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {currentCard.phonetic && (
                          <span className="text-muted-foreground">
                            {currentCard.phonetic}
                          </span>
                        )}
                        <Pronunciation text={currentCard.front} />
                      </div>

                      <div className="w-full space-y-4 mt-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="answer"
                            className="text-sm font-medium"
                          >
                            Nhập nghĩa của từ:
                          </label>
                          <input
                            id="answer"
                            className={cn(
                              "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                              quizResult === "correct" &&
                                "border-green-500 ring-green-500",
                              quizResult === "incorrect" &&
                                "border-red-500 ring-red-500"
                            )}
                            value={quizAnswer}
                            onChange={(e) => setQuizAnswer(e.target.value)}
                            placeholder="Nhập nghĩa của từ..."
                            disabled={quizResult !== null}
                          />
                        </div>

                        {quizResult === "correct" && (
                          <div className="p-2 bg-green-50 text-green-700 rounded-md flex items-center gap-2 dark:bg-green-900/30 dark:text-green-400">
                            <Check className="h-4 w-4" />
                            <span>Chính xác!</span>
                          </div>
                        )}

                        {quizResult === "incorrect" && (
                          <div className="p-2 bg-red-50 text-red-700 rounded-md flex items-center gap-2 dark:bg-red-900/30 dark:text-red-400">
                            <X className="h-4 w-4" />
                            <span>
                              Chưa đúng! Đáp án đúng: {currentCard.back}
                            </span>
                          </div>
                        )}

                        {quizResult === null && (
                          <Button
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
                            onClick={handleQuizSubmit}
                            disabled={!quizAnswer.trim()}
                          >
                            Kiểm tra
                          </Button>
                        )}

                        {quizResult === "incorrect" && (
                          <Button
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
                            onClick={() => {
                              setQuizAnswer("");
                              setQuizResult(null);
                              handleNext();
                            }}
                          >
                            Tiếp tục
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentCardIndex === 0 || quizResult !== null}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Trước</span>
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Trả lời đúng để tiếp tục
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={
                currentCardIndex === cards.length - 1 || quizResult !== null
              }
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Tiếp</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="choice">
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCardIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="w-full shadow-lg p-6">
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        Từ vựng
                      </div>
                      <div className="text-3xl font-bold text-center mb-4">
                        {currentCard.front}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {currentCard.phonetic && (
                          <span className="text-muted-foreground">
                            {currentCard.phonetic}
                          </span>
                        )}
                        <Pronunciation text={currentCard.front} />
                      </div>

                      <div className="w-full space-y-3 mt-4">
                        <p className="text-sm font-medium text-center">
                          Chọn nghĩa đúng:
                        </p>
                        {multipleChoiceOptions.map((option, index) => (
                          <Button
                            key={index}
                            className={cn(
                              "w-full justify-start text-left p-4 h-auto",
                              selectedOption === option &&
                                option === currentCard.back &&
                                "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                              selectedOption === option &&
                                option !== currentCard.back &&
                                "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            )}
                            variant="outline"
                            onClick={() => handleChoiceSelect(option)}
                            disabled={selectedOption !== null}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentCardIndex === 0 || selectedOption !== null}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Trước</span>
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Chọn đáp án đúng để tiếp tục
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={
                currentCardIndex === cards.length - 1 || selectedOption !== null
              }
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Tiếp</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </main>
    </div>
  );
}
