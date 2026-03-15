"use client";

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
  /** Controlled: whether the alternative (e.g. Recursive) variant is active */
  showAlternative: boolean;
  /** Called when the user clicks the toggle. Undefined = toggle is always disabled */
  onVariantChange?: (showAlt: boolean) => void;
};

export default function CodeTab({
  codeByLanguage,
  stepLabel,
  codeAlternativeLabel,
  codeAlternativeByLanguage,
  showAlternative,
  onVariantChange,
}: Props) {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  const hasAlternative = !!codeAlternativeByLanguage && !!codeAlternativeLabel;
  const primaryLabel = codeAlternativeLabel === "Recursive" ? "Iterative" : "Recursive";

  const activeCodeByLanguage =
    showAlternative && codeAlternativeByLanguage ? codeAlternativeByLanguage : codeByLanguage;
  // Step highlighting only applies to the primary (iterative) variant
  const displayStepLabel = showAlternative ? undefined : stepLabel;

  const codeEntry = activeCodeByLanguage[selectedLanguage];

  // Whether the toggle buttons are interactive
  const toggleEnabled = hasAlternative && !!onVariantChange;
  const toggleTooltip = toggleEnabled
    ? undefined
    : "Only one implementation available for this algorithm.";

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

      {/* Iterative / Recursive toggle — always rendered */}
      <div
        className="flex items-center gap-1 px-4 py-2 border-b border-zinc-800 shrink-0"
        title={toggleTooltip}
      >
        <button
          onClick={toggleEnabled ? () => onVariantChange!(false) : undefined}
          disabled={!toggleEnabled}
          className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
            !showAlternative
              ? "bg-zinc-700 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          } ${!toggleEnabled ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          {primaryLabel}
        </button>
        <button
          onClick={toggleEnabled ? () => onVariantChange!(true) : undefined}
          disabled={!toggleEnabled}
          className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
            showAlternative
              ? "bg-zinc-700 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          } ${!toggleEnabled ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          {codeAlternativeLabel ?? "Recursive"}
        </button>
      </div>

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
