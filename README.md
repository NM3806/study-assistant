# Study Assistant

A Next.js application that converts study notes into interactive flashcards with confidence ratings and missed-card review.

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Google Gemini API.

---

## Quick Reference

| Feature | File | Summary |
| :--- | :--- | :--- |
| **API Route** | [`app/api/generate/route.ts`](file:///home/nm3806/.gemini/antigravity-ide/scratch/study-assistant/app/api/generate/route.ts) | Server-side Gemini API calls + offline mock fallback |
| **JSON Parser** | [`lib/parser.ts`](file:///home/nm3806/.gemini/antigravity-ide/scratch/study-assistant/lib/parser.ts) | Cleans and repairs malformed AI responses |
| **Deck State** | [`hooks/useStudyDeck.ts`](file:///home/nm3806/.gemini/antigravity-ide/scratch/study-assistant/hooks/useStudyDeck.ts) | Handles deck progress, abort requests, and re-tests |
| **Card Viewer** | [`components/FlashcardViewer.tsx`](file:///home/nm3806/.gemini/antigravity-ide/scratch/study-assistant/components/FlashcardViewer.tsx) | 3D card flip with keyboard shortcuts |
| **Loading State** | [`components/GranularLoader.tsx`](file:///home/nm3806/.gemini/antigravity-ide/scratch/study-assistant/components/GranularLoader.tsx) | Step-by-step progress indicator |
| **Completion Screen** | [`components/CompletionScreen.tsx`](file:///home/nm3806/.gemini/antigravity-ide/scratch/study-assistant/components/CompletionScreen.tsx) | Score summary and missed-card review button |
| **Sample Presets** | [`lib/presets.ts`](file:///home/nm3806/.gemini/antigravity-ide/scratch/study-assistant/lib/presets.ts) | Built-in test topics for quick evaluation |

---

## Setup & Running Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Configure API key (Optional)
```bash
cp .env.example .env.local
```
Add your Gemini API key in `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** If no API key is provided, the app uses built-in sample generation so all features can be tested immediately.

### 3. Run dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Architecture & Key Decisions

### 1. API Route (`app/api/generate/route.ts`)
- **Server-side only**: Keeps the Gemini API key secure on the server.
- **Low temperature (0.2)**: Ensures more consistent JSON formatting.
- **Offline fallback**: Returns sample cards if no API key is configured or if the request fails.

### 2. JSON Parsing (`lib/parser.ts`)
Handles common LLM formatting issues automatically:
- Strips markdown code blocks (` ```json ... ``` `).
- Extracts outer `{ ... }` or `[ ... ]` brackets if conversational text is present.
- Fixes trailing commas and invalid control characters.
- Validates that each card has valid `front` and `back` text (with fallbacks like `question`/`answer`).
- Drops invalid cards instead of failing the entire deck.

### 3. State Management (`hooks/useStudyDeck.ts`)
- **Request Cancellation**: Uses `AbortController` to cancel in-flight requests when the user starts a new search or clicks Cancel.
- **Clear State Flow**: Tracks states: `IDLE` -> `LOADING` -> `STUDYING` -> `COMPLETED`.

### 4. Review Flow & UX
- **Card Flip**: CSS 3D transforms for flipping cards.
- **Keyboard Shortcuts**:
  - `Space` / `Enter`: Flip card
  - `1` / `ArrowLeft`: Need Review
  - `2` / `ArrowRight`: Got It
  - `R`: Reset to front
- **Re-test Missed Cards**: Lets users practice only the cards they marked as "Need Review" until all are mastered.

---

## Project Structure

```
study-assistant/
├── app/
│   ├── api/generate/route.ts    # Backend route for Gemini API
│   ├── globals.css              # Styling & 3D card flip rules
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   ├── CompletionScreen.tsx     # Score summary & re-test screen
│   ├── ErrorBanner.tsx          # Error message with retry button
│   ├── FlashcardViewer.tsx      # Interactive flashcard component
│   ├── GranularLoader.tsx       # Progress indicator
│   ├── Header.tsx               # App header
│   └── InputSection.tsx         # Note input & presets
├── hooks/
│   └── useStudyDeck.ts          # State machine for flashcard sessions
├── lib/
│   ├── parser.ts                # JSON cleanup and validation
│   ├── presets.ts               # Sample study topics
│   └── types.ts                 # TypeScript type definitions
├── .env.example
├── package.json
└── tsconfig.json
```

---

## AI Usage Disclosure

- **Prompt Design**: Used AI to test prompts and identify JSON formatting edge cases.
- **Boilerplate**: Used AI for initial component scaffolds and CSS transform classes.
- **Manual Implementation & Review**: Custom parser logic, state machine transitions, abort handling, keyboard navigation, and error boundaries were manually implemented and verified.

---

## Time Spent & Limitations

- **Total Time**: ~4.5 hours (Planning: 45m, API & Prompts: 1h, Deck Logic: 1.5h, Parser & Error Handling: 1h, Testing & Polish: 15m)

### Known Limitations:
- **No Text-to-Speech**: Excluded to avoid extra external dependencies.
- **No In-Place Card Editing**: Cards cannot be edited manually before starting a session.
- **No Export Options**: Exporting to Anki (.apkg) or CSV can be added in a future update.
