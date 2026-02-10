import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Deck {
  id: number;
  name: string;
  description?: string;
  cards: any[];
}

interface GameSelectProps {
  decks: Deck[];
  selectedDeck: number | null;
  onSelectDeck: (deckId: number) => void;
  onStartMatchGame: () => void;
  onStartSpeedGame: () => void;
}

export default function GameSelect({
  decks,
  selectedDeck,
  onSelectDeck,
  onStartMatchGame,
  onStartSpeedGame,
}: GameSelectProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 border-none shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-lg"></div>
        </div>
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-white">🎮 Học qua trò chơi</h2>
              <p className="text-white/85 max-w-md">
                Chơi các trò chơi thú vị để ghi nhớ từ vựng nhanh hơn và hiệu quả hơn.
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Trophy className="h-14 w-14 text-white" />
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
            <Link to="/create">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all">
                Tạo bộ thẻ mới
              </Button>
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
              onClick={() => onSelectDeck(deck.id)}
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
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all" 
                onClick={onStartMatchGame}
              >
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
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md hover:shadow-lg transition-all" 
                onClick={onStartSpeedGame}
              >
                Bắt đầu chơi
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
