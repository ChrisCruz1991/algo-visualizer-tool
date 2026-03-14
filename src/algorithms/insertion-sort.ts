import type { AlgorithmModule, SortStep } from "@/engine/types";


const code = `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`;

function* insertionSortGenerator(input: number[]): Generator<SortStep> {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  // Initially index 0 is "sorted"
  const sorted: number[] = [0];

  for (let i = 1; i < n; i++) {
    const key = arr[i];

    yield {
      type: "sort",
      array: [...arr],
      comparingIndices: [i],
      swappingIndices: [],
      sortedIndices: [...sorted],
      highlightedLines: [3],
      description: `Picking up key = ${key} at index ${i} to insert into the sorted portion`,
      comparisons,
      swaps,
    };

    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      comparisons++;
      arr[j + 1] = arr[j];
      swaps++;
      yield {
        type: "sort",
        array: [...arr],
        comparingIndices: [j],
        swappingIndices: [j + 1],
        sortedIndices: sorted.filter((s) => s < j),
        highlightedLines: [6],
        description: `Shifting ${arr[j + 1]} from index ${j} to index ${j + 1} to make room for ${key}`,
        comparisons,
        swaps,
      };
      j--;
    }

    if (j + 1 !== i) {
      arr[j + 1] = key;
      yield {
        type: "sort",
        array: [...arr],
        comparingIndices: [],
        swappingIndices: [j + 1],
        sortedIndices: [...sorted, j + 1].sort((a, b) => a - b),
        highlightedLines: [9],
        description: `Inserting ${key} at index ${j + 1}`,
        comparisons,
        swaps,
      };
    }

    sorted.push(i);
    sorted.sort((a, b) => a - b);
  }

  yield {
    type: "sort",
    array: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    highlightedLines: [11],
    description: "Array is fully sorted!",
    comparisons,
    swaps,
  };
}

export const insertionSort: AlgorithmModule = {
  id: "insertion-sort",
  name: "Insertion Sort",
  category: "sorting",
  code,
  codeLineCount: 12,
  generator: insertionSortGenerator as (input: number[]) => Generator<SortStep>,
  complexity: [
    { case: "Best", time: "O(n)", space: "O(1)" },
    { case: "Average", time: "O(n²)", space: "O(1)" },
    { case: "Worst", time: "O(n²)", space: "O(1)" },
  ],
  description: {
    what: "Insertion Sort builds a sorted array one element at a time by picking each element and inserting it into its correct position within the already-sorted portion. It mimics the way people sort playing cards in their hand.",
    how: [
      "Start with the first element — a single-element array is trivially sorted.",
      "Pick the next element (the 'key').",
      "Scan backwards through the sorted portion, shifting each element one position right while it is greater than the key.",
      "Insert the key into the gap left by the shifts.",
      "Repeat until all elements have been inserted.",
    ],
    implementation: [
      "Outer loop starts at index 1, treating index 0 as already sorted.",
      "Inner while loop shifts elements right as long as they exceed the key.",
      "The key is placed at j+1 after the while loop exits — this is where the gap is.",
      "Unlike Bubble Sort, Insertion Sort moves elements with assignments (not swaps), which is faster in practice.",
    ],
    useCases: [
      "Small arrays (n < 50) — used as the base case in hybrid sorts like Timsort and Introsort.",
      "Nearly-sorted data — achieves O(n) time when the array is already almost sorted.",
      "Online sorting — can sort a stream of data as it arrives, one element at a time.",
    ],
    comparisonNote:
      "Insertion Sort is generally the best simple O(n²) algorithm. It outperforms Bubble Sort and Selection Sort on nearly-sorted data and is the algorithm of choice for small sub-arrays in production sort implementations (e.g., Python's Timsort uses it for runs shorter than 64 elements).",
  },
};

