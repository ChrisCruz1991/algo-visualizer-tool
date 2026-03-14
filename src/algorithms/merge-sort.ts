import type { AlgorithmModule, SortStep } from "@/engine/types";


const code = `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`;

type State = { comparisons: number; swaps: number };

function* mergeSortHelper(
  arr: number[],
  left: number,
  right: number,
  state: State,
  sortedIndices: number[]
): Generator<SortStep> {
  if (right - left <= 1) return;

  const mid = Math.floor((left + right) / 2);

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: Array.from({ length: right - left }, (_, i) => left + i),
    swappingIndices: [],
    sortedIndices: [...sortedIndices],
    highlightedLines: [3],
    description: `Dividing: splitting indices ${left}–${right - 1} at midpoint ${mid}`,
    comparisons: state.comparisons,
    swaps: state.swaps,
  };

  yield* mergeSortHelper(arr, left, mid, state, sortedIndices);
  yield* mergeSortHelper(arr, mid, right, state, sortedIndices);
  yield* mergeStep(arr, left, mid, right, state, sortedIndices);
}

function* mergeStep(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  state: State,
  sortedIndices: number[]
): Generator<SortStep> {
  const leftArr = arr.slice(left, mid);
  const rightArr = arr.slice(mid, right);
  let i = 0,
    j = 0,
    k = left;

  while (i < leftArr.length && j < rightArr.length) {
    state.comparisons++;
    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [left + i, mid + j],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      highlightedLines: [13],
      description: `Merging: comparing ${leftArr[i]} (left[${i}]) with ${rightArr[j]} (right[${j}])`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    state.swaps++;
    k++;

    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [],
      swappingIndices: [k - 1],
      sortedIndices: [...sortedIndices],
      highlightedLines: [14],
      description: `Placing ${arr[k - 1]} at index ${k - 1}`,
      comparisons: state.comparisons,
      swaps: state.swaps,
    };
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i];
    state.swaps++;
    i++;
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j];
    state.swaps++;
    j++;
    k++;
  }

  // Mark this merged region as sorted if it covers the full array segment
  const newSorted = [...sortedIndices];
  for (let idx = left; idx < right; idx++) {
    if (!newSorted.includes(idx)) newSorted.push(idx);
  }

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: newSorted,
    highlightedLines: [19],
    description: `Merged indices ${left}–${right - 1} into sorted order`,
    comparisons: state.comparisons,
    swaps: state.swaps,
  };

  // Update the caller's sorted tracking
  for (const idx of newSorted) {
    if (!sortedIndices.includes(idx)) sortedIndices.push(idx);
  }
}

function* mergeSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const state: State = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [];

  yield* mergeSortHelper(arr, 0, arr.length, state, sortedIndices);

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

export const mergeSort: AlgorithmModule = {
  id: "merge-sort",
  name: "Merge Sort",
  category: "sorting",
  code,
  codeLineCount: 20,
  generator: mergeSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n log n)", space: "O(n)" },
    { case: "Average", time: "O(n log n)", space: "O(n)" },
    { case: "Worst", time: "O(n log n)", space: "O(n)" },
  ],
  description: {
    what: "Merge Sort is a divide-and-conquer algorithm that recursively splits the array in half, sorts each half, and then merges the two sorted halves back together. It guarantees O(n log n) performance in all cases.",
    how: [
      "Divide: Split the array into two halves at the midpoint.",
      "Conquer: Recursively sort each half (base case: an array of 0 or 1 element is already sorted).",
      "Merge: Combine the two sorted halves by repeatedly taking the smaller of the two front elements.",
      "The merge step produces a fully sorted array from two sorted sub-arrays.",
    ],
    implementation: [
      "The recursive split continues until sub-arrays have length 1.",
      "The merge function uses two pointers — one for each half — advancing whichever points to the smaller element.",
      "Merge Sort requires O(n) auxiliary space for the temporary arrays used during merging.",
      "An iterative (bottom-up) variant avoids recursion by starting with sub-arrays of size 1 and doubling the merge size each pass.",
    ],
    useCases: [
      "External sorting — when data doesn't fit in memory, merge sort's sequential access pattern is ideal for disk-based sorting.",
      "Stable sorting — merge sort preserves the relative order of equal elements, required in many database operations.",
      "Linked lists — merge sort works efficiently on linked lists without extra space.",
    ],
    comparisonNote:
      "Merge Sort is the best choice when stability is required or when sorting linked lists. It guarantees O(n log n) unlike Quick Sort, which has O(n²) worst case. The trade-off is O(n) auxiliary space. For in-place sorting with similar performance, consider Heap Sort.",
  },
};

