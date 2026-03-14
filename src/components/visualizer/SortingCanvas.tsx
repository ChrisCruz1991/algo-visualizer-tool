import type { SortStep } from "@/engine/types";

type Props = {
  step: SortStep | null;
  initialArray: number[];
};

export default function SortingCanvas({ step, initialArray }: Props) {
  const array = step?.array ?? initialArray;
  const comparingIndices = step?.comparingIndices ?? [];
  const swappingIndices = step?.swappingIndices ?? [];
  const sortedIndices = step?.sortedIndices ?? [];

  const maxValue = Math.max(...array, 1);
  const svgWidth = 1000;
  const svgHeight = 360;
  const bottomPad = 24;
  const barCount = array.length;
  const barWidth = svgWidth / barCount;
  const gap = barCount > 50 ? 1 : 2;

  return (
    <div className="w-full aspect-[5/2] bg-gray-50 rounded-lg overflow-hidden">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {array.map((value, index) => {
          const barH = Math.max(
            4,
            ((value / maxValue) * (svgHeight - bottomPad - 8))
          );
          const x = index * barWidth + gap / 2;
          const y = svgHeight - bottomPad - barH;
          const w = barWidth - gap;

          let fill = "#9ca3af"; // gray-400 default
          if (sortedIndices.includes(index)) fill = "#22c55e"; // green-500
          if (comparingIndices.includes(index)) fill = "#fbbf24"; // amber-400
          if (swappingIndices.includes(index)) fill = "#ef4444"; // red-500

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={Math.max(w, 1)}
              height={barH}
              fill={fill}
              rx={barCount <= 30 ? 2 : 0}
              style={{ transition: "fill 0.15s ease, y 0.15s ease, height 0.15s ease" }}
            />
          );
        })}
        {/* Value labels for small arrays */}
        {barCount <= 20 &&
          array.map((value, index) => {
            const x = index * barWidth + barWidth / 2;
            const barH = Math.max(
              4,
              ((value / maxValue) * (svgHeight - bottomPad - 8))
            );
            const y = svgHeight - bottomPad - barH - 4;
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={12}
                fill="#374151"
              >
                {value}
              </text>
            );
          })}
      </svg>
    </div>
  );
}
