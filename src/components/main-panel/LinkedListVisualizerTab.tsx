"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type {
  LinkedListModule,
  LinkedListStep,
  LinkedListOperation,
  LinkedListState,
} from "@/engine/types";
import { useStepEngine } from "@/engine/useStepEngine";
import { makeInitialListState } from "@/algorithms/linked-list/utils";
import LinkedListControlsBar from "@/components/visualizer/LinkedListControlsBar";
import LinkedListCanvas from "@/components/visualizer/LinkedListCanvas";
import StepDescriptionBar from "@/components/visualizer/StepDescriptionBar";
import MetricsBar from "@/components/visualizer/MetricsBar";

type Props = {
  algorithm: LinkedListModule;
  onHighlightedLinesChange?: (lines: number[]) => void;
  onOperationChange?: (op: LinkedListOperation["type"]) => void;
};

function buildOperation(
  type: LinkedListOperation["type"],
  position: "head" | "tail" | "index",
  index: number,
  value: number
): LinkedListOperation {
  if (type === "reverse") return { type: "reverse" };
  if (type === "search") return { type: "search", value };
  if (type === "insert") return { type: "insert", position, index, value };
  return { type: "delete", position, index };
}

function parseManualInput(raw: string): number[] | null {
  const parts = raw.split(",").map((s) => s.trim());
  const nums = parts.map(Number);
  if (nums.some((n) => !Number.isFinite(n) || parts.some((p) => p === "")))
    return null;
  return nums;
}

export default function LinkedListVisualizerTab({
  algorithm,
  onHighlightedLinesChange,
  onOperationChange,
}: Props) {
  // ─── List state (mutates after each operation completes) ──────────────────
  const [listState, setListState] = useState<LinkedListState>(() =>
    makeInitialListState(algorithm.presets[0].values, algorithm.variant)
  );

  // ─── Input controls ───────────────────────────────────────────────────────
  const [inputMode, setInputMode] = useState<"manual" | "preset">("preset");
  const [manualInput, setManualInput] = useState("3, 7, 1");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [inputError, setInputError] = useState("");

  // ─── Operation controls ───────────────────────────────────────────────────
  const [selectedOperation, setSelectedOperation] =
    useState<LinkedListOperation["type"]>("insert");
  const [selectedPosition, setSelectedPosition] = useState<
    "head" | "tail" | "index"
  >("head");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [operationValue, setOperationValue] = useState(5);

  // ─── Engine options (memoized to avoid infinite re-collection) ────────────
  const engineOptions = useMemo(
    () => ({
      category: "linked-list" as const,
      listState,
      operation: buildOperation(
        selectedOperation,
        selectedPosition,
        selectedIndex,
        operationValue
      ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listState, selectedOperation, selectedPosition, selectedIndex, operationValue]
  );

  const engine = useStepEngine(algorithm, engineOptions);

  // ─── After operation completes, apply final step's list state ─────────────
  useEffect(() => {
    if (engine.status === "done" && engine.totalSteps > 0) {
      const finalStep = engine.currentStep as LinkedListStep | null;
      if (finalStep?.type === "linked-list") {
        setListState({
          nodes: finalStep.nodes,
          headId: finalStep.headId,
          tailId: finalStep.tailId,
          variant: listState.variant,
        });
      }
    }
    // Only fire when status changes (not on every currentStep change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.status]);

  // ─── Sync highlighted lines to CodeTab ───────────────────────────────────
  useEffect(() => {
    onHighlightedLinesChange?.(
      (engine.currentStep as LinkedListStep | null)?.highlightedLines ?? []
    );
  }, [engine.currentStep, onHighlightedLinesChange]);

  // ─── Notify MainPanel when operation changes (CodeTab/InfoTab update) ─────
  useEffect(() => {
    onOperationChange?.(selectedOperation);
  }, [selectedOperation, onOperationChange]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleInputModeChange = useCallback(
    (mode: "manual" | "preset") => {
      setInputMode(mode);
      if (mode === "preset") {
        const preset = algorithm.presets[selectedPresetIndex];
        const values =
          preset.values.length > 12 ? preset.values.slice(0, 12) : preset.values;
        setListState(makeInitialListState(values, algorithm.variant));
        setInputError("");
        engine.reset();
      }
    },
    [algorithm, selectedPresetIndex, engine]
  );

  const handleManualInputChange = useCallback(
    (raw: string) => {
      setManualInput(raw);
      const nums = parseManualInput(raw);
      if (!nums) {
        setInputError("Enter comma-separated integers.");
        return;
      }
      if (nums.length > 12) {
        setInputError("Maximum 12 nodes.");
        return;
      }
      setInputError("");
      setListState(makeInitialListState(nums, algorithm.variant));
      engine.reset();
    },
    [algorithm, engine]
  );

  const handlePresetChange = useCallback(
    (index: number) => {
      setSelectedPresetIndex(index);
      const preset = algorithm.presets[index];
      const values =
        preset.values.length > 12 ? preset.values.slice(0, 12) : preset.values;
      setListState(makeInitialListState(values, algorithm.variant));
      setInputError("");
      engine.reset();
    },
    [algorithm, engine]
  );

  const handleRun = useCallback(() => {
    if (engine.status === "done") {
      engine.reset();
      // Small tick to let reset propagate before playing
      setTimeout(() => engine.play(), 0);
    } else {
      engine.play();
    }
  }, [engine]);

  // ─── Derived display values ───────────────────────────────────────────────
  const currentStep = engine.currentStep as LinkedListStep | null;
  const description =
    currentStep?.description ??
    (engine.status === "done" ? "Operation complete!" : "");
  const nodeCount = listState.nodes.length;

  return (
    <div className="flex flex-col h-full">
      <LinkedListControlsBar
        status={engine.status}
        speed={engine.speed}
        inputMode={inputMode}
        manualInput={manualInput}
        selectedPresetIndex={selectedPresetIndex}
        presetNames={algorithm.presets.map((p) => p.name)}
        inputError={inputError}
        nodeCount={nodeCount}
        selectedOperation={selectedOperation}
        selectedPosition={selectedPosition}
        selectedIndex={selectedIndex}
        operationValue={operationValue}
        onInputModeChange={handleInputModeChange}
        onManualInputChange={handleManualInputChange}
        onPresetChange={handlePresetChange}
        onOperationChange={setSelectedOperation}
        onPositionChange={setSelectedPosition}
        onIndexChange={setSelectedIndex}
        onValueChange={setOperationValue}
        onRun={handleRun}
        onPause={engine.pause}
        onResume={engine.play}
        onStep={engine.step}
        onReset={engine.reset}
        onSpeedChange={engine.setSpeed}
      />

      <div className="flex-1 p-6 overflow-auto flex items-center">
        <LinkedListCanvas
          step={currentStep}
          variant={algorithm.variant}
          initialState={listState}
        />
      </div>

      <StepDescriptionBar description={description} />
      <MetricsBar
        comparisons={0}
        swapsOrAccesses={nodeCount}
        swapsLabel="Nodes"
        stepIndex={engine.stepIndex}
        totalSteps={engine.totalSteps}
      />
    </div>
  );
}
