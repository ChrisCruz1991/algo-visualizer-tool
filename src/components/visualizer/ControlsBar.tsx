import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import type { EngineStatus } from "@/engine/types";
import { cn } from "@/lib/utils";

const SPEED_STEPS = [1000, 700, 500, 300, 150, 50];

function speedLabel(ms: number): string {
  if (ms >= 700) return "Slow";
  if (ms >= 300) return "Medium";
  return "Fast";
}

type Props = {
  status: EngineStatus;
  inputMode: "manual" | "random";
  manualInput: string;
  arraySize: number;
  speed: number;
  category: "sorting" | "searching";
  target: number;
  isBinarySearch: boolean;
  onInputModeChange: (mode: "manual" | "random") => void;
  onManualInputChange: (value: string) => void;
  onArraySizeChange: (size: number) => void;
  onSpeedChange: (ms: number) => void;
  onTargetChange: (value: number) => void;
  onRun: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
  inputError: string;
};

export default function ControlsBar({
  status,
  inputMode,
  manualInput,
  arraySize,
  speed,
  category,
  target,
  isBinarySearch,
  onInputModeChange,
  onManualInputChange,
  onArraySizeChange,
  onSpeedChange,
  onTargetChange,
  onRun,
  onPause,
  onResume,
  onStep,
  onReset,
  inputError,
}: Props) {
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isIdle = status === "idle";
  const isDone = status === "done";

  const speedIndex = SPEED_STEPS.indexOf(speed);
  const normalizedIndex = speedIndex === -1 ? 3 : speedIndex;

  return (
    <div className="bg-white border-b border-gray-200 p-3 space-y-3">
      {/* Row 1: Input controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Mode toggle */}
        <div className="flex rounded-md border border-gray-300 overflow-hidden text-sm">
          <button
            onClick={() => onInputModeChange("manual")}
            className={cn(
              "px-3 py-1.5 transition-colors",
              inputMode === "manual"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            Manual
          </button>
          <button
            onClick={() => onInputModeChange("random")}
            className={cn(
              "px-3 py-1.5 transition-colors border-l border-gray-300",
              inputMode === "random"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            Random
          </button>
        </div>

        {/* Manual input */}
        {inputMode === "manual" && (
          <div className="flex flex-col gap-0.5">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => onManualInputChange(e.target.value)}
              placeholder="e.g. 5, 3, 8, 1, 9"
              className={cn(
                "border rounded px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-indigo-400",
                inputError ? "border-red-400" : "border-gray-300"
              )}
              disabled={isRunning}
            />
            {inputError && (
              <span className="text-xs text-red-500">{inputError}</span>
            )}
          </div>
        )}

        {/* Random size slider */}
        {inputMode === "random" && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 whitespace-nowrap">
              Size: <span className="font-semibold">{arraySize}</span>
            </span>
            <input
              type="range"
              min={5}
              max={100}
              value={arraySize}
              onChange={(e) => onArraySizeChange(Number(e.target.value))}
              className="w-28 accent-indigo-600"
              disabled={isRunning}
            />
          </div>
        )}

        {/* Target input for searching */}
        {category === "searching" && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Target:</span>
            <input
              type="number"
              value={target}
              onChange={(e) => onTargetChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1.5 w-20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={isRunning}
            />
          </div>
        )}

        {/* Binary search notice */}
        {isBinarySearch && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1">
            Binary Search requires a sorted array. Input has been sorted.
          </span>
        )}
      </div>

      {/* Row 2: Playback controls + speed */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Run / Pause / Resume */}
        {!isRunning ? (
          <button
            onClick={isPaused ? onResume : onRun}
            disabled={false}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play size={14} />
            {isPaused ? "Resume" : isDone ? "Restart" : "Run"}
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 text-white rounded-md text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            <Pause size={14} />
            Pause
          </button>
        )}

        {/* Step forward */}
        <button
          onClick={onStep}
          disabled={isRunning || isIdle}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <SkipForward size={14} />
          Step
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          disabled={isIdle}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        {/* Speed slider */}
        <div className="flex items-center gap-2 ml-2 text-sm">
          <span className="text-gray-500 text-xs">Slow</span>
          <input
            type="range"
            min={0}
            max={SPEED_STEPS.length - 1}
            value={normalizedIndex}
            onChange={(e) => {
              // Invert: higher slider = faster = lower ms
              const idx = SPEED_STEPS.length - 1 - Number(e.target.value);
              onSpeedChange(SPEED_STEPS[idx]);
            }}
            className="w-24 accent-indigo-600"
          />
          <span className="text-gray-500 text-xs">Fast</span>
          <span className="text-gray-600 font-medium w-14">
            {speedLabel(speed)}
          </span>
        </div>
      </div>
    </div>
  );
}
