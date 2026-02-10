import { useMemo } from "react";
import { useFlashcards } from "@/components/flashcard-provider";
import DeckCard from "@/components/deck-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function DeckList() {
  const { decks } = useFlashcards();

  const decksWithUpdatedProgress = useMemo(() => decks.map((deck) => {
    const totalCards = deck.cards.length;
    const knownCards = deck.cards.filter(
      (card) => card.status === "known"
    ).length;
    const progress =
      totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;

    return {
      ...deck,
      progress,
      knownCount: knownCards,
      totalCount: totalCards,
    };
  }), [decks]);

  if (decksWithUpdatedProgress.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium mb-2">Chưa có bộ thẻ nào</h3>
        <p className="text-muted-foreground mb-4">
          Tạo bộ thẻ đầu tiên của bạn để bắt đầu học.
        </p>
        <Link to="/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tạo bộ thẻ mới
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {decksWithUpdatedProgress.slice(0, 4).map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}
    </div>
  );
}
