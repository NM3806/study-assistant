import React from "react";
import { Flashcard, CardMastery } from "@/lib/types";

interface CompletionScreenProps {
  cards: Flashcard[];
  masteryMap: Record<string, CardMastery>;
  isReTestMode?: boolean;
  onReTestMissed: () => void;
  onReviewAll: () => void;
  onNewSession: () => void;
}

export function CompletionScreen({
  cards,
  masteryMap,
  isReTestMode,
  onReTestMissed,
  onReviewAll,
  onNewSession,
}: CompletionScreenProps) {
  const masteredCards = cards.filter((c) => masteryMap[c.id] === "mastered");
  const missedCards = cards.filter((c) => masteryMap[c.id] === "learning" || !masteryMap[c.id]);

  const scorePercent = Math.round((masteredCards.length / cards.length) * 100);
  const isPerfect = missedCards.length === 0;

  return (
    <div className="w-full max-w-2xl mx-auto border-2 border-black bg-white p-6 sm:p-8 shadow-brutal">
      {/* Title and status */}
      <div className="text-center pb-6 border-b-2 border-black">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-black bg-neutral-100 font-mono text-xs font-bold uppercase mb-3">
          {isReTestMode ? "Re-Test Completed" : "Deck Complete"}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
          {isPerfect ? "100% Mastery Achieved" : "Review Summary"}
        </h2>
        <p className="mt-1 text-sm text-neutral-600 font-sans">
          {isPerfect
            ? "You completed all flashcards in this deck."
            : "Review missed concepts to reinforce your recall."}
        </p>
      </div>

      {/* Score summary */}
      <div className="grid grid-cols-3 gap-3 my-6 text-center font-mono">
        <div className="p-3.5 border-2 border-black bg-neutral-50">
          <div className="text-2xl sm:text-3xl font-black text-black">{scorePercent}%</div>
          <div className="text-[11px] font-bold text-neutral-500 uppercase mt-0.5">Accuracy</div>
        </div>
        <div className="p-3.5 border-2 border-black bg-emerald-50 text-emerald-950">
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">{masteredCards.length}</div>
          <div className="text-[11px] font-bold uppercase mt-0.5">Mastered</div>
        </div>
        <div className="p-3.5 border-2 border-black bg-amber-50 text-amber-950">
          <div className="text-2xl sm:text-3xl font-black text-amber-700">{missedCards.length}</div>
          <div className="text-[11px] font-bold uppercase mt-0.5">Need Review</div>
        </div>
      </div>

      {/* Card breakdown */}
      <div className="space-y-2 mb-8 max-h-56 overflow-y-auto pr-1">
        <h4 className="text-xs font-mono font-bold uppercase text-neutral-500 mb-2">
          Card Breakdown:
        </h4>
        {cards.map((card) => {
          const isMastered = masteryMap[card.id] === "mastered";
          return (
            <div
              key={card.id}
              className={`p-3 border border-black flex items-start justify-between gap-3 text-xs ${
                isMastered ? "bg-emerald-50/50" : "bg-amber-50/50"
              }`}
            >
              <div className="flex-1">
                <span className="font-mono text-[10px] uppercase font-bold text-neutral-500 block">
                  {card.category || "Card"}
                </span>
                <span className="font-semibold text-neutral-900 line-clamp-1">{card.front}</span>
              </div>
              <span
                className={`font-mono font-bold text-[11px] px-2 py-0.5 border border-black shrink-0 ${
                  isMastered ? "bg-emerald-300 text-black" : "bg-amber-300 text-black"
                }`}
              >
                {isMastered ? "Mastered" : "Review"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="space-y-3 pt-4 border-t-2 border-black">
        {missedCards.length > 0 && (
          <button
            type="button"
            onClick={onReTestMissed}
            className="w-full py-3.5 px-4 border-2 border-black bg-amber-400 hover:bg-amber-300 text-black font-mono text-sm font-black uppercase tracking-wider transition-all shadow-brutal shadow-brutal-hover active:translate-y-0.5"
          >
            Re-Test Missed Cards ({missedCards.length}) →
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onReviewAll}
            className="py-3 px-4 border-2 border-black bg-white hover:bg-neutral-100 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-brutal-sm active:translate-y-0.5"
          >
            Restart All Cards
          </button>
          <button
            type="button"
            onClick={onNewSession}
            className="py-3 px-4 border-2 border-black bg-black hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-brutal-sm active:translate-y-0.5"
          >
            + New Study Session
          </button>
        </div>
      </div>
    </div>
  );
}
