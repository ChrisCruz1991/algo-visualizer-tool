"use client";

import { useState } from "react";
import CodeViewer from "@/components/code/CodeViewer";

type Props = {
  code: string;
  highlightedLines: number[];
  codeAlternativeLabel?: "Iterative" | "Recursive";
  codeAlternative?: string;
};

export default function CodeTab({ code, highlightedLines, codeAlternativeLabel, codeAlternative }: Props) {
  const [showAlternative, setShowAlternative] = useState(false);

  const primaryLabel = codeAlternativeLabel === "Recursive" ? "Iterative" : "Recursive";
  const hasToggle = !!codeAlternative && !!codeAlternativeLabel;
  const displayCode = showAlternative && codeAlternative ? codeAlternative : code;
  const displayLines = showAlternative ? [] : highlightedLines;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {hasToggle && (
        <div className="flex items-center gap-1 px-4 py-2 border-b border-zinc-800 shrink-0">
          <button
            onClick={() => setShowAlternative(false)}
            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
              !showAlternative
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {primaryLabel}
          </button>
          <button
            onClick={() => setShowAlternative(true)}
            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
              showAlternative
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {codeAlternativeLabel}
          </button>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <CodeViewer code={displayCode} highlightedLines={displayLines} />
      </div>
    </div>
  );
}
