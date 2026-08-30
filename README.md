# Study Assistant // AI-Powered Flashcard & Recall Engine

A high-signal, React/Next.js study tool that transforms raw lecture notes, textbooks, and free-form articles into structured, interactive flashcards with active recall mastery tracking and a dedicated "Re-test Missed Concepts" loop.

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Google Gemini.

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies
```bash
cd study-assistant
npm install
```

### 2. Configure Environment (Optional for Live Gemini API)
Copy the example environment file and add your Google Gemini API key:
```bash
cp .env.example .env.local
```
Add your key inside `.env.local`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key
```
> *Note: If no API key is provided, the application automatically switches to local structured synthesis mode so all features can be evaluated immediately without credentials.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

To test production build:
```bash
npm run build && npm start
```

---

## 🛠️ Architecture & Key Engineering Decisions

### 1. Secure Server-Side Proxy (`/app/api/generate/route.ts`)
- **Zero API Key Leakage**: Browser clients never interact with Google Gemini directly. All calls are routed through a Next.js Serverless Route Handler (`POST /api/generate`).
- **Strict JSON Enforcement**: The model is prompted with strict JSON schema instructions and low temperature (`0.2`) to maximize structural reliability and minimize hallucinated markdown artifacts.

### 2. Defensive AI Parsing & Fault Tolerance (`/lib/parser.ts`)
LLMs are inherently probabilistic and occasionally return conversational text, unescaped quotes, or markdown code fences (` ```json `). The app implements a multi-tiered defensive parsing pipeline:
1. **Markdown Fence Stripping**: Automatically extracts inner payload from markdown code blocks.
2. **Regex Bracket Extraction**: Searches for the outermost `{ ... }` or `[ ... ]` structure if conversational text wraps the response.
3. **Control Character & Trailing Comma Sanitization**: Cleans invalid control characters and dangling commas before parsing.
4. **Schema Shape Repair**: Validates that every card possesses required `front` and `back` strings (length >= 2) with fallback aliases (`question`, `term`, `answer`, `explanation`). Malformed individual items are dropped without crashing the entire deck.
5. **Actionable Error & Retry UI**: If output is unrecoverable, an explicit `ErrorBanner` displays the diagnostic reason, preserves the user's input notes, and offers a 1-click **Retry Generation** button.

### 3. Race Condition & Network Stability (`/hooks/useStudyDeck.ts`)
- **`AbortController` Integration**: Whenever a user submits a new prompt or clicks "Cancel Request", previous in-flight requests are immediately aborted. This prevents stale asynchronous responses from overwriting the latest UI state.

### 4. Focused Core Mastery Loop
- **Utilitarian High-Contrast UI**: Stark 2px solid borders, clean monochrome palette with safety-amber accents, tactile button states, and zero generic pastel blobs.
- **Granular Loading States**: Step-by-step micro-copy ("Ingesting source text...", "Synthesizing active recall pairs...", "Validating card schema...") rather than generic loading spinners.
- **Active Recall Flow**: Users flip 3D cards and rate their confidence with **"Got It!"** (mastered) vs. **"Need Review"** (missed).
- **"Re-Test Missed Cards" Engine**: Upon finishing a deck, the completion screen summarizes accuracy and provides a one-click re-test cycle that isolates and loops only the missed cards until 100% mastery is achieved.

---

## 🤖 AI Usage Note

In accordance with the assignment guidelines, here is an honest disclosure of how AI tools were used during development:
- **Ideation & Architecture Planning**: Used to refine the prompt engineering strategy and brainstorm regex edge cases for defensive JSON sanitization.
- **Code Assistance**: Used AI to scaffold boilerplate component structure and refine the CSS 3D card flip perspective transformations.
- **All Core Logic Verified**: All state machine transitions (`useStudyDeck`), error boundaries, abort controller wiring, schema validators, and responsive styles were manually reviewed and tested to ensure bug-free execution.

---

## ⏱️ Time Spent & Limitations

- **Total Time Spent**: ~4.5 hours (Planning: 45m, Backend API & Prompt: 1h, Flashcard & State Flow: 1.5h, Defensive Parsing & Error Handling: 1h, Polish & Verification: 15m).

### Current Limitations & Future Scope:
- **Audio Pronunciation**: Text-to-speech for vocabulary flashcards was excluded to keep bundle size minimal.
- **Card Editing**: Users cannot currently edit individual card text in-place before starting the review.
- **Export Options**: Exporting decks to Anki (.apkg) or CSV can be added in future iterations.
