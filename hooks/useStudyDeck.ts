import { useState, useRef, useCallback } from "react";
import { StudyDeck, Flashcard, CardMastery, GenerationError } from "@/lib/types";

export function useStudyDeck() {
  const [deck, setDeck] = useState<StudyDeck | null>(null);
  const [activeCards, setActiveCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteryMap, setMasteryMap] = useState<Record<string, CardMastery>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReTestMode, setIsReTestMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GenerationError | null>(null);
  const [lastInputText, setLastInputText] = useState("");
  const [lastCount, setLastCount] = useState(6);

  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setError({
      message: "Generation was cancelled.",
      code: "ABORTED",
      canRetry: true,
    });
  }, []);

  const generateDeck = useCallback(
    async (text: string, count: number = 6) => {
      // Prevent race conditions by aborting any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);
      setLastInputText(text);
      setLastCount(count);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, count }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with status ${response.status}`);
        }

        const data = await response.json();

        // Check if server returned raw text or structured object
        const rawContent = data.raw || data;
        let validatedDeck: StudyDeck;

        if (rawContent && typeof rawContent === "object" && Array.isArray(rawContent.cards)) {
          validatedDeck = rawContent as StudyDeck;
        } else {
          // If raw string or slightly malformed
          throw new Error("Unable to parse structured flashcards from response.");
        }

        if (!validatedDeck.cards || validatedDeck.cards.length === 0) {
          throw new Error("No flashcards were generated from the provided text.");
        }

        setDeck(validatedDeck);
        setActiveCards(validatedDeck.cards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setMasteryMap({});
        setIsCompleted(false);
        setIsReTestMode(false);
        setError(null);
      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError") {
          return; // Intentionally aborted, do not trigger error state
        }
        console.error("Deck generation error:", err);
        setError({
          message: (err as Error)?.message || "An unexpected error occurred while generating flashcards.",
          code: "API_ERROR",
          canRetry: true,
        });
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    []
  );

  const retryGeneration = useCallback(() => {
    if (lastInputText) {
      generateDeck(lastInputText, lastCount);
    }
  }, [lastInputText, lastCount, generateDeck]);

  const flipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const rateCurrentCard = useCallback(
    (status: "mastered" | "learning") => {
      const currentCard = activeCards[currentIndex];
      if (!currentCard) return;

      setMasteryMap((prev) => ({
        ...prev,
        [currentCard.id]: status,
      }));

      setIsFlipped(false);

      if (currentIndex + 1 < activeCards.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    },
    [activeCards, currentIndex]
  );

  const nextCard = useCallback(() => {
    if (currentIndex + 1 < activeCards.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, activeCards.length]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const reTestMissedCards = useCallback(() => {
    const missed = activeCards.filter(
      (c) => masteryMap[c.id] === "learning" || !masteryMap[c.id]
    );

    if (missed.length === 0) return;

    setActiveCards(missed);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
    setIsReTestMode(true);
  }, [activeCards, masteryMap]);

  const reviewAllCards = useCallback(() => {
    if (!deck) return;
    setActiveCards(deck.cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteryMap({});
    setIsCompleted(false);
    setIsReTestMode(false);
  }, [deck]);

  const resetDeck = useCallback(() => {
    setDeck(null);
    setActiveCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteryMap({});
    setIsCompleted(false);
    setIsReTestMode(false);
    setError(null);
  }, []);

  return {
    deck,
    activeCards,
    currentIndex,
    isFlipped,
    masteryMap,
    isCompleted,
    isReTestMode,
    isLoading,
    error,
    lastInputText,
    generateDeck,
    cancelGeneration,
    retryGeneration,
    flipCard,
    rateCurrentCard,
    nextCard,
    prevCard,
    reTestMissedCards,
    reviewAllCards,
    resetDeck,
  };
}
