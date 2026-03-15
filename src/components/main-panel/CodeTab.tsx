"use client";

import { useState } from "react";
import CodeViewer from "@/components/code/CodeViewer";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage, CodeEntry } from "@/engine/types";

const LANGUAGE_LABELS: { id: SupportedLanguage; label: string }[] = [
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
];

type Props = {
  codeByLanguage: Record<SupportedLanguage, CodeEntry>;
  stepLabel?: string;
  codeAlternativeLabel?: "Iterative" | "Recursive";
  codeAlternativeByLanguage?: Record<SupportedLanguage, CodeEntry>;
};

export default function CodeTab({
  codeByLanguage,
  stepLabel,
  codeAlternativeLabel,
  codeAlternativeByLanguage,
}: Props) {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [showAlternative, setShowAlternative] = useState(false);

  const hasToggle = !!codeAlternativeByLanguage && !!codeAlternativeLabel;
  const primaryLabel = codeAlternativeLabel === "Recursive" ? "Iterative" : "Recursive";

  const activeCodeByLanguage = showAlternative && codeAlternativeByLanguage
    ? codeAlternativeByLanguage
    : codeByLanguage;
  const displayStepLabel = showAlternative ? undefined : stepLabel;

  const codeEntry = activeCodeByLanguage[selectedLanguage];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Language selector */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-zinc-800 shrink-0">
        {LANGUAGE_LABELS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSelectedLanguage(id)}
            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
              selectedLanguage === id
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Iterative / Recursive toggle */}
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

      <div className="flex-1 overflow-hidden">
        <CodeViewer
          code={codeEntry.code}
          language={selectedLanguage}
          lineMap={codeEntry.lineMap}
          stepLabel={displayStepLabel}
        />
      </div>
    </div>
  );
}
