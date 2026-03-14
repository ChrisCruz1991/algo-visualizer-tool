import type { SearchStep } from "@/engine/types";

type Props = {
  step: SearchStep | null;
  initialArray: number[];
  target: number;
};

export default function SearchingCanvas({ step, initialArray, target }: Props) {
  const array = step?.array ?? initialArray;
  const comparingIndices = step?.comparingIndices ?? [];
  const searchedIndices = step?.searchedIndices ?? [];
  const foundIndex = step?.foundIndex ?? null;

  return (
    <div className="w-full min-h-[180px] bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center gap-6">
      {/* Target indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Searching for:</span>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white font-bold text-base shadow">
          {target}
        </span>
      </div>

      {/* Array cells */}
      <div className="flex flex-wrap gap-2 justify-center">
        {array.map((value, index) => {
          let bg = "bg-gray-200 text-gray-700";
          let ring = "";

          if (searchedIndices.includes(index)) {
            bg = "bg-gray-300 text-gray-400";
          }
          if (comparingIndices.includes(index)) {
            bg = "bg-amber-400 text-white";
            ring = "ring-2 ring-amber-600";
          }
          if (foundIndex === index) {
            bg = "bg-green-500 text-white";
            ring = "ring-2 ring-green-700";
          }

          return (
            <div
              key={index}
              className={`
                flex flex-col items-center justify-center
                w-11 h-11 rounded-lg font-semibold text-sm
                transition-all duration-150
                ${bg} ${ring}
              `}
            >
              <span>{value}</span>
              <span className="text-[9px] opacity-60 font-normal">{index}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
