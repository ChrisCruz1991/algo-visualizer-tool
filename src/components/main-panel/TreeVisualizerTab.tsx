"use client";

import { useState, useMemo, useEffect } from "react";
import type { TreeModule, TreeStep } from "@/engine/types";
import { useStepEngine } from "@/engine/useStepEngine";
import GraphTreeControlsBar from "@/components/visualizer/GraphTreeControlsBar";
import BinaryTreeCanvas from "@/components/visualizer/BinaryTreeCanvas";
import VisitOrderList from "@/components/visualizer/VisitOrderList";
import StepDescriptionBar from "@/components/visualizer/StepDescriptionBar";
import MetricsBar from "@/components/visualizer/MetricsBar";

type Props = {
  algorithm: TreeModule;
  onHighlightedLinesChange?: (lines: number[], stepLabel?: string) => void;
};

const TRAVERSAL_LABELS: Record<string, string> = {
  inorder: "Inorder Visit Sequence (L → Root → R)",
  preorder: "Preorder Visit Sequence (Root → L → R)",
  postorder: "Postorder Visit Sequence (L → R → Root)",
};

export default function TreeVisualizerTab({
  algorithm,
  onHighlightedLinesChange,
}: Props) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  const preset = algorithm.presets[selectedPresetIndex];

  const handlePresetChange = (index: number) => {
    setSelectedPresetIndex(index);
    engine.reset();
  };

  const engineOptions = useMemo(
    () => ({
      category: "tree" as const,
      tree: preset,
    }),
    [preset]
  );

  const engine = useStepEngine(algorithm, engineOptions);

  // Sync highlighted lines to parent (for CodeTab)
  useEffect(() => {
    onHighlightedLinesChange?.(
      engine.currentStep?.highlightedLines ?? [],
      engine.currentStep?.stepLabel
    );
  }, [engine.currentStep, onHighlightedLinesChange]);

  const currentStep = engine.currentStep as TreeStep | null;
  const description =
    currentStep?.description ??
    (engine.status === "done" ? "Algorithm complete!" : "");

  const visitOrder = currentStep?.visitOrder ?? [];
  const traversalLabel =
    TRAVERSAL_LABELS[algorithm.id] ?? "Visit Sequence";

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
      />

      <div className="flex-1 p-4 overflow-auto">
        <BinaryTreeCanvas preset={preset} step={currentStep} />
        <VisitOrderList
          visitOrder={visitOrder}
          label={traversalLabel}
        />
      </div>

      <StepDescriptionBar description={description} />
      <MetricsBar
        comparisons={0}
        swapsOrAccesses={0}
        swapsLabel="Nodes Visited"
        stepIndex={engine.stepIndex}
        totalSteps={engine.totalSteps}
      />
    </div>
  );
}
