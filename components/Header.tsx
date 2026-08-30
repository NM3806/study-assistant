import React from "react";

interface HeaderProps {
  deckActive?: boolean;
  onReset?: () => void;
}

export function Header({ deckActive, onReset }: HeaderProps) {
  return (
    <header className="w-full border-b-2 border-black bg-white sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-black" />
          <h1 className="font-mono font-bold tracking-tight text-lg sm:text-xl text-black">
            STUDY ASSISTANT
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {deckActive && onReset && (
            <button
              onClick={onReset}
              className="text-xs font-mono font-semibold px-3 py-1.5 border-2 border-black bg-white hover:bg-neutral-100 active:translate-y-0.5 transition-all shadow-brutal-sm"
            >
              ← NEW DECK
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono uppercase px-2 py-0.5 border border-black bg-neutral-100">
            Flashcards
          </span>
        </div>
      </div>
    </header>
  );
}
