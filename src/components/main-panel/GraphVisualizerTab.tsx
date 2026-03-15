"use client";

import { useState, useMemo, useEffect } from "react";
import type { GraphModule, GraphStep } from "@/engine/types";
import { useStepEngine } from "@/engine/useStepEngine";
import GraphTreeControlsBar from "@/components/visualizer/GraphTreeControlsBar";
import NodeEdgeCanvas from "@/components/visualizer/NodeEdgeCanvas";
import QueueStackIndicator from "@/components/visualizer/QueueStackIndicator";
import StepDescriptionBar from "@/components/visualizer/StepDescriptionBar";
import MetricsBar from "@/components/visualizer/MetricsBar";

type Props = {
  algorithm: GraphModule;
  onHighlightedLinesChange?: (lines: number[], stepLabel?: string) => void;
};

export default function GraphVisualizerTab({
  algorithm,
  onHighlightedLinesChange,
}: Props) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [selectedStartNodeId, setSelectedStartNodeId] = useState(
    algorithm.presets[0]?.nodes[0]?.id ?? ""
  );

  const preset = algorithm.presets[selectedPresetIndex];

  // Reset start node when preset changes
  const handlePresetChange = (index: number) => {
    setSelectedPresetIndex(index);
    setSelectedStartNodeId(algorithm.presets[index]?.nodes[0]?.id ?? "");
    engine.reset();
  };

  const handleStartNodeChange = (nodeId: string) => {
    setSelectedStartNodeId(nodeId);
    engine.reset();
  };

  const engineOptions = useMemo(
    () => ({
      category: "graph" as const,
      graph: preset,
      startNodeId: selectedStartNodeId,
    }),
    [preset, selectedStartNodeId]
  );

  const engine = useStepEngine(algorithm, engineOptions);

  // Sync highlighted lines to parent (for CodeTab)
  useEffect(() => {
    onHighlightedLinesChange?.(
      engine.currentStep?.highlightedLines ?? [],
      engine.currentStep?.stepLabel
    );
  }, [engine.currentStep, onHighlightedLinesChange]);

  const currentStep = engine.currentStep as GraphStep | null;
  const description =
    currentStep?.description ??
    (engine.status === "done" ? "Algorithm complete!" : "");

  const isBFS = algorithm.id === "bfs";
  const queueOrStack = currentStep?.queueOrStack ?? [];
  const operationCount = currentStep?.operationCount ?? 0;

  return (
    <div className="flex flex-col h-full">
      <GraphTreeControlsBar
        status={engine.status}
        speed={engine.speed}
        onRun={engine.play}
        onPause={engine.pause}
        onResume={engine.play}
        onStep={engine.step}
        onReset={() => {
          engine.reset();
        }}
        onSpeedChange={engine.setSpeed}
        presetNames={algorithm.presets.map((p) => p.name)}
        selectedPresetIndex={selectedPresetIndex}
        onPresetChange={handlePresetChange}
        nodeIds={preset.nodes.map((n) => n.id)}
        selectedStartNodeId={selectedStartNodeId}
        onStartNodeChange={handleStartNodeChange}
      />

      <div className="flex-1 p-4 overflow-auto">
        <NodeEdgeCanvas
          graph={preset}
          step={currentStep}
          startNodeId={selectedStartNodeId}
        />
        <QueueStackIndicator
          items={queueOrStack}
          mode={isBFS ? "queue" : "stack"}
          label={isBFS ? "Queue" : "Stack"}
        />
      </div>

      <StepDescriptionBar description={description} />
      <MetricsBar
        comparisons={0}
        swapsOrAccesses={operationCount}
        swapsLabel="Operations"
        stepIndex={engine.stepIndex}
        totalSteps={engine.totalSteps}
      />
    </div>
  );
}
