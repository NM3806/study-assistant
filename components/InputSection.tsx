import React, { useState } from "react";
import { PRESET_SAMPLES, PresetSample } from "@/lib/presets";

interface InputSectionProps {
  onGenerate: (text: string, count: number) => void;
  isLoading: boolean;
  onCancel?: () => void;
}

export function InputSection({ onGenerate, isLoading, onCancel }: InputSectionProps) {
  const [inputText, setInputText] = useState("");
  const [cardCount, setCardCount] = useState<number>(6);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const handleSelectPreset = (preset: PresetSample) => {
    setInputText(preset.text);
    setSelectedPresetId(preset.id);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setSelectedPresetId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onGenerate(inputText.trim(), cardCount);
  };

  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="border-2 border-black bg-white p-6 sm:p-8 shadow-brutal">
        {/* Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b-2 border-black">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
              Paste Notes or Topic Excerpt
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-600">Cards:</span>
            {[4, 6, 8].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setCardCount(count)}
                disabled={isLoading}
                className={`text-xs font-mono px-2.5 py-1 border border-black font-semibold transition-colors ${
                  cardCount === count
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-neutral-100"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Preset chips */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono font-semibold uppercase text-neutral-700">
              Quick Test Presets:
            </label>
            {inputText && (
              <button
                type="button"
                onClick={() => {
                  setInputText("");
                  setSelectedPresetId(null);
                }}
                disabled={isLoading}
                className="text-[11px] font-mono text-neutral-500 hover:text-black underline"
              >
                Clear text
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_SAMPLES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className={`text-xs font-medium px-3 py-1.5 border border-black text-left transition-all ${
                  selectedPresetId === preset.id
                    ? "bg-amber-400 font-bold shadow-brutal-sm"
                    : "bg-neutral-50 hover:bg-neutral-100"
                }`}
              >
                <span className="font-mono text-[10px] block text-neutral-600 uppercase">
                  {preset.category}
                </span>
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              id="raw-notes-input"
              value={inputText}
              onChange={handleTextChange}
              placeholder="Paste raw lecture notes, article excerpts, definitions, or bullet points here..."
              rows={7}
              disabled={isLoading}
              className="w-full p-4 border-2 border-black font-sans text-sm sm:text-base leading-relaxed bg-[#FAFAFA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black placeholder:text-neutral-400 resize-y"
            />
            <div className="flex items-center justify-between mt-1.5 px-1 text-xs font-mono text-neutral-500">
              <span>{charCount} characters · {wordCount} words</span>
              <span>Min ~20 characters</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-neutral-500 font-mono text-center sm:text-left">
              Output will be validated into high-signal study cards.
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isLoading && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto px-4 py-3 border-2 border-red-600 text-red-700 bg-red-50 hover:bg-red-100 font-mono text-xs font-bold uppercase transition-all shadow-brutal-sm active:translate-y-0.5"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={charCount < 10 || isLoading}
                className="w-full sm:w-auto px-6 py-3 border-2 border-black bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:border-neutral-300 disabled:cursor-not-allowed font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-brutal shadow-brutal-hover active:translate-y-0.5"
              >
                {isLoading ? "Generating Deck..." : "Generate Flashcards →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
