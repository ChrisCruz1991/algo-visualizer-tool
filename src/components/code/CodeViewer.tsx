"use client";

import { useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { SupportedLanguage, LineMap } from "@/engine/types";

const SYNTAX_LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
};

type Props = {
  code: string;
  language: SupportedLanguage;
  lineMap: LineMap;
  stepLabel?: string;
};

export default function CodeViewer({ code, language, lineMap, stepLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLines = stepLabel ? (lineMap[stepLabel] ?? []) : [];

  useEffect(() => {
    if (activeLines.length === 0 || !containerRef.current) return;
    const lineNumber = activeLines[0];
    const lineHeight = 22; // px, matches the pre style
    const container = containerRef.current;
    const target = (lineNumber - 1) * lineHeight;
    const containerHeight = container.clientHeight;
    const currentScroll = container.scrollTop;
    if (
      target < currentScroll ||
      target > currentScroll + containerHeight - lineHeight * 3
    ) {
      container.scrollTo({ top: Math.max(0, target - containerHeight / 2), behavior: "smooth" });
    }
  }, [activeLines]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto text-sm"
      style={{ background: "#1e1e1e" }}
    >
      <SyntaxHighlighter
        language={SYNTAX_LANGUAGE_MAP[language]}
        style={vscDarkPlus}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) => {
          const isHighlighted = activeLines.includes(lineNumber);
          return {
            style: {
              display: "block",
              backgroundColor: isHighlighted
                ? "rgba(255, 200, 0, 0.18)"
                : "transparent",
              borderLeft: isHighlighted
                ? "3px solid #fbbf24"
                : "3px solid transparent",
            },
          };
        }}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: "22px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
