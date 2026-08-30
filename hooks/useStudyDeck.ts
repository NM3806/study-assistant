import { useState, useRef, useCallback } from "react";
import { StudyDeck, Flashcard, CardMastery, GenerationError } from "@/lib/types";
import { extractAndParseJSON, validateAndRepairDeck } from "@/lib/parser";

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
      message: "Generation was cancelled by the user.",
      code: "ABORTED",
      canRetry: true,
    });
  }, []);

  const generateDeck = useCallback(
    async (text: string, count: number = 6) => {
      // Cancel any pending request
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
          const isRateLimit = response.status === 429;
          throw {
            message: errData.error || `Server responded with status ${response.status}`,
            code: isRateLimit ? "RATE_LIMITED" : "API_ERROR",
          };
        }

        const data = await response.json();

        // Extract raw payload if wrapped
        let rawPayload = data;
        if (data && typeof data === "object" && "raw" in data) {
          rawPayload = data.raw;
        }

        const parsed = extractAndParseJSON(rawPayload);
        const validatedDeck = validateAndRepairDeck(parsed, "Custom Study Set");

        setDeck(validatedDeck);
        setActiveCards(validatedDeck.cards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setMasteryMap({});
        setIsCompleted(false);
        setIsReTestMode(false);
        setError(null);
      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError" || (err as { name?: string })?.name === "AbortError") {
          return; // Request was cancelled by user
        }

        const customErr = err as { message?: string; code?: GenerationError["code"]; rawOutput?: string };
        console.error("Generation error:", err);

        setError({
          message: customErr.message || "Failed to parse structured flashcards from the response.",
          code: customErr.code || "MALFORMED_OUTPUT",
          rawOutput: customErr.rawOutput,
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

  const dismissError = useCallback(() => {
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
    dismissError,
    flipCard,
    rateCurrentCard,
    nextCard,
    prevCard,
    reTestMissedCards,
    reviewAllCards,
    resetDeck,
  };
}
