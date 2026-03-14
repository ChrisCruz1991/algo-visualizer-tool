import type { AlgorithmModule, SortStep } from "@/engine/types";


const code = `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`;

function* selectionSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const n = arr.length;
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [i],
      swappingIndices: [],
      sortedIndices: [...sorted],
      highlightedLines: [4],
      description: `Pass ${i + 1}: Looking for the minimum in the unsorted portion starting at index ${i}`,
      comparisons,
      swaps,
    };

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      yield {
        type: "sort",
        array: [...arr],
        comparingIndices: [j, minIdx],
        swappingIndices: [],
        sortedIndices: [...sorted],
        highlightedLines: [5],
        description: `Comparing index ${j} (value: ${arr[j]}) with current minimum at index ${minIdx} (value: ${arr[minIdx]})`,
        comparisons,
        swaps,
      };

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        yield {
          type: "sort",
          array: [...arr],
          comparingIndices: [minIdx],
          swappingIndices: [],
          sortedIndices: [...sorted],
          highlightedLines: [6],
          description: `New minimum found: ${arr[minIdx]} at index ${minIdx}`,
          comparisons,
          swaps,
        };
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      yield {
        type: "sort",
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [i, minIdx],
        sortedIndices: [...sorted],
        highlightedLines: [10],
        description: `Swapping minimum value ${arr[i]} (from index ${minIdx}) into position ${i}`,
        comparisons,
        swaps,
      };
    }

    sorted.push(i);
  }

  sorted.push(n - 1);
  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [...sorted],
    highlightedLines: [14],
    description: "Array is fully sorted!",
    comparisons,
    swaps,
  };
}

export const selectionSort: AlgorithmModule = {
  id: "selection-sort",
  name: "Selection Sort",
  category: "sorting",
  code,
  codeLineCount: 15,
  generator: selectionSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n²)", space: "O(1)" },
    { case: "Average", time: "O(n²)", space: "O(1)" },
    { case: "Worst", time: "O(n²)", space: "O(1)" },
  ],
  description: {
    what: "Selection Sort divides the array into a sorted and unsorted region. On each pass, it finds the minimum element in the unsorted region and moves it to the end of the sorted region. Unlike Bubble Sort, it makes at most n-1 swaps regardless of the input.",
    how: [
      "Start with the entire array as the unsorted region.",
      "Scan the unsorted region to find the index of the minimum value.",
      "Swap the minimum with the first element of the unsorted region.",
      "The sorted region grows by one element. Shrink the unsorted region.",
      "Repeat until the unsorted region has one element.",
    ],
    implementation: [
      "Outer loop runs from index 0 to n-2. At each step, index i is the boundary between sorted and unsorted.",
      "Inner loop scans from i+1 to n-1, tracking the index of the minimum value found so far.",
      "Only perform the swap if minIdx !== i (no unnecessary swaps for already-correct elements).",
      "Selection Sort always performs exactly O(n²) comparisons, but O(n) swaps — ideal when swapping is expensive.",
    ],
    useCases: [
      "Systems where write operations (swaps) are costly, such as flash memory.",
      "Small arrays where simplicity is valued over performance.",
    ],
    comparisonNote:
      "Selection Sort performs the same number of comparisons as Bubble Sort but fewer swaps. However, Insertion Sort is generally preferred for small arrays because it is adaptive (faster on nearly-sorted data). For large inputs, use Merge Sort or Quick Sort.",
  },
};

