import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import type { EngineStatus, LinkedListOperation } from "@/engine/types";
import { cn } from "@/lib/utils";

const SPEED_STEPS = [1000, 700, 500, 300, 150, 50];

function speedLabel(ms: number): string {
  if (ms >= 700) return "Slow";
  if (ms >= 300) return "Medium";
  return "Fast";
}

type Props = {
  status: EngineStatus;
  speed: number;
  // Input / list setup
  inputMode: "manual" | "preset";
  manualInput: string;
  selectedPresetIndex: number;
  presetNames: string[];
  inputError: string;
  nodeCount: number;
  // Operation config
  selectedOperation: LinkedListOperation["type"];
  selectedPosition: "head" | "tail" | "index";
  selectedIndex: number;
  operationValue: number;
  // Callbacks — input
  onInputModeChange: (mode: "manual" | "preset") => void;
  onManualInputChange: (value: string) => void;
  onPresetChange: (index: number) => void;
  // Callbacks — operation
  onOperationChange: (op: LinkedListOperation["type"]) => void;
  onPositionChange: (pos: "head" | "tail" | "index") => void;
  onIndexChange: (index: number) => void;
  onValueChange: (value: number) => void;
  // Callbacks — playback
  onRun: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (ms: number) => void;
};

const OPERATIONS: { id: LinkedListOperation["type"]; label: string }[] = [
  { id: "insert", label: "Insert" },
  { id: "delete", label: "Delete" },
  { id: "search", label: "Search" },
  { id: "reverse", label: "Reverse" },
];

const POSITIONS: { id: "head" | "tail" | "index"; label: string }[] = [
  { id: "head", label: "At Head" },
  { id: "tail", label: "At Tail" },
  { id: "index", label: "At Index" },
];

export default function LinkedListControlsBar({
  status,
  speed,
  inputMode,
  manualInput,
  selectedPresetIndex,
  presetNames,
  inputError,
  nodeCount,
  selectedOperation,
  selectedPosition,
  selectedIndex,
  operationValue,
  onInputModeChange,
  onManualInputChange,
  onPresetChange,
  onOperationChange,
  onPositionChange,
  onIndexChange,
  onValueChange,
  onRun,
  onPause,
  onResume,
  onStep,
  onReset,
  onSpeedChange,
}: Props) {
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isIdle = status === "idle";
  const isDone = status === "done";

  const speedIndex = SPEED_STEPS.indexOf(speed);
  const normalizedIndex = speedIndex === -1 ? 3 : speedIndex;

  const showPosition = selectedOperation === "insert" || selectedOperation === "delete";
  const showValue = selectedOperation === "insert" || selectedOperation === "search";
  const showIndex = showPosition && selectedPosition === "index";
  const valueLabel = selectedOperation === "search" ? "Search for" : "Value";

  return (
    <div className="bg-white border-b border-gray-200 p-3 space-y-3">
      {/* Row 1: List setup */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Input mode toggle */}
        <div className="flex rounded-md border border-gray-300 overflow-hidden text-sm">
          <button
            onClick={() => onInputModeChange("manual")}
            disabled={isRunning}
            className={cn(
              "px-3 py-1.5 transition-colors",
              inputMode === "manual"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            )}
          >
            Manual
          </button>
          <button
            onClick={() => onInputModeChange("preset")}
            disabled={isRunning}
            className={cn(
              "px-3 py-1.5 transition-colors border-l border-gray-300",
              inputMode === "preset"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            )}
          >
            Preset
          </button>
        </div>

        {/* Manual input */}
        {inputMode === "manual" && (
          <div className="flex flex-col gap-0.5">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => onManualInputChange(e.target.value)}
              placeholder="e.g. 3, 7, 1, 9"
              disabled={isRunning}
              className={cn(
                "border rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400",
                inputError ? "border-red-400" : "border-gray-300"
              )}
            />
            {inputError && (
              <span className="text-xs text-red-500">{inputError}</span>
            )}
          </div>
        )}

        {/* Preset dropdown */}
        {inputMode === "preset" && (
          <select
            value={selectedPresetIndex}
            onChange={(e) => onPresetChange(Number(e.target.value))}
            disabled={isRunning}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            {presetNames.map((name, i) => (
              <option key={i} value={i}>
                {name}
              </option>
            ))}
          </select>
        )}

        <span className="text-xs text-gray-400 ml-1">
          {nodeCount} node{nodeCount !== 1 ? "s" : ""}
          {nodeCount >= 12 && " (max)"}
        </span>
      </div>

      {/* Row 2: Operation config */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Operation selector */}
        <div className="flex rounded-md border border-gray-300 overflow-hidden text-sm">
          {OPERATIONS.map((op, i) => (
            <button
              key={op.id}
              onClick={() => onOperationChange(op.id)}
              disabled={isRunning}
              className={cn(
                "px-3 py-1.5 transition-colors",
                i > 0 && "border-l border-gray-300",
                selectedOperation === op.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              )}
            >
              {op.label}
            </button>
          ))}
        </div>

        {/* Position selector (insert / delete) */}
        {showPosition && (
          <div className="flex rounded-md border border-gray-300 overflow-hidden text-sm">
            {POSITIONS.map((pos, i) => (
              <button
                key={pos.id}
                onClick={() => onPositionChange(pos.id)}
                disabled={isRunning}
                className={cn(
                  "px-3 py-1.5 transition-colors",
                  i > 0 && "border-l border-gray-300",
                  selectedPosition === pos.id
                    ? "bg-violet-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                )}
              >
                {pos.label}
              </button>
            ))}
          </div>
        )}

        {/* Index input */}
        {showIndex && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Index:</span>
            <input
              type="number"
              value={selectedIndex}
              min={0}
              max={
                selectedOperation === "delete"
                  ? Math.max(0, nodeCount - 1)
                  : nodeCount
              }
              onChange={(e) => onIndexChange(Number(e.target.value))}
              disabled={isRunning}
              className="border border-gray-300 rounded px-2 py-1.5 w-16 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}

        {/* Value input (insert / search) */}
        {showValue && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">{valueLabel}:</span>
            <input
              type="number"
              value={operationValue}
              onChange={(e) => onValueChange(Number(e.target.value))}
              disabled={isRunning}
              className="border border-gray-300 rounded px-2 py-1.5 w-20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}
      </div>

      {/* Row 3: Playback + speed */}
      <div className="flex flex-wrap items-center gap-2">
        {!isRunning ? (
          <button
            onClick={isPaused ? onResume : onRun}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
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

        <button
          onClick={onStep}
          disabled={isRunning || isIdle}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <SkipForward size={14} />
          Step
        </button>

        <button
          onClick={onReset}
          disabled={isIdle}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        <div className="flex items-center gap-2 ml-2 text-sm">
          <span className="text-gray-500 text-xs">Slow</span>
          <input
            type="range"
            min={0}
            max={SPEED_STEPS.length - 1}
            value={normalizedIndex}
            onChange={(e) => {
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
