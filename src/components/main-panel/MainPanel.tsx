"use client";

import { useState } from "react";
import { getAlgorithmById } from "@/algorithms/index";
import type { SortSearchModule, GraphModule, TreeModule } from "@/engine/types";
import TabBar, { type TabId } from "./TabBar";
import VisualizerTab from "./VisualizerTab";
import GraphVisualizerTab from "./GraphVisualizerTab";
import TreeVisualizerTab from "./TreeVisualizerTab";
import CodeTab from "./CodeTab";
import InfoTab from "./InfoTab";

type Props = {
  algorithmId: string;
};

export default function MainPanel({ algorithmId }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("visualizer");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const algorithm = getAlgorithmById(algorithmId);
  if (!algorithm) return null;

  const renderVisualizerTab = () => {
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

  return (
    <div className="flex flex-col h-full">
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        {/* Keep visualizer tab mounted always so engine state persists across tab switches */}
        <div className={`h-full ${activeTab === "visualizer" ? "flex flex-col" : "hidden"}`}>
          {renderVisualizerTab()}
        </div>
        <div className={`h-full ${activeTab === "code" ? "block" : "hidden"}`}>
          <CodeTab code={algorithm.code} highlightedLines={highlightedLines} />
        </div>
        <div className={`h-full overflow-auto ${activeTab === "info" ? "block" : "hidden"}`}>
          <InfoTab algorithm={algorithm} />
        </div>
      </div>
    </div>
  );
}
