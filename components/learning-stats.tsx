"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useFlashcards } from "@/components/flashcard-provider";

export default function LearningStats() {
  const { decks } = useFlashcards();

  // Tính toán số thẻ đã học và chưa học cho mỗi bộ thẻ
  const deckStats = decks.map((deck) => {
    const totalCards = deck.cards.length;
    // Đếm chính xác số thẻ đã thuộc
    const knownCards = deck.cards.filter(
      (card) => card.status === "known"
    ).length;
    const progress =
      totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;

    return {
      name: deck.name,
      known: knownCards,
      unknown: totalCards - knownCards,
      progress: progress,
    };
  });

  // Tính toán thống kê tổng thể
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const totalKnownCards = decks.reduce(
    (sum, deck) =>
      sum + deck.cards.filter((card) => card.status === "known").length,
    0
  );
  const overallProgress =
    totalCards > 0 ? Math.round((totalKnownCards / totalCards) * 100) : 0;

  // Log để debug
  console.log(
    `Tổng số thẻ: ${totalCards}, Đã thuộc: ${totalKnownCards}, Tiến độ: ${overallProgress}%`
  );

  if (decks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Chưa có dữ liệu học tập</p>
          <p className="text-sm text-muted-foreground mt-2">
            Hãy bắt đầu học để xem thống kê
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Tổng quan học tập</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalCards}
              </p>
              <p className="text-sm text-muted-foreground">Tổng số thẻ</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalKnownCards}
              </p>
              <p className="text-sm text-muted-foreground">Đã thuộc</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {overallProgress}%
              </p>
              <p className="text-sm text-muted-foreground">Tiến độ</p>
            </div>
          </div>

          <h4 className="text-sm font-medium mb-2">Tiến độ theo bộ thẻ</h4>
          <div className="space-y-4">
            {deckStats.map((deck, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{deck.name}</p>
                  <p className="text-sm font-medium">{deck.progress}%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${deck.progress}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {deck.known} / {deck.known + deck.unknown} thẻ đã thuộc
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
