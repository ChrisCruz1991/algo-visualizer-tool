import type { AlgorithmModule, SortStep } from "@/engine/types";


const code = `function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`;

type State = { comparisons: number; swaps: number };

function* partitionStep(
  arr: number[],
  low: number,
  high: number,
  state: State,
  sortedIndices: number[]
): Generator<SortStep, number> {
  const pivot = arr[high];
  let i = low - 1;

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [high],
    swappingIndices: [],
    sortedIndices: [...sortedIndices],
    highlightedLines: [10],
    description: `Partitioning indices ${low}–${high}. Pivot = ${pivot} (index ${high})`,
    comparisons: state.comparisons,
    swaps: state.swaps,
  };

  for (let j = low; j < high; j++) {
    state.comparisons++;
    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [j, high],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      highlightedLines: [13],
      description: `Comparing arr[${j}] = ${arr[j]} with pivot ${pivot}`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };

    if (arr[j] <= pivot) {
      i++;
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        state.swaps++;
        yield {
          type: "sort",
          array: [...arr],
          comparingIndices: [high],
          swappingIndices: [i, j],
          sortedIndices: [...sortedIndices],
          highlightedLines: [15],
          description: `${arr[j]} ≤ pivot ${pivot}: swapping indices ${i} and ${j}`,
          comparisons: state.comparisons,
          swaps: state.swaps,
        };
      }
    }
  }

  // Place pivot in final position
  const pivotIdx = i + 1;
  if (pivotIdx !== high) {
    [arr[pivotIdx], arr[high]] = [arr[high], arr[pivotIdx]];
    state.swaps++;
    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [],
      swappingIndices: [pivotIdx, high],
      sortedIndices: [...sortedIndices],
      highlightedLines: [18],
      description: `Placing pivot ${pivot} at its final position (index ${pivotIdx})`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };
  }

  sortedIndices.push(pivotIdx);

  return pivotIdx;
}

function* quickSortHelper(
  arr: number[],
  low: number,
  high: number,
  state: State,
  sortedIndices: number[]
): Generator<SortStep> {
  if (low >= high) {
    if (low === high) sortedIndices.push(low);
    return;
  }

  const pivotIdx: number = yield* partitionStep(arr, low, high, state, sortedIndices);

  yield* quickSortHelper(arr, low, pivotIdx - 1, state, sortedIndices);
  yield* quickSortHelper(arr, pivotIdx + 1, high, state, sortedIndices);
}

function* quickSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const state: State = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [];

  yield* quickSortHelper(arr, 0, arr.length - 1, state, sortedIndices);

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    highlightedLines: [6],
    description: "Array is fully sorted!",
    comparisons: state.comparisons,
    swaps: state.swaps,
  };
}

export const quickSort: AlgorithmModule = {
  id: "quick-sort",
  name: "Quick Sort",
  category: "sorting",
  code,
  codeLineCount: 20,
  codeAlternativeLabel: "Iterative",
  codeAlternative: `function quickSort(arr: number[]): number[] {
  const stack: Array<[number, number]> = [[0, arr.length - 1]];
  while (stack.length > 0) {
    const [low, high] = stack.pop()!;
    if (low < high) {
      const pivotIdx = partition(arr, low, high);
      stack.push([low, pivotIdx - 1]);
      stack.push([pivotIdx + 1, high]);
    }
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  generator: quickSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n log n)", space: "O(log n)" },
    { case: "Average", time: "O(n log n)", space: "O(log n)" },
    { case: "Worst", time: "O(n²)", space: "O(n)" },
  ],
  description: {
    what: "Quick Sort is a divide-and-conquer algorithm that selects a 'pivot' element, partitions the array into elements less than and greater than the pivot, then recursively sorts each partition. It is the most widely used sorting algorithm in practice.",
    how: [
      "Choose a pivot element (this implementation uses the last element).",
      "Partition: rearrange the array so all elements ≤ pivot are to its left, and all elements > pivot are to its right.",
      "The pivot is now in its final sorted position.",
      "Recursively apply Quick Sort to the left and right partitions.",
      "Base case: partitions of size 0 or 1 are already sorted.",
    ],
    implementation: [
      "The partition function uses the Lomuto scheme: pivot is the last element, and a pointer i tracks the boundary of the 'less-than' region.",
      "For each element j, if arr[j] ≤ pivot, increment i and swap arr[i] with arr[j].",
      "After the loop, swap the pivot (arr[high]) with arr[i+1] to place it in its final position.",
      "Pivot choice matters: random pivots or median-of-three avoid the O(n²) worst case on sorted inputs.",
    ],
    useCases: [
      "General-purpose in-memory sorting — used in C's qsort, Java's Arrays.sort for primitives, and many standard libraries.",
      "Cache-friendly access patterns make it faster than Merge Sort in practice despite the same asymptotic complexity.",
    ],
    comparisonNote:
      "Quick Sort is typically the fastest practical sorting algorithm but has O(n²) worst case on already-sorted data with a bad pivot choice. Merge Sort guarantees O(n log n) and is stable but uses O(n) extra space. For a guaranteed-O(n log n) in-place sort, use Heap Sort.",
  },
};

