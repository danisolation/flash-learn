"use client";

import Link from "next/link";
import { Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GameCompleteProps {
  previousGameMode: "match" | "speed";
  moves: number;
  timer: number;
  score: number;
  speedGameScore: number;
  onPlayAgain: () => void;
  formatTime: (seconds: number) => string;
}

export default function GameComplete({
  previousGameMode,
  moves,
  timer,
  score,
  speedGameScore,
  onPlayAgain,
  formatTime,
}: GameCompleteProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-none shadow-md">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
              <Trophy className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold">Chúc mừng!</h2>
            <p className="text-muted-foreground">
              {previousGameMode === "match"
                ? `Bạn đã hoàn thành trò chơi với ${moves} lượt trong ${formatTime(
                    timer
                  )}.`
                : `Bạn đã đạt được ${speedGameScore} điểm trong 60 giây.`}
            </p>

            {previousGameMode === "match" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-xs">
                <p className="text-center font-bold text-2xl text-primary">
                  {score} điểm
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <Button 
                variant="outline" 
                onClick={onPlayAgain}
                className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-900/20 transition-all"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Chơi lại
              </Button>
              <Link href="/">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Về trang chủ
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
