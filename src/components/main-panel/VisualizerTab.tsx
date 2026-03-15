"use client";

import { useState, useMemo, useEffect } from "react";
import type { SortSearchModule, SortStep, SearchStep } from "@/engine/types";
import { useStepEngine } from "@/engine/useStepEngine";
import { generateRandomArray, parseManualInput } from "@/lib/utils";
import ControlsBar from "@/components/visualizer/ControlsBar";
import VisualizationCanvas from "@/components/visualizer/VisualizationCanvas";
import StepDescriptionBar from "@/components/visualizer/StepDescriptionBar";
import MetricsBar from "@/components/visualizer/MetricsBar";

type Props = {
  algorithm: SortSearchModule;
  onHighlightedLinesChange?: (lines: number[], stepLabel?: string) => void;
  /** When true, display matches the alternative (e.g. Recursive) code variant; resets engine */
  useAlternative?: boolean;
};

export default function VisualizerTab({ algorithm, onHighlightedLinesChange, useAlternative }: Props) {
  const [inputMode, setInputMode] = useState<"manual" | "random">("random");
  const [manualInput, setManualInput] = useState("5, 3, 8, 1, 9, 2, 7, 4");
  const [arraySize, setArraySize] = useState(20);
  const [lockedRandomArray, setLockedRandomArray] = useState(() =>
    generateRandomArray(20)
  );
  const [target, setTarget] = useState(0);
  const [inputError, setInputError] = useState("");

  const parsedManual = useMemo(() => parseManualInput(manualInput), [manualInput]);

  const baseInput = useMemo(() => {
    if (inputMode === "manual") return parsedManual;
    return lockedRandomArray;
  }, [inputMode, parsedManual, lockedRandomArray]);

  const preparedInput = useMemo(() => {
    if (algorithm.id === "binary-search") {
      return [...baseInput].sort((a, b) => a - b);
    }
    return baseInput;
  }, [algorithm.id, baseInput]);

  const effectiveTarget = useMemo(() => {
    if (target !== 0) return target;
    return preparedInput[Math.floor(preparedInput.length / 2)] ?? 1;
  }, [target, preparedInput]);

  const engineOptions = useMemo(
    () => ({
      category: algorithm.category as "sorting" | "searching",
      input: preparedInput,
      target: algorithm.category === "searching" ? effectiveTarget : undefined,
    }),
    [algorithm.category, preparedInput, effectiveTarget]
  );

  const engine = useStepEngine(algorithm, engineOptions);

  // Reset when the Iterative/Recursive variant is switched
  useEffect(() => {
    engine.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useAlternative]);

  // Sync highlighted lines to parent (for CodeTab)
  useEffect(() => {
    onHighlightedLinesChange?.(
      engine.currentStep?.highlightedLines ?? [],
      engine.currentStep?.stepLabel
    );
  }, [engine.currentStep, onHighlightedLinesChange]);

  const handleInputModeChange = (mode: "manual" | "random") => {
    engine.reset();
    setInputMode(mode);
    setInputError("");
  };

  const handleArraySizeChange = (size: number) => {
    engine.reset();
    setArraySize(size);
    setLockedRandomArray(generateRandomArray(size));
  };

  const handleRun = () => {
    if (inputMode === "manual" && parsedManual.length < 2) {
      setInputError("Enter at least 2 valid numbers (1–999), comma-separated.");
      return;
    }
    setInputError("");
    engine.play();
  };

  const handleReset = () => {
    if (inputMode === "random") {
      setLockedRandomArray(generateRandomArray(arraySize));
    }
    engine.reset();
  };

  const currentStep = engine.currentStep;
  let description = "";
  let comparisons = 0;
  let swapsOrAccesses = 0;
  let swapsLabel = "Swaps";

  if (currentStep && (currentStep.type === "sort" || currentStep.type === "search")) {
    description = currentStep.description;
    comparisons = currentStep.comparisons;
    if (currentStep.type === "sort") {
      swapsOrAccesses = (currentStep as SortStep).swaps;
    } else {
      swapsOrAccesses = (currentStep as SearchStep).comparisons;
      swapsLabel = "Accesses";
    }
  } else if (currentStep) {
    description = currentStep.description;
  }

  if (engine.status === "done" && !description) {
    description = "Algorithm complete!";
  }

  return (
    <div className="flex flex-col h-full">
      <ControlsBar
        status={engine.status}
        inputMode={inputMode}
        manualInput={manualInput}
        arraySize={arraySize}
        speed={engine.speed}
        category={algorithm.category}
        target={effectiveTarget}
        isBinarySearch={algorithm.id === "binary-search"}
        onInputModeChange={handleInputModeChange}
        onManualInputChange={setManualInput}
        onArraySizeChange={handleArraySizeChange}
        onSpeedChange={engine.setSpeed}
        onTargetChange={setTarget}
        onRun={handleRun}
        onPause={engine.pause}
        onResume={engine.play}
        onStep={engine.step}
        onReset={handleReset}
        inputError={inputError}
      />
      <div className="flex-1 p-4 overflow-auto">
        <VisualizationCanvas
          step={currentStep}
          category={algorithm.category}
          initialArray={preparedInput}
          target={effectiveTarget}
        />
      </div>
      <StepDescriptionBar description={description} />
      <MetricsBar
        comparisons={comparisons}
        swapsOrAccesses={swapsOrAccesses}
        swapsLabel={swapsLabel}
        stepIndex={engine.stepIndex}
        totalSteps={engine.totalSteps}
      />
    </div>
  );
}
