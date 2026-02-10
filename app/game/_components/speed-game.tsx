"use client";

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
                    onClick={() => onSpeedAnswer(false)}
                  >
                    <X className="mr-2 h-4 w-4" /> Không biết
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-green-50 hover:bg-green-100 border-green-200 text-green-600 hover:text-green-700 dark:bg-green-950/30 dark:hover:bg-green-950/50 dark:border-green-800 dark:text-green-400"
                    onClick={() => onSpeedAnswer(true)}
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
        <Button 
          variant="outline" 
          onClick={onPlayAgain}
          className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 dark:hover:bg-orange-900/20 transition-all"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Kết thúc
        </Button>
      </div>
    </div>
  );
}
