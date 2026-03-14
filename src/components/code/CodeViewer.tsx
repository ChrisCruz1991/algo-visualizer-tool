"use client";

import { useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  code: string;
  highlightedLines: number[];
};

export default function CodeViewer({ code, highlightedLines }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedLines.length === 0 || !containerRef.current) return;
    const lineNumber = highlightedLines[0];
    // react-syntax-highlighter renders lines as spans; approximate scroll by line height
    const lineHeight = 22; // px, matches the pre style
    const container = containerRef.current;
    const target = (lineNumber - 1) * lineHeight;
    const containerHeight = container.clientHeight;
    const currentScroll = container.scrollTop;
    // Only scroll if the line is outside the visible area
    if (
      target < currentScroll ||
      target > currentScroll + containerHeight - lineHeight * 3
    ) {
      container.scrollTo({ top: Math.max(0, target - containerHeight / 2), behavior: "smooth" });
    }
  }, [highlightedLines]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto text-sm"
      style={{ background: "#1e1e1e" }}
    >
      <SyntaxHighlighter
        language="typescript"
        style={vscDarkPlus}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) => {
          const isHighlighted = highlightedLines.includes(lineNumber);
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
