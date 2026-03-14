import type { EngineStatus } from "@/engine/types";

type Props = {
  // Engine state
  status: EngineStatus;
  speed: number;
  onRun: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (ms: number) => void;
  // Preset selection
  presetNames: string[];
  selectedPresetIndex: number;
  onPresetChange: (index: number) => void;
  // Start node (graph only — omit for trees)
  nodeIds?: string[];
  selectedStartNodeId?: string;
  onStartNodeChange?: (nodeId: string) => void;
};

const SPEED_OPTIONS = [1000, 700, 500, 300, 150, 50];

export default function GraphTreeControlsBar({
  status,
  speed,
  onRun,
  onPause,
  onResume,
  onStep,
  onReset,
  onSpeedChange,
  presetNames,
  selectedPresetIndex,
  onPresetChange,
  nodeIds,
  selectedStartNodeId,
  onStartNodeChange,
}: Props) {
  const isRunning = status === "running";
  const isDone = status === "done";
  const canStep = status === "paused" || status === "idle";

  // Speed slider: invert so right = fast
  const speedIndex = SPEED_OPTIONS.indexOf(speed);
  const sliderValue =
    speedIndex === -1 ? SPEED_OPTIONS.length - 1 : SPEED_OPTIONS.length - 1 - speedIndex;

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = SPEED_OPTIONS.length - 1 - Number(e.target.value);
    onSpeedChange(SPEED_OPTIONS[idx]);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-b border-gray-200 bg-white">
      {/* Preset selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
          Preset
        </label>
        <select
          value={selectedPresetIndex}
          onChange={(e) => onPresetChange(Number(e.target.value))}
          disabled={isRunning}
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white
                     disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none
                     focus:ring-2 focus:ring-indigo-400"
        >
          {presetNames.map((name, i) => (
            <option key={i} value={i}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Start node selector (graph only) */}
      {nodeIds && selectedStartNodeId !== undefined && onStartNodeChange && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
            Start node
          </label>
          <select
            value={selectedStartNodeId}
            onChange={(e) => onStartNodeChange(e.target.value)}
            disabled={isRunning}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white
                       disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none
                       focus:ring-2 focus:ring-indigo-400"
          >
            {nodeIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Speed slider */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 whitespace-nowrap">Slow</span>
        <input
          type="range"
          min={0}
          max={SPEED_OPTIONS.length - 1}
          step={1}
          value={sliderValue}
          onChange={handleSlider}
          className="w-24 accent-indigo-500"
        />
        <span className="text-xs text-gray-500 whitespace-nowrap">Fast</span>
      </div>

      {/* Playback buttons */}
      <div className="flex items-center gap-2 ml-auto">
        {!isRunning ? (
          <button
            onClick={isDone ? onRun : status === "paused" ? onResume : onRun}
            className="px-3 py-1.5 text-sm font-medium rounded bg-indigo-600 text-white
                       hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDone ? "Restart" : status === "paused" ? "Resume" : "Run"}
          </button>
        ) : (
          <button
            onClick={onPause}
            className="px-3 py-1.5 text-sm font-medium rounded bg-yellow-500 text-white
                       hover:bg-yellow-600"
          >
            Pause
          </button>
        )}

        <button
          onClick={onStep}
          disabled={!canStep}
          className="px-3 py-1.5 text-sm font-medium rounded border border-gray-300
                     text-gray-700 hover:bg-gray-50
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Step →
        </button>

        <button
          onClick={onReset}
          className="px-3 py-1.5 text-sm font-medium rounded border border-gray-300
                     text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
