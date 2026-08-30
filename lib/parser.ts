import { Flashcard, StudyDeck } from "./types";

/**
 * Defensive JSON extraction & sanitizer
 * Handles markdown fences, surrounding conversational prose, trailing commas, and malformed structures.
 */
export function extractAndParseJSON(rawInput: unknown): unknown {
  if (typeof rawInput !== "string") {
    return rawInput;
  }

  let cleaned = rawInput.trim();

  // 1. Strip markdown code block fences (```json ... ``` or ``` ...)
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  // 2. Try standard JSON.parse first
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue to advanced recovery
  }

  // 3. Extract outermost JSON object or array using regex match
  const jsonObjectMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) {
    try {
      const sanitized = sanitizeJSONString(jsonObjectMatch[0]);
      return JSON.parse(sanitized);
    } catch {
      // Continue to next recovery attempt
    }
  }

  const jsonArrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (jsonArrayMatch) {
    try {
      const sanitized = sanitizeJSONString(jsonArrayMatch[0]);
      return JSON.parse(sanitized);
    } catch {
      // Continue
    }
  }

  throw new Error("Could not extract a valid JSON structure from the AI output.");
}

/**
 * Clean common LLM JSON syntax issues like trailing commas before closing braces/brackets
 */
function sanitizeJSONString(jsonStr: string): string {
  return jsonStr
    .replace(/,\s*([\]}])/g, "$1") // Remove trailing commas
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove invalid control characters
}

/**
 * Validates and repairs the parsed data into a strict StudyDeck shape
 */
export function validateAndRepairDeck(parsed: unknown, defaultTopic: string = "Study Deck"): StudyDeck {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid response format: Expected a JSON object or array.");
  }

  let topic = defaultTopic;
  let summary = "Custom AI-generated flashcard study set.";
  let rawCards: unknown[] = [];

  // Case A: Root is array of cards [ { front, back }, ... ]
  if (Array.isArray(parsed)) {
    rawCards = parsed;
  }
  // Case B: Root is object { cards: [...], topic?: "...", summary?: "..." }
  else {
    const obj = parsed as Record<string, unknown>;
    if (typeof obj.topic === "string" && obj.topic.trim()) {
      topic = obj.topic.trim();
    }
    if (typeof obj.summary === "string" && obj.summary.trim()) {
      summary = obj.summary.trim();
    }
    if (Array.isArray(obj.cards)) {
      rawCards = obj.cards;
    } else if (Array.isArray(obj.flashcards)) {
      rawCards = obj.flashcards;
    }
  }

  const validCards: Flashcard[] = [];

  rawCards.forEach((rawCard, index) => {
    if (!rawCard || typeof rawCard !== "object") return;
    const cardObj = rawCard as Record<string, unknown>;

    // Defensive check for question / front
    const frontCandidate = cardObj.front || cardObj.question || cardObj.prompt || cardObj.term;
    // Defensive check for answer / back
    const backCandidate = cardObj.back || cardObj.answer || cardObj.definition || cardObj.explanation;

    if (
      typeof frontCandidate === "string" &&
      frontCandidate.trim().length >= 2 &&
      typeof backCandidate === "string" &&
      backCandidate.trim().length >= 2
    ) {
      validCards.push({
        id: typeof cardObj.id === "string" && cardObj.id.trim() ? cardObj.id : `card-${index + 1}`,
        front: frontCandidate.trim(),
        back: backCandidate.trim(),
        hint: typeof cardObj.hint === "string" ? cardObj.hint.trim() : undefined,
        category: typeof cardObj.category === "string" ? cardObj.category.trim() : "Core Concept",
      });
    }
  });

  if (validCards.length === 0) {
    throw new Error("No valid flashcards could be parsed from the model response.");
  }

  return {
    topic,
    summary,
    cards: validCards,
  };
}
