import type { AlgorithmModule, SearchStep } from "@/engine/types";


const code = `function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`;

function* binarySearchGenerator(
  input: number[],
  target = 0
): Generator<SearchStep> {
  const arr = [...input];
  const targetIndex = arr.indexOf(target);
  let low = 0;
  let high = arr.length - 1;
  const searched: number[] = [];
  let comparisons = 0;

  yield {
    type: "search",
    array: [...arr],
    comparingIndices: [],
    foundIndex: null,
    searchedIndices: [],
    targetIndex,
    highlightedLines: [2],
    description: `Starting Binary Search for ${target}. Search range: [0, ${arr.length - 1}]`,
    comparisons,
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;

    yield {
      type: "search",
      array: [...arr],
      comparingIndices: [mid],
      foundIndex: null,
      searchedIndices: [...searched],
      targetIndex,
      highlightedLines: [5],
      description: `Mid = ${mid}, arr[${mid}] = ${arr[mid]}. Search range: [${low}, ${high}]`,
      comparisons,
    };

    if (arr[mid] === target) {
      yield {
        type: "search",
        array: [...arr],
        comparingIndices: [],
        foundIndex: mid,
        searchedIndices: [...searched],
        targetIndex,
        highlightedLines: [6],
        description: `Found! ${target} is at index ${mid}.`,
        comparisons,
      };
      return;
    } else if (arr[mid] < target) {
      // Mark left side (below mid) as searched
      for (let i = low; i <= mid; i++) {
        if (!searched.includes(i)) searched.push(i);
      }
      yield {
        type: "search",
        array: [...arr],
        comparingIndices: [],
        foundIndex: null,
        searchedIndices: [...searched],
        targetIndex,
        highlightedLines: [8],
        description: `arr[${mid}] = ${arr[mid]} < ${target}: target is in the right half. New range: [${mid + 1}, ${high}]`,
        comparisons,
      };
      low = mid + 1;
    } else {
      // Mark right side (above mid) as searched
      for (let i = mid; i <= high; i++) {
        if (!searched.includes(i)) searched.push(i);
      }
      yield {
        type: "search",
        array: [...arr],
        comparingIndices: [],
        foundIndex: null,
        searchedIndices: [...searched],
        targetIndex,
        highlightedLines: [10],
        description: `arr[${mid}] = ${arr[mid]} > ${target}: target is in the left half. New range: [${low}, ${mid - 1}]`,
        comparisons,
      };
      high = mid - 1;
    }
  }

  yield {
    type: "search",
    array: [...arr],
    comparingIndices: [],
    foundIndex: null,
    searchedIndices: [...searched],
    targetIndex,
    highlightedLines: [13],
    description: `${target} was not found in the array. Search exhausted.`,
    comparisons,
  };
}

export const binarySearch: AlgorithmModule = {
  id: "binary-search",
  name: "Binary Search",
  category: "searching",
  code,
  codeLineCount: 15,
  generator: binarySearchGenerator as (
    input: number[],
    target?: number
  ) => Generator<SearchStep>,
  complexity: [
    { case: "Best", time: "O(1)", space: "O(1)" },
    { case: "Average", time: "O(log n)", space: "O(1)" },
    { case: "Worst", time: "O(log n)", space: "O(1)" },
  ],
  description: {
    what: "Binary Search efficiently finds a target value in a sorted array by repeatedly halving the search space. It compares the target to the middle element and discards the half that cannot contain the target.",
    how: [
      "Requires a sorted array as input.",
      "Set low = 0, high = n-1 as the initial search bounds.",
      "Calculate mid = floor((low + high) / 2).",
      "If arr[mid] equals the target, return mid.",
      "If arr[mid] < target, the target is in the right half — set low = mid + 1.",
      "If arr[mid] > target, the target is in the left half — set high = mid - 1.",
      "Repeat until low > high (not found) or the target is found.",
    ],
    implementation: [
      "Use integer division to compute mid — avoid (low + high) / 2 which can overflow in some languages; prefer low + (high - low) / 2.",
      "The loop invariant: if the target exists, it is always within [low, high].",
      "The iterative version is preferred over recursion to avoid stack overhead.",
      "The input must be sorted — binary search gives incorrect results on unsorted arrays.",
    ],
    useCases: [
      "Database indexing — B-trees use binary search principles for fast record lookup.",
      "Standard library search functions — Python's bisect, Java's Collections.binarySearch.",
      "Finding boundaries — binary search is used to find the first/last occurrence of a value.",
      "Solving optimization problems — 'binary search on the answer' technique in competitive programming.",
    ],
    comparisonNote:
      "Binary Search is the gold standard for searching sorted arrays at O(log n). For unsorted data, use Linear Search. For repeated searches on dynamic data, a balanced BST or hash table may be more appropriate. Binary Search is always preferred over Linear Search when the data is sorted.",
  },
};

