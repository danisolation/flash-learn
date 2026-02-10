"use client";

import { Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MatchPair {
  id: number;
  type: "front" | "back";
  content: string;
  pairId: number;
}

interface MatchGameProps {
  matchPairs: MatchPair[];
  flippedCards: number[];
  matchedPairs: number[];
  moves: number;
  timer: number;
  onCardFlip: (cardId: number) => void;
  onPlayAgain: () => void;
  formatTime: (seconds: number) => string;
}

export default function MatchGame({
  matchPairs,
  flippedCards,
  matchedPairs,
  moves,
  timer,
  onCardFlip,
  onPlayAgain,
  formatTime,
}: MatchGameProps) {
  return (
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
            onClick={() => onCardFlip(index)}
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
        <Button 
          variant="outline" 
          onClick={onPlayAgain}
          className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-900/20 transition-all"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Chơi lại
        </Button>
      </div>
    </div>
  );
}
