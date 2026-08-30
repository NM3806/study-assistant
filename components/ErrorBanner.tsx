import React, { useState } from "react";
import { GenerationError } from "@/lib/types";

interface ErrorBannerProps {
  error: GenerationError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorBanner({ error, onRetry, onDismiss }: ErrorBannerProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getErrorBadge = (code?: string) => {
    switch (code) {
      case "EMPTY_INPUT":
        return "INPUT REQUIRED";
      case "RATE_LIMITED":
        return "RATE LIMITED (429)";
      case "MALFORMED_OUTPUT":
        return "MALFORMED AI OUTPUT";
      case "ABORTED":
        return "REQUEST CANCELLED";
      case "API_ERROR":
      default:
        return "SYSTEM NOTICE";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 border-2 border-black bg-white shadow-brutal p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 border-2 border-black bg-red-500 text-white font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
            !
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 border border-black bg-red-100 text-red-950">
                {getErrorBadge(error.code)}
              </span>
            </div>
            <p className="text-sm font-semibold text-neutral-900 leading-snug">
              {error.message}
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-neutral-400 hover:text-black font-mono text-sm font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {error.rawOutput && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-mono text-neutral-600 hover:text-black underline"
          >
            {showDetails ? "Hide raw output" : "Show diagnostic output"}
          </button>
          {showDetails && (
            <pre className="mt-2 p-3 bg-neutral-100 border border-black text-[11px] font-mono overflow-x-auto text-neutral-800 max-h-40">
              {error.rawOutput}
            </pre>
          )}
        </div>
      )}

      {error.canRetry && onRetry && (
        <div className="mt-4 pt-3 border-t border-dashed border-neutral-300 flex items-center justify-between">
          <span className="text-xs font-mono text-neutral-500">
            Your original notes are preserved.
          </span>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-neutral-800 font-mono text-xs font-bold uppercase tracking-wider shadow-brutal-sm active:translate-y-0.5 transition-all"
          >
            Retry Generation ↺
          </button>
        </div>
      )}
    </div>
  );
}
