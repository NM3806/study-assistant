import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface GenerateRequestBody {
  text: string;
  count?: number;
}

function generateMockDeck(inputText: string, count: number = 6) {
  const lines = inputText.split("\n").filter((l) => l.trim().length > 0);
  const title = lines[0]?.slice(0, 50).replace(/[^\w\s-]/g, "") || "Custom Study Deck";

  const cards = [];
  for (let i = 0; i < Math.min(count, Math.max(3, lines.length)); i++) {
    const line = lines[i % lines.length] || `Concept #${i + 1}`;
    cards.push({
      id: `card-${i + 1}`,
      front: line.length > 80 ? `${line.slice(0, 77)}...?` : `What is the core meaning of: "${line}"?`,
      back: `Key Takeaway: ${line}. Focus on understanding the core mechanism, definitions, and applications in context.`,
      hint: "Recall the key relationships described in the original source material.",
      category: "Core Concept",
    });
  }

  return {
    topic: title,
    summary: `Structured review cards generated from provided study notes (${cards.length} cards).`,
    cards,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequestBody = await req.json();
    const { text, count = 6 } = body;

    if (!text || typeof text !== "string" || text.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide valid study notes or text excerpt (minimum 5 characters)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Graceful offline/demo fallback if API key is not configured in environment
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      const mockDeck = generateMockDeck(text, count);
      return NextResponse.json(mockDeck, { status: 200 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are an expert tutor and flashcard engineer.
Your task is to analyze raw study notes or text and convert them into high-signal, active-recall flashcards.

Rules:
1. Return ONLY valid, parseable JSON conforming strictly to the schema below.
2. Do NOT wrap output with conversational text or markdown explanation.
3. Every card must test a discrete, testable concept. The front must be an active question or clear prompt. The back must be a clear, concise explanation.
4. Provide a helpful 1-sentence hint for each card.
5. Extract ${count} flashcards.

JSON Schema:
{
  "topic": "Concise topic title",
  "summary": "1-2 sentence overview of the subject",
  "cards": [
    {
      "id": "card-1",
      "front": "Clear question or active prompt?",
      "back": "Direct, accurate explanation with key takeaway.",
      "hint": "Brief memory clue",
      "category": "Sub-topic or category name"
    }
  ]
}`;

    const prompt = `STUDY NOTES TO CONVERT:\n"""\n${text}\n"""\n\nGenerate exactly ${count} flashcards in valid JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const outputText = response.text;

    if (!outputText) {
      return NextResponse.json(
        { error: "Model returned an empty response. Please try again with different notes." },
        { status: 502 }
      );
    }

    let parsedData;
    try {
      parsedData = JSON.parse(outputText);
    } catch {
      // Return raw output with 200 so client-side defensive parser can sanitize and extract
      return NextResponse.json({ raw: outputText }, { status: 200 });
    }

    return NextResponse.json(parsedData, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("API /api/generate error:", err);

    return NextResponse.json(
      {
        error: err.message || "Failed to generate flashcards from the AI model.",
      },
      { status: 500 }
    );
  }
}
