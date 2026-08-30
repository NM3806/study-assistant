"use client";

import React, { useState } from "react";
import { Flashcard, CardMastery } from "@/lib/types";

interface FlashcardViewerProps {
  cards: Flashcard[];
  currentIndex: number;
  isFlipped: boolean;
  masteryMap: Record<string, CardMastery>;
  isReTestMode?: boolean;
  onFlip: () => void;
  onRateCard: (status: "mastered" | "learning") => void;
  onNext: () => void;
  onPrev: () => void;
}

export function FlashcardViewer({
  cards,
  currentIndex,
  isFlipped,
  masteryMap,
  isReTestMode,
  onFlip,
  onRateCard,
  onNext,
  onPrev,
}: FlashcardViewerProps) {
  const [showHint, setShowHint] = useState(false);
  const card = cards[currentIndex];

  if (!card) return null;

  const currentStatus = masteryMap[card.id] || "unreviewed";
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  const handleFlipClick = () => {
    onFlip();
  };

  const handleRate = (status: "mastered" | "learning") => {
    setShowHint(false);
    onRateCard(status);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Header and progress */}
      <div className="w-full flex items-center justify-between mb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          {isReTestMode && (
            <span className="px-2 py-0.5 bg-amber-400 border border-black font-bold uppercase text-[10px]">
              Reviewing Missed Cards
            </span>
          )}
          <span className="font-bold">
            CARD {String(currentIndex + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">{progressPercent}% complete</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 border border-black bg-neutral-200 mb-6 overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Flashcard container */}
      <div className="w-full perspective-1000 min-h-[320px] sm:min-h-[360px]">
        <div
          onClick={handleFlipClick}
          className={`w-full h-full min-h-[320px] sm:min-h-[360px] relative transition-transform duration-500 transform-style-3d cursor-pointer ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Card front */}
          <div className="absolute inset-0 w-full h-full backface-hidden border-2 border-black bg-white p-6 sm:p-8 flex flex-col justify-between shadow-brutal select-none">
            {/* Category header */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 border border-black bg-neutral-100">
                {card.category || "Concept"}
              </span>
              <span className="text-[11px] font-mono text-neutral-400">Click to flip</span>
            </div>

            {/* Question */}
            <div className="my-auto py-4 text-center">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                Question
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black leading-snug">
                {card.front}
              </h3>
            </div>

            {/* Hint and flip button */}
            <div className="flex items-center justify-between pt-4 border-t border-dashed border-neutral-300">
              {card.hint ? (
                <div>
                  {!showHint ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(true);
                      }}
                      className="text-xs font-mono text-amber-700 hover:text-amber-900 underline font-semibold flex items-center gap-1"
                    >
                      Need a hint?
                    </button>
                  ) : (
                    <p className="text-xs font-mono bg-amber-50 border border-amber-300 px-2.5 py-1 text-amber-950">
                      Hint: {card.hint}
                    </p>
                  )}
                </div>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFlip();
                }}
                className="text-xs font-mono font-bold px-3 py-1 border border-black bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                FLIP CARD
              </button>
            </div>
          </div>

          {/* Card back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-2 border-black bg-neutral-900 text-white p-6 sm:p-8 flex flex-col justify-between shadow-brutal select-none">
            {/* Answer header */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 border border-white bg-neutral-800 text-amber-400">
                Answer
              </span>
              <span className="text-[11px] font-mono text-neutral-400">Click to flip back</span>
            </div>

            {/* Answer */}
            <div className="my-auto py-4">
              <p className="text-base sm:text-lg font-medium leading-relaxed text-neutral-100 font-sans">
                {card.back}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-700 text-xs font-mono text-neutral-400">
              <span>Rate your recall below</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFlip();
                }}
                className="text-xs font-mono font-bold px-2.5 py-1 border border-neutral-500 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
              >
                Flip to Front
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons */}
      <div className="w-full mt-6 space-y-3">
        <div className="text-center">
          <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">
            Rate Your Recall
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleRate("learning")}
            className={`py-3.5 px-4 border-2 border-black font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-brutal shadow-brutal-hover active:translate-y-0.5 ${
              currentStatus === "learning"
                ? "bg-amber-400 text-black border-black"
                : "bg-white text-black hover:bg-amber-50"
            }`}
          >
            Need Review
          </button>

          <button
            type="button"
            onClick={() => handleRate("mastered")}
            className={`py-3.5 px-4 border-2 border-black font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-brutal shadow-brutal-hover active:translate-y-0.5 ${
              currentStatus === "mastered"
                ? "bg-emerald-400 text-black border-black"
                : "bg-black text-white hover:bg-neutral-800"
            }`}
          >
            Got It
          </button>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="text-xs font-mono font-semibold px-3 py-1.5 border border-black bg-white hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <span className="text-xs font-mono text-neutral-500">
            {currentIndex + 1} of {cards.length}
          </span>

          <button
            type="button"
            onClick={onNext}
            disabled={currentIndex === cards.length - 1}
            className="text-xs font-mono font-semibold px-3 py-1.5 border border-black bg-white hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
