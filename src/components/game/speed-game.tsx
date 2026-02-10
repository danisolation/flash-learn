import { Clock, X, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface SpeedCard {
  front: string;
  back: string;
  phonetic?: string;
}

interface SpeedGameProps {
  speedGameCards: SpeedCard[];
  currentSpeedCard: number;
  speedGameTime: number;
  speedGameScore: number;
  onSpeedAnswer: (isCorrect: boolean) => void;
  onPlayAgain: () => void;
}

export default function SpeedGame({
  speedGameCards,
  currentSpeedCard,
  speedGameTime,
  speedGameScore,
  onSpeedAnswer,
  onPlayAgain,
}: SpeedGameProps) {
  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 gap-1.5 px-3 py-1.5 text-sm font-semibold">
            ⚡ {speedGameScore} điểm
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm">
            {currentSpeedCard + 1}/{speedGameCards.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
            speedGameTime <= 10 
              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse" 
              : speedGameTime <= 20 
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-muted text-muted-foreground"
          }`}>
            <Clock className="h-4 w-4" />
            {speedGameTime}s
          </div>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="relative">
        <Progress 
          value={(speedGameTime / 60) * 100} 
          className={`h-2.5 rounded-full ${speedGameTime <= 10 ? "[&>div]:bg-red-500" : speedGameTime <= 20 ? "[&>div]:bg-amber-500" : ""}`} 
        />
      </div>

      {/* Card Display */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSpeedCard}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card className="w-full shadow-xl border-2 rounded-2xl overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <CardContent className="p-8 flex flex-col items-center">
                  <Badge variant="secondary" className="mb-4 text-xs">
                    Từ vựng
                  </Badge>
                  <div className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {speedGameCards[currentSpeedCard]?.front}
                  </div>
                  {speedGameCards[currentSpeedCard]?.phonetic && (
                    <div className="text-sm text-muted-foreground mb-6 font-mono">
                      {speedGameCards[currentSpeedCard]?.phonetic}
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Bạn có biết nghĩa của từ này không?
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4 pb-6">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:border-red-800 dark:text-red-400 rounded-xl px-6 transition-all hover:scale-105"
                    onClick={() => onSpeedAnswer(false)}
                  >
                    <X className="mr-2 h-5 w-5" /> Không biết
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-green-50 hover:bg-green-100 border-green-200 text-green-600 hover:text-green-700 dark:bg-green-950/30 dark:hover:bg-green-950/50 dark:border-green-800 dark:text-green-400 rounded-xl px-6 transition-all hover:scale-105"
                    onClick={() => onSpeedAnswer(true)}
                  >
                    <Check className="mr-2 h-5 w-5" /> Đã thuộc
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={onPlayAgain}
          className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 dark:hover:bg-orange-900/20 transition-all rounded-xl"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Kết thúc
        </Button>
      </div>
    </div>
  );
}
