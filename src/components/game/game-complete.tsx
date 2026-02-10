import { Link } from "react-router-dom";
import { Trophy, RotateCcw, ArrowLeft, Star, Zap, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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
  const displayScore = previousGameMode === "match" ? score : speedGameScore;
  const stars = displayScore >= 200 ? 3 : displayScore >= 100 ? 2 : 1;
  const xpEarned = Math.max(10, Math.floor(displayScore / 10));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-none shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400" />
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-5">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-5 rounded-full shadow-xl shadow-yellow-500/30">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
              </motion.div>

              {/* Stars */}
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + s * 0.15, type: "spring" }}
                  >
                    <Star className={`h-8 w-8 ${
                      s <= stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                    }`} />
                  </motion.div>
                ))}
              </div>

              <h2 className="text-3xl font-bold">Chúc mừng! 🎉</h2>
              <p className="text-muted-foreground max-w-sm">
                {previousGameMode === "match"
                  ? `Hoàn thành ghép cặp với ${moves} lượt trong ${formatTime(timer)}`
                  : `Đạt ${speedGameScore} điểm trong 60 giây`}
              </p>

              {/* Score & Stats */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm">
                  <Target className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-xl font-bold text-blue-600">{displayScore}</p>
                  <p className="text-[10px] text-muted-foreground">Điểm</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                  <p className="text-xl font-bold text-purple-600">
                    {previousGameMode === "match" ? formatTime(timer) : "60s"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Thời gian</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm">
                  <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                  <p className="text-xl font-bold text-yellow-600">+{xpEarned}</p>
                  <p className="text-[10px] text-muted-foreground">XP</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={onPlayAgain}
                  className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-900/20 transition-all gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Chơi lại
                </Button>
                <Link to="/">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all gap-2">
                    <ArrowLeft className="h-4 w-4" /> Về trang chủ
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
