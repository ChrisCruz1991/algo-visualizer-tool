import type { AlgorithmStep, SortStep, SearchStep } from "@/engine/types";
import SortingCanvas from "./SortingCanvas";
import SearchingCanvas from "./SearchingCanvas";

type Props = {
  step: AlgorithmStep | null;
  category: "sorting" | "searching";
  initialArray: number[];
  target: number;
};

export default function VisualizationCanvas({
  step,
  category,
  initialArray,
  target,
}: Props) {
  if (category === "sorting") {
    return (
      <SortingCanvas
        step={step?.type === "sort" ? (step as SortStep) : null}
        initialArray={initialArray}
      />
    );
  }

  return (
    <SearchingCanvas
      step={step?.type === "search" ? (step as SearchStep) : null}
      initialArray={initialArray}
      target={target}
    />
  );
}
