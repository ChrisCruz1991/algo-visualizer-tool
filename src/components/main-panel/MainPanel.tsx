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
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  // Dynamic code/complexity — updated by LinkedListVisualizerTab when operation changes
  const [currentCode, setCurrentCode] = useState<string | undefined>(undefined);
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
      setCurrentCode(ll.codeByOperation["insert"]);
      setCurrentComplexity(ll.complexityByOperation["insert"]);
    } else {
      setCurrentCode(undefined);
      setCurrentComplexity(undefined);
    }
    setHighlightedLines([]);
  }, [algorithm]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleOperationChange = useCallback(
    (op: LinkedListOperation["type"]) => {
      if (algorithm.category === "linked-list") {
        const ll = algorithm as LinkedListModule;
        setCurrentCode(ll.codeByOperation[op]);
        setCurrentComplexity(ll.complexityByOperation[op]);
      }
    },
    [algorithm]
  );

  const renderVisualizerTab = () => {
    if (algorithm.category === "linked-list") {
      return (
        <LinkedListVisualizerTab
          algorithm={algorithm as LinkedListModule}
          onHighlightedLinesChange={setHighlightedLines}
          onOperationChange={handleOperationChange}
        />
      );
    }
    if (algorithm.category === "graph") {
      return (
        <GraphVisualizerTab
          algorithm={algorithm as GraphModule}
          onHighlightedLinesChange={setHighlightedLines}
        />
      );
    }
    if (algorithm.category === "tree") {
      return (
        <TreeVisualizerTab
          algorithm={algorithm as TreeModule}
          onHighlightedLinesChange={setHighlightedLines}
        />
      );
    }
    return (
      <VisualizerTab
        algorithm={algorithm as SortSearchModule}
        onHighlightedLinesChange={setHighlightedLines}
      />
    );
  };

  const isLinkedList = algorithm.category === "linked-list";
  const displayCode =
    currentCode ??
    (isLinkedList ? "" : (algorithm as SortSearchModule | GraphModule | TreeModule).code);

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
            code={displayCode}
            highlightedLines={highlightedLines}
            codeAlternativeLabel={isLinkedList ? undefined : algorithm.codeAlternativeLabel}
            codeAlternative={isLinkedList ? undefined : algorithm.codeAlternative}
          />
        </div>
        <div className={`h-full overflow-auto ${activeTab === "info" ? "block" : "hidden"}`}>
          <InfoTab algorithm={algorithm} complexityOverride={currentComplexity} />
        </div>
      </div>
    </div>
  );
}
