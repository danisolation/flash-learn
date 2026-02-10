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
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 gap-1">
            🎯 Lượt: {moves}
          </Badge>
          <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 gap-1">
            ✓ {matchedPairs.length}/{matchPairs.length / 2}
          </Badge>
        </div>
        <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatTime(timer)}
        </Badge>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {matchPairs.map((card, index) => {
          const isMatched = matchedPairs.includes(card.pairId);
          const isFlipped = flippedCards.includes(index);
          return (
            <div
              key={card.id}
              className="perspective-1000"
              onClick={() => onCardFlip(index)}
            >
              <div
                className={`relative h-24 md:h-32 w-full cursor-pointer transition-transform duration-500 transform-style-3d ${
                  isFlipped || isMatched ? "rotate-y-180" : ""
                }`}
              >
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md hover:shadow-lg transition-shadow">
                  ?
                </div>
                <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 p-2 flex items-center justify-center text-center transition-all ${
                  isMatched 
                    ? "bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600" 
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                }`}>
                  <span className={`text-sm font-medium ${isMatched ? 'text-green-700 dark:text-green-400' : ''}`}>
                    {card.content} {isMatched && '✓'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
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
