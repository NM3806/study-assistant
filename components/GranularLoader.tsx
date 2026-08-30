"use client";

import React, { useEffect, useState } from "react";

interface GranularLoaderProps {
  onCancel?: () => void;
}

const LOADING_STEPS = [
  { text: "Reading source text...", delay: 0 },
  { text: "Extracting key concepts...", delay: 1100 },
  { text: "Generating questions and answers...", delay: 2400 },
  { text: "Formatting flashcards...", delay: 3800 },
];

export function GranularLoader({ onCancel }: GranularLoaderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timers = LOADING_STEPS.map((step, index) => {
      return setTimeout(() => {
        setCurrentStepIndex(index);
      }, step.delay);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto border-2 border-black bg-white p-6 sm:p-8 shadow-brutal text-center">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 border-4 border-black border-t-amber-400 rounded-full animate-spin" />
      </div>

      <div className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
        Generating Cards
      </div>

      <h3 className="text-lg sm:text-xl font-black tracking-tight text-black min-h-[3rem] flex items-center justify-center">
        {LOADING_STEPS[currentStepIndex].text}
      </h3>

      {/* Progress steps */}
      <div className="grid grid-cols-4 gap-2 my-6">
        {LOADING_STEPS.map((_, index) => (
          <div
            key={index}
            className={`h-2 border border-black transition-all duration-300 ${
              index <= currentStepIndex ? "bg-black" : "bg-neutral-100"
            }`}
          />
        ))}
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-mono font-bold text-red-600 hover:text-red-800 underline uppercase tracking-wider"
        >
          Cancel Request
        </button>
      )}
    </div>
  );
}
