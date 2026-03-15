"use client";

import { useState, useEffect, useCallback } from "react";
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

type Props = {
  algorithmId: string;
};

export default function MainPanel({ algorithmId }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("visualizer");
  const [currentStepLabel, setCurrentStepLabel] = useState<string | undefined>(undefined);

  // Dynamic code/complexity — updated by LinkedListVisualizerTab when operation changes
  const [currentCodeByLanguage, setCurrentCodeByLanguage] = useState<
    Record<SupportedLanguage, CodeEntry> | undefined
  >(undefined);
  const [currentComplexity, setCurrentComplexity] = useState<
    ComplexityRow[] | undefined
  >(undefined);

  const algorithm = getAlgorithmById(algorithmId);
  if (!algorithm) return null;

  // Reset dynamic state when algorithm changes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
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

  const renderVisualizerTab = () => {
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
        />
      );
    }
    if (algorithm.category === "tree") {
      return (
        <TreeVisualizerTab
          algorithm={algorithm as TreeModule}
          onHighlightedLinesChange={handleStepChange}
        />
      );
    }
    return (
      <VisualizerTab
        algorithm={algorithm as SortSearchModule}
        onHighlightedLinesChange={handleStepChange}
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

  return (
    <div className="flex flex-col h-full">
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        {/* Keep visualizer tab mounted always so engine state persists across tab switches */}
        <div className={`h-full ${activeTab === "visualizer" ? "flex flex-col" : "hidden"}`}>
          {renderVisualizerTab()}
        </div>
        <div className={`h-full ${activeTab === "code" ? "flex flex-col" : "hidden"}`}>
          <CodeTab
            codeByLanguage={displayCodeByLanguage}
            stepLabel={currentStepLabel}
            codeAlternativeLabel={isLinkedList ? undefined : (algorithm as SortSearchModule).codeAlternativeLabel}
            codeAlternativeByLanguage={displayAlternativeByLanguage}
          />
        </div>
        <div className={`h-full overflow-auto ${activeTab === "info" ? "block" : "hidden"}`}>
          <InfoTab algorithm={algorithm} complexityOverride={currentComplexity} />
        </div>
      </div>
    </div>
  );
}
