import type { AlgorithmModule, SortStep } from "@/engine/types";


const code = `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`;

function* bubbleSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const n = arr.length;
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      yield {
        type: "sort",
        array: [...arr],
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        sortedIndices: [...sorted],
        highlightedLines: [5],
        description: `Comparing index ${j} (value: ${arr[j]}) with index ${j + 1} (value: ${arr[j + 1]})`,
        comparisons,
        swaps,
      };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        yield {
          type: "sort",
          array: [...arr],
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          sortedIndices: [...sorted],
          highlightedLines: [6],
          description: `Swapping: ${arr[j + 1]} > ${arr[j]} — values at indices ${j} and ${j + 1} exchanged`,
          comparisons,
          swaps,
        };
      }
    }
    sorted.unshift(n - 1 - i);
  }

  sorted.unshift(0);
  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [...sorted],
    highlightedLines: [10],
    description: "Array is fully sorted!",
    comparisons,
    swaps,
  };
}

export const bubbleSort: AlgorithmModule = {
  id: "bubble-sort",
  name: "Bubble Sort",
  category: "sorting",
  code,
  codeLineCount: 11,
  generator: bubbleSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n)", space: "O(1)" },
    { case: "Average", time: "O(n²)", space: "O(1)" },
    { case: "Worst", time: "O(n²)", space: "O(1)" },
  ],
  description: {
    what: "Bubble Sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The largest unsorted element 'bubbles up' to its correct position on each pass.",
    how: [
      "Start at the beginning of the array.",
      "Compare the first two adjacent elements. If the left is greater than the right, swap them.",
      "Move one position forward and repeat the comparison.",
      "After one full pass, the largest element is at the end — mark it as sorted.",
      "Repeat for the remaining unsorted portion (n-1 passes total).",
    ],
    implementation: [
      "Use two nested loops: outer loop controls passes (0 to n-2), inner loop does comparisons (0 to n-i-2).",
      "The inner loop's upper bound shrinks each pass because the rightmost elements are already sorted.",
      "An optimization: track whether any swap occurred in a pass. If no swaps, the array is already sorted — exit early (achieves O(n) best case).",
    ],
    useCases: [
      "Educational purposes — its simplicity makes it ideal for teaching sorting concepts.",
      "Nearly-sorted small datasets where the early-exit optimization kicks in quickly.",
    ],
    comparisonNote:
      "Bubble Sort is rarely used in production. Prefer Insertion Sort for small or nearly-sorted arrays (same O(n²) worst case but fewer swaps and better cache performance). For general-purpose sorting, use Merge Sort or Quick Sort.",
  },
};

