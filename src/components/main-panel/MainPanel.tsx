"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAlgorithmById } from "@/algorithms/index";
import type {
  SortSearchModule,
  GraphModule,
  TreeModule,
  LinkedListModule,
  LinkedListOperation,
  ComplexityRow,
  SupportedLanguage,
  CodeEntry,
} from "@/engine/types";
import TabBar, { type TabId } from "./TabBar";
import VisualizerTab from "./VisualizerTab";
import GraphVisualizerTab from "./GraphVisualizerTab";
import TreeVisualizerTab from "./TreeVisualizerTab";
import LinkedListVisualizerTab from "./LinkedListVisualizerTab";
import CodeTab from "./CodeTab";
import InfoTab from "./InfoTab";

const SPLIT_STORAGE_KEY = "panelSplitRatio";
const DEFAULT_SPLIT = 55; // percent for left panel

type Props = {
  algorithmId: string;
};

export default function MainPanel({ algorithmId }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("code");
  const [currentStepLabel, setCurrentStepLabel] = useState<string | undefined>(undefined);
  const [showAlternative, setShowAlternative] = useState(false);

  // Dynamic code/complexity — updated by LinkedListVisualizerTab when operation changes
  const [currentCodeByLanguage, setCurrentCodeByLanguage] = useState<
    Record<SupportedLanguage, CodeEntry> | undefined
  >(undefined);
  const [currentComplexity, setCurrentComplexity] = useState<
    ComplexityRow[] | undefined
  >(undefined);

  // Resizable panel split
  const [leftPercent, setLeftPercent] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SPLIT_STORAGE_KEY);
      if (stored) {
        const val = parseFloat(stored);
        if (!isNaN(val) && val >= 20 && val <= 80) return val;
      }
    }
    return DEFAULT_SPLIT;
  });
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const algorithm = getAlgorithmById(algorithmId);
  if (!algorithm) return null;

  // Reset dynamic state when algorithm changes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setShowAlternative(false);
    if (algorithm.category === "linked-list") {
      const ll = algorithm as LinkedListModule;
      setCurrentCodeByLanguage(ll.codeByOperationByLanguage["insert"]);
      setCurrentComplexity(ll.complexityByOperation["insert"]);
    } else {
      setCurrentCodeByLanguage(undefined);
      setCurrentComplexity(undefined);
    }
    setCurrentStepLabel(undefined);
  }, [algorithm]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleOperationChange = useCallback(
    (op: LinkedListOperation["type"]) => {
      if (algorithm.category === "linked-list") {
        const ll = algorithm as LinkedListModule;
        setCurrentCodeByLanguage(ll.codeByOperationByLanguage[op]);
        setCurrentComplexity(ll.complexityByOperation[op]);
      }
    },
    [algorithm]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleStepChange = useCallback(
    (_lines: number[], stepLabel?: string) => {
      setCurrentStepLabel(stepLabel);
    },
    []
  );

  // Resizable divider handlers
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawPercent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(80, Math.max(20, rawPercent));
      setLeftPercent(clamped);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      // Persist to localStorage
      setLeftPercent((prev) => {
        localStorage.setItem(SPLIT_STORAGE_KEY, String(prev));
        return prev;
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, []);

  const renderVisualizerPanel = () => {
    if (algorithm.category === "linked-list") {
      return (
        <LinkedListVisualizerTab
          algorithm={algorithm as LinkedListModule}
          onHighlightedLinesChange={handleStepChange}
          onOperationChange={handleOperationChange}
        />
      );
    }
    if (algorithm.category === "graph") {
      return (
        <GraphVisualizerTab
          algorithm={algorithm as GraphModule}
          onHighlightedLinesChange={handleStepChange}
          useAlternative={showAlternative}
        />
      );
    }
    if (algorithm.category === "tree") {
      return (
        <TreeVisualizerTab
          algorithm={algorithm as TreeModule}
          onHighlightedLinesChange={handleStepChange}
          useAlternative={showAlternative}
        />
      );
    }
    return (
      <VisualizerTab
        algorithm={algorithm as SortSearchModule}
        onHighlightedLinesChange={handleStepChange}
        useAlternative={showAlternative}
      />
    );
  };

  const isLinkedList = algorithm.category === "linked-list";
  const displayCodeByLanguage: Record<SupportedLanguage, CodeEntry> =
    currentCodeByLanguage ??
    (isLinkedList
      ? (algorithm as LinkedListModule).codeByOperationByLanguage["insert"]
      : (algorithm as SortSearchModule | GraphModule | TreeModule).codeByLanguage);

  const displayAlternativeByLanguage = isLinkedList
    ? undefined
    : (algorithm as SortSearchModule | GraphModule | TreeModule).codeAlternativeByLanguage;

  const hasAlternative = !isLinkedList && !!(algorithm as SortSearchModule).codeAlternativeByLanguage;
  const complexityAlt = !isLinkedList
    ? (algorithm as SortSearchModule).complexityAlternative
    : undefined;

  return (
    // Outer container: flex column (stacks on mobile, row on md+)
    <div className="flex flex-col md:flex-row h-full overflow-hidden" ref={containerRef}>
      {/* ── Left panel: Visualizer (always visible) ── */}
      <div
        className="flex flex-col overflow-hidden md:shrink-0"
        style={{ flexBasis: `${leftPercent}%` }}
      >
        {renderVisualizerPanel()}
      </div>

      {/* ── Resizable divider (desktop only) ── */}
      <div
        onMouseDown={handleDividerMouseDown}
        className="hidden md:flex w-1.5 bg-gray-200 hover:bg-indigo-400 active:bg-indigo-500 cursor-col-resize shrink-0 transition-colors duration-150 items-center justify-center"
        title="Drag to resize panels"
      />

      {/* ── Right panel: Code / Info tabs ── */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-hidden">
          <div className={`h-full ${activeTab === "code" ? "flex flex-col" : "hidden"}`}>
            <CodeTab
              codeByLanguage={displayCodeByLanguage}
              stepLabel={currentStepLabel}
              codeAlternativeLabel={isLinkedList ? undefined : (algorithm as SortSearchModule).codeAlternativeLabel}
              codeAlternativeByLanguage={displayAlternativeByLanguage}
              showAlternative={showAlternative}
              onVariantChange={hasAlternative ? setShowAlternative : undefined}
            />
          </div>
          <div className={`h-full overflow-auto ${activeTab === "info" ? "block" : "hidden"}`}>
            <InfoTab
              algorithm={algorithm}
              complexityOverride={currentComplexity}
              complexityAlternative={complexityAlt}
              showAlternative={showAlternative}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
