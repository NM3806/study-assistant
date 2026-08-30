"use client";

import React from "react";
import { Header } from "@/components/Header";
import { InputSection } from "@/components/InputSection";
import { GranularLoader } from "@/components/GranularLoader";
import { FlashcardViewer } from "@/components/FlashcardViewer";
import { CompletionScreen } from "@/components/CompletionScreen";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useStudyDeck } from "@/hooks/useStudyDeck";

export default function Home() {
  const {
    deck,
    activeCards,
    currentIndex,
    isFlipped,
    masteryMap,
    isCompleted,
    isReTestMode,
    isLoading,
    error,
    generateDeck,
    cancelGeneration,
    retryGeneration,
    dismissError,
    flipCard,
    rateCurrentCard,
    nextCard,
    prevCard,
    reTestMissedCards,
    reviewAllCards,
    resetDeck,
  } = useStudyDeck();

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC]">
      <Header deckActive={!!deck} onReset={resetDeck} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col items-center justify-center">
        {/* Loading State with Granular Micro-copy */}
        {isLoading && (
          <GranularLoader onCancel={cancelGeneration} />
        )}

        {/* Active Flashcard Viewer State */}
        {!isLoading && deck && !isCompleted && activeCards.length > 0 && (
          <div className="w-full space-y-6">
            <div className="text-center">
              <span className="text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
                Active Deck: {deck.topic}... 
              </span>
              <p className="text-xs text-neutral-600 max-w-md mx-auto line-clamp-1 mt-0.5">
                {deck.summary}
              </p>
            </div>

            <FlashcardViewer
              cards={activeCards}
              currentIndex={currentIndex}
              isFlipped={isFlipped}
              masteryMap={masteryMap}
              isReTestMode={isReTestMode}
              onFlip={flipCard}
              onRateCard={rateCurrentCard}
              onNext={nextCard}
              onPrev={prevCard}
            />
          </div>
        )}

        {/* Completion Screen State */}
        {!isLoading && deck && isCompleted && (
          <CompletionScreen
            cards={activeCards}
            masteryMap={masteryMap}
            isReTestMode={isReTestMode}
            onReTestMissed={reTestMissedCards}
            onReviewAll={reviewAllCards}
            onNewSession={resetDeck}
          />
        )}

        {/* Input Form State & Error UI */}
        {!isLoading && !deck && (
          <div className="w-full">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-black bg-amber-400 font-mono text-xs font-bold uppercase mb-4 shadow-brutal-sm">
                <span>High-Signal Active Recall</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black leading-tight">
                Turn messy notes into structured study cards.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 font-sans">
                Paste raw notes, generate structured flashcards, test your recall, and automatically drill your missed concepts.
              </p>
            </div>

            {error && (
              <ErrorBanner
                error={error}
                onRetry={retryGeneration}
                onDismiss={dismissError}
              />
            )}

            <InputSection
              onGenerate={generateDeck}
              isLoading={isLoading}
              onCancel={cancelGeneration}
            />
          </div>
        )}
      </main>

      <footer className="w-full border-t-2 border-black bg-white py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-600 gap-2">
          <span>STUDY ASSISTANT</span>
          <span>NM3806©</span>
        </div>
      </footer>
    </div>
  );
}
