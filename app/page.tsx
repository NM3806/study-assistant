"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { InputSection } from "@/components/InputSection";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (text: string, count: number) => {
    setIsGenerating(true);
    // In Phase 1, basic state trigger layout
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {/* Intro Tagline */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-black bg-amber-400 font-mono text-xs font-bold uppercase mb-4 shadow-brutal-sm">
            <span>⚡ High-Signal Active Recall</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black leading-tight">
            Turn messy notes into structured study cards.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 font-sans">
            Paste raw text, generate validated flashcards, test your memory, and automatically drill your weakest concepts.
          </p>
        </div>

        {/* Raw Input Layout */}
        <InputSection
          onGenerate={handleGenerate}
          isLoading={isGenerating}
          onCancel={() => setIsGenerating(false)}
        />
      </main>

      <footer className="w-full border-t-2 border-black bg-white py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-600 gap-2">
          <span>STUDY ASSISTANT // NEXT.js + GEMINI</span>
          <span>STARK STRUCTURAL DESIGN</span>
        </div>
      </footer>
    </div>
  );
}
