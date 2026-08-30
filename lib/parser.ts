import { Flashcard, StudyDeck } from "./types";

// Extracts and parses JSON from model output, handling code blocks, brackets, and syntax errors.
export function extractAndParseJSON(rawInput: unknown): unknown {
  if (typeof rawInput !== "string") {
    return rawInput;
  }

  let cleaned = rawInput.trim();

  // Strip markdown code blocks
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  // Try standard parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue to fallback extractors
  }

  // Match outermost object brackets
  const jsonObjectMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) {
    try {
      const sanitized = sanitizeJSONString(jsonObjectMatch[0]);
      return JSON.parse(sanitized);
    } catch {
      // Try array match if object parsing fails
    }
  }

  const jsonArrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (jsonArrayMatch) {
    try {
      const sanitized = sanitizeJSONString(jsonArrayMatch[0]);
      return JSON.parse(sanitized);
    } catch {
      // Unrecoverable format
    }
  }

  throw new Error("Could not extract a valid JSON structure from the AI output.");
}

// Removes trailing commas and invalid control characters
function sanitizeJSONString(jsonStr: string): string {
  return jsonStr
    .replace(/,\s*([\]}])/g, "$1") // Remove trailing commas
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control characters
}

// Validates and formats cards into a StudyDeck object
export function validateAndRepairDeck(parsed: unknown, defaultTopic: string = "Study Deck"): StudyDeck {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid response format: Expected a JSON object or array.");
  }

  let topic = defaultTopic;
  let summary = "Custom study flashcard set.";
  let rawCards: unknown[] = [];

  // Handle array input
  if (Array.isArray(parsed)) {
    rawCards = parsed;
  }
  // Handle object input
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

    // Resolve front text
    const frontCandidate = cardObj.front || cardObj.question || cardObj.prompt || cardObj.term;
    // Resolve back text
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
